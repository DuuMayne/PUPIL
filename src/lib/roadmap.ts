import Database from 'better-sqlite3';
import { MaturityLevel, MATURITY_LABELS, FUNCTION_LABELS } from './types';
import { CONTROL_DESCRIPTORS } from './descriptors';

const FUNCTION_ORDER = ['GV', 'ID', 'PR', 'DE', 'RS', 'RC'] as const;

export interface FunctionRadarPoint {
  code: string;
  title: string;
  current: number | null;
  target: number | null;
}

export interface RoadmapItem {
  code: string;
  title: string;
  functionCode: string;
  current: number | null;
  target: number;
  gap: number | null;
  targetLevel: MaturityLevel;
  currentLevel: MaturityLevel | null;
  targetDescriptor: string | null;
  currentDescriptor: string | null;
  related: { safeguardCode: string; relationship: string }[];
}

export interface RoadmapPhase {
  phase: 1 | 2 | 3;
  label: string;
  items: RoadmapItem[];
}

export interface RoadmapData {
  hasPublishedAssessment: boolean;
  hasTargets: boolean;
  latestAssessmentTitle: string | null;
  latestAssessmentDate: string | null;
  radarData: FunctionRadarPoint[];
  phases: RoadmapPhase[];
  unassessedWithTarget: RoadmapItem[];
  summary: {
    overallCurrentAvg: number | null;
    overallTargetAvg: number | null;
    overallGap: number | null;
    urgentCount: number;
  };
}

// A target is rounded UP (never to nearest) when looking up a descriptor,
// because the descriptor at level N describes "what it looks like to BE at
// level N" — a fractional target like 2.5 means the goal is above level 2,
// so showing the level-2 text would understate what's actually required.
export function roundTargetForDescriptor(target: number): MaturityLevel {
  return Math.min(5, Math.max(1, Math.ceil(target))) as MaturityLevel;
}

function descriptorFor(code: string, level: MaturityLevel | null): string | null {
  if (level === null) return null;
  return CONTROL_DESCRIPTORS[code]?.[level] ?? null;
}

function templateRecommendation(targetLevel: MaturityLevel, descriptor: string | null): string | null {
  if (!descriptor) return null;
  return `To reach Level ${targetLevel} (${MATURITY_LABELS[targetLevel]}): ${descriptor}`;
}

export function getRoadmapData(db: Database.Database, frameworkId = 1): RoadmapData {
  const latestAssessment = db.prepare(
    `SELECT id, title, assessed_at FROM assessments WHERE status = 'published' AND framework_id = ? ORDER BY assessed_at DESC, created_at DESC LIMIT 1`
  ).get(frameworkId) as { id: string; title: string; assessed_at: string | null } | undefined;

  const functions = db.prepare(
    `SELECT id, code, title FROM controls WHERE level = 'function' AND framework_id = ? ORDER BY sort_order`
  ).all(frameworkId) as { id: string; code: string; title: string }[];

  const targets = db.prepare(
    `SELECT control_id, target_score FROM targets WHERE framework_id = ?`
  ).all(frameworkId) as { control_id: string; target_score: number }[];
  const targetMap = new Map(targets.map((t) => [t.control_id, t.target_score]));
  const hasTargets = targets.length > 0;

  const scoreMap = new Map<string, number>();
  if (latestAssessment) {
    const scores = db.prepare(
      `SELECT control_id, score FROM assessment_scores WHERE assessment_id = ? AND score IS NOT NULL`
    ).all(latestAssessment.id) as { control_id: string; score: number }[];
    for (const s of scores) scoreMap.set(s.control_id, s.score);
  }

  const crosswalk = db.prepare('SELECT safeguard_code, csf_subcategory_code, relationship FROM cis_nist_crosswalk').all() as { safeguard_code: string; csf_subcategory_code: string; relationship: string }[];
  const crosswalkBySubcategory = new Map<string, { safeguardCode: string; relationship: string }[]>();
  for (const x of crosswalk) {
    const list = crosswalkBySubcategory.get(x.csf_subcategory_code) ?? [];
    list.push({ safeguardCode: x.safeguard_code, relationship: x.relationship });
    crosswalkBySubcategory.set(x.csf_subcategory_code, list);
  }

  const radarData: FunctionRadarPoint[] = [];
  const phase1: RoadmapItem[] = [];
  const phase2: RoadmapItem[] = [];
  const phase3: RoadmapItem[] = [];
  const unassessedWithTarget: RoadmapItem[] = [];

  const allCurrent: number[] = [];
  const allTarget: number[] = [];

  for (const fn of functions) {
    const subcategories = db.prepare(
      `SELECT id, code, title FROM controls
       WHERE level = 'subcategory' AND parent_id IN (
         SELECT id FROM controls WHERE level = 'category' AND parent_id = ?
       )`
    ).all(fn.id) as { id: string; code: string; title: string }[];

    const fnCurrentScores: number[] = [];
    const fnTargetScores: number[] = [];

    for (const sub of subcategories) {
      const current = scoreMap.get(sub.id) ?? null;
      const target = targetMap.get(sub.id) ?? null;

      if (current !== null) {
        fnCurrentScores.push(current);
        allCurrent.push(current);
      }
      if (target !== null) {
        fnTargetScores.push(target);
        allTarget.push(target);
      }

      if (target === null) continue; // no target set — not applicable

      const targetLevel = roundTargetForDescriptor(target);

      if (current === null) {
        unassessedWithTarget.push({
          code: sub.code,
          title: sub.title,
          functionCode: fn.code,
          current: null,
          target,
          gap: null,
          targetLevel,
          currentLevel: null,
          targetDescriptor: descriptorFor(sub.code, targetLevel),
          currentDescriptor: null,
          related: crosswalkBySubcategory.get(sub.code) ?? [],
        });
        continue;
      }

      const gap = target - current;
      if (gap <= 0) continue; // already met or exceeded — not an action item

      const currentLevel = Math.round(current) as MaturityLevel;
      const item: RoadmapItem = {
        code: sub.code,
        title: sub.title,
        functionCode: fn.code,
        current,
        target,
        gap,
        targetLevel,
        currentLevel,
        targetDescriptor: descriptorFor(sub.code, targetLevel),
        currentDescriptor: descriptorFor(sub.code, currentLevel),
        related: crosswalkBySubcategory.get(sub.code) ?? [],
      };

      if (gap >= 1.5) phase1.push(item);
      else if (gap >= 1) phase2.push(item);
      else phase3.push(item);
    }

    radarData.push({
      code: fn.code,
      title: fn.title,
      current: fnCurrentScores.length ? fnCurrentScores.reduce((a, b) => a + b, 0) / fnCurrentScores.length : null,
      target: fnTargetScores.length ? fnTargetScores.reduce((a, b) => a + b, 0) / fnTargetScores.length : null,
    });
  }

  const byGapDesc = (a: RoadmapItem, b: RoadmapItem) => (b.gap ?? 0) - (a.gap ?? 0);
  phase1.sort(byGapDesc);
  phase2.sort(byGapDesc);
  phase3.sort(byGapDesc);
  unassessedWithTarget.sort((a, b) => b.target - a.target);

  const overallCurrentAvg = allCurrent.length ? allCurrent.reduce((a, b) => a + b, 0) / allCurrent.length : null;
  const overallTargetAvg = allTarget.length ? allTarget.reduce((a, b) => a + b, 0) / allTarget.length : null;

  return {
    hasPublishedAssessment: !!latestAssessment,
    hasTargets,
    latestAssessmentTitle: latestAssessment?.title ?? null,
    latestAssessmentDate: latestAssessment?.assessed_at ?? null,
    radarData,
    phases: [
      { phase: 1, label: 'Urgent', items: phase1 },
      { phase: 2, label: 'High Priority', items: phase2 },
      { phase: 3, label: 'Planned', items: phase3 },
    ],
    unassessedWithTarget,
    summary: {
      overallCurrentAvg,
      overallTargetAvg,
      overallGap: overallCurrentAvg !== null && overallTargetAvg !== null ? overallTargetAvg - overallCurrentAvg : null,
      urgentCount: phase1.length,
    },
  };
}

// The two levels used for descriptor lookups round differently on purpose:
// currentLevel rounds to nearest (best factual read of where you are), while
// targetLevel always rounds up (see roundTargetForDescriptor). Don't "fix"
// this to be symmetric.
export function templateRecommendationText(item: RoadmapItem): string | null {
  return templateRecommendation(item.targetLevel, item.targetDescriptor);
}

const CIS_FRAMEWORK_ID = 2;

export interface CisRoadmapItem {
  code: string;
  title: string;
  controlNum: number;
  controlTitle: string;
  functionCode: string | null;
  current: number | null;
  target: number;
  gap: number | null;
  recommendation: string;
  related: { csfSubcategoryCode: string; relationship: string }[];
}

export interface CisRoadmapData {
  hasPublishedAssessment: boolean;
  hasTargets: boolean;
  latestAssessmentTitle: string | null;
  latestAssessmentDate: string | null;
  gapItems: CisRoadmapItem[];
  unassessedWithTarget: CisRoadmapItem[];
  summary: {
    inScopeCount: number;
    scoredCount: number;
    atTargetCount: number;
  };
}

// CIS Controls don't nest under a single function (most span several), and
// have no 1-5 maturity ladder like NIST's CONTROL_DESCRIPTORS — so this is a
// flat grouping by the 18 real Controls, not a radar, with the safeguard's
// own official description as the recommendation (never a hand-authored one).
export function getCisRoadmapData(db: Database.Database): CisRoadmapData {
  const latestAssessment = db.prepare(
    `SELECT id, title, assessed_at FROM assessments WHERE status = 'published' AND framework_id = ? ORDER BY assessed_at DESC, created_at DESC LIMIT 1`
  ).get(CIS_FRAMEWORK_ID) as { id: string; title: string; assessed_at: string | null } | undefined;

  const controls = db.prepare(
    `SELECT id, code, title FROM controls WHERE framework_id = ? AND level = 'category'`
  ).all(CIS_FRAMEWORK_ID) as { id: string; code: string; title: string }[];
  const controlByCode = new Map(controls.map((c) => [c.id, c]));

  const safeguards = db.prepare(
    `SELECT id, parent_id, code, title, description, function_code FROM controls WHERE framework_id = ? AND level = 'subcategory'`
  ).all(CIS_FRAMEWORK_ID) as { id: string; parent_id: string; code: string; title: string; description: string | null; function_code: string | null }[];

  const targets = db.prepare(`SELECT control_id, target_score FROM targets WHERE framework_id = ?`).all(CIS_FRAMEWORK_ID) as { control_id: string; target_score: number }[];
  const targetMap = new Map(targets.map((t) => [t.control_id, t.target_score]));
  const hasTargets = targets.length > 0;

  const scoreMap = new Map<string, number>();
  if (latestAssessment) {
    const scores = db.prepare(
      `SELECT control_id, score FROM assessment_scores WHERE assessment_id = ? AND score IS NOT NULL`
    ).all(latestAssessment.id) as { control_id: string; score: number }[];
    for (const s of scores) scoreMap.set(s.control_id, s.score);
  }

  const crosswalk = db.prepare('SELECT safeguard_code, csf_subcategory_code, relationship FROM cis_nist_crosswalk').all() as { safeguard_code: string; csf_subcategory_code: string; relationship: string }[];
  const crosswalkBySafeguard = new Map<string, { csfSubcategoryCode: string; relationship: string }[]>();
  for (const x of crosswalk) {
    const list = crosswalkBySafeguard.get(x.safeguard_code) ?? [];
    list.push({ csfSubcategoryCode: x.csf_subcategory_code, relationship: x.relationship });
    crosswalkBySafeguard.set(x.safeguard_code, list);
  }

  const gapItems: CisRoadmapItem[] = [];
  const unassessedWithTarget: CisRoadmapItem[] = [];
  let scoredCount = 0;
  let atTargetCount = 0;

  for (const s of safeguards) {
    const current = scoreMap.get(s.id) ?? null;
    const target = targetMap.get(s.id) ?? null;
    if (current !== null) scoredCount++;
    if (target === null) continue; // not in scope

    const control = controlByCode.get(s.parent_id);
    const item: CisRoadmapItem = {
      code: s.code,
      title: s.title,
      controlNum: control ? parseInt(control.code, 10) : 0,
      controlTitle: control?.title ?? '',
      functionCode: s.function_code,
      current,
      target,
      gap: current === null ? null : target - current,
      recommendation: `Implement: ${s.description ?? s.title}`,
      related: crosswalkBySafeguard.get(s.code) ?? [],
    };

    if (current === null) {
      unassessedWithTarget.push(item);
      continue;
    }
    if (current >= target) {
      atTargetCount++;
      continue;
    }
    gapItems.push(item);
  }

  gapItems.sort((a, b) => (b.gap ?? 0) - (a.gap ?? 0));
  unassessedWithTarget.sort((a, b) => a.controlNum - b.controlNum);

  return {
    hasPublishedAssessment: !!latestAssessment,
    hasTargets,
    latestAssessmentTitle: latestAssessment?.title ?? null,
    latestAssessmentDate: latestAssessment?.assessed_at ?? null,
    gapItems,
    unassessedWithTarget,
    summary: {
      inScopeCount: targetMap.size,
      scoredCount,
      atTargetCount,
    },
  };
}

// Every leaf control in both frameworks carries a function_code (NIST's is
// backfilled from its real parent chain, CIS's comes natively from the
// spreadsheet's Security Function column) — so a combined view groups by
// that tag directly instead of by either framework's structural hierarchy.
// controls.id is globally unique text across frameworks (NIST codes like
// "GV.OC-01", CIS ids prefixed "CIS-1.1"), so scores/targets merge safely.
export function getCombinedRadarData(db: Database.Database): FunctionRadarPoint[] {
  const scoreMap = new Map<string, number>();
  const targetMap = new Map<string, number>();

  for (const frameworkId of [1, 2]) {
    const latestAssessment = db.prepare(
      `SELECT id FROM assessments WHERE status = 'published' AND framework_id = ? ORDER BY assessed_at DESC, created_at DESC LIMIT 1`
    ).get(frameworkId) as { id: string } | undefined;

    if (latestAssessment) {
      const scores = db.prepare(
        `SELECT control_id, score FROM assessment_scores WHERE assessment_id = ? AND score IS NOT NULL`
      ).all(latestAssessment.id) as { control_id: string; score: number }[];
      for (const s of scores) scoreMap.set(s.control_id, s.score);
    }

    const targets = db.prepare(`SELECT control_id, target_score FROM targets WHERE framework_id = ?`).all(frameworkId) as { control_id: string; target_score: number }[];
    for (const t of targets) targetMap.set(t.control_id, t.target_score);
  }

  const leaves = db.prepare(
    `SELECT id, function_code FROM controls WHERE level = 'subcategory' AND function_code IS NOT NULL`
  ).all() as { id: string; function_code: string }[];

  return FUNCTION_ORDER.map((code) => {
    const group = leaves.filter((l) => l.function_code === code);
    const currentVals = group.map((l) => scoreMap.get(l.id)).filter((v): v is number => v !== undefined);
    const targetVals = group.map((l) => targetMap.get(l.id)).filter((v): v is number => v !== undefined);
    return {
      code,
      title: FUNCTION_LABELS[code] ?? code,
      current: currentVals.length ? currentVals.reduce((a, b) => a + b, 0) / currentVals.length : null,
      target: targetVals.length ? targetVals.reduce((a, b) => a + b, 0) / targetVals.length : null,
    };
  });
}
