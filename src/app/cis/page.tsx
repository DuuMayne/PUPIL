import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { Control, MaturityLevel, FUNCTION_LABELS, FUNCTION_COLORS } from '@/lib/types';
import MaturityBadge from '@/components/MaturityBadge';
import CisIgSelector from '@/components/CisIgSelector';
import CisTargetEditor from '@/components/CisTargetEditor';

export const dynamic = 'force-dynamic';

const CIS_FRAMEWORK_ID = 2;

interface CrosswalkRow {
  safeguard_code: string;
  csf_subcategory_code: string;
  relationship: string;
}

function FunctionBadge({ code }: { code: string | null }) {
  if (!code) return null;
  const color = FUNCTION_COLORS[code] ?? '#94a3b8';
  return (
    <span
      title={FUNCTION_LABELS[code] ?? code}
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {code}
    </span>
  );
}

export default function CisPage() {
  seedDatabase();
  const db = getDb();

  const controls = db.prepare(
    `SELECT * FROM controls WHERE framework_id = ? AND level = 'category' ORDER BY sort_order`
  ).all(CIS_FRAMEWORK_ID) as Control[];

  const safeguards = db.prepare(
    `SELECT * FROM controls WHERE framework_id = ? AND level = 'subcategory' ORDER BY parent_id, sort_order`
  ).all(CIS_FRAMEWORK_ID) as Control[];

  const latestAssessment = db.prepare(
    `SELECT id, title, assessed_at FROM assessments WHERE framework_id = ? AND status = 'published' ORDER BY assessed_at DESC, created_at DESC LIMIT 1`
  ).get(CIS_FRAMEWORK_ID) as { id: string; title: string; assessed_at: string | null } | undefined;

  const scoreMap = new Map<string, number>();
  if (latestAssessment) {
    const scores = db.prepare(
      `SELECT control_id, score FROM assessment_scores WHERE assessment_id = ? AND score IS NOT NULL`
    ).all(latestAssessment.id) as { control_id: string; score: number }[];
    for (const s of scores) scoreMap.set(s.control_id, s.score);
  }

  const targets = db.prepare(`SELECT control_id, target_score FROM targets WHERE framework_id = ?`).all(CIS_FRAMEWORK_ID) as { control_id: string; target_score: number }[];
  const targetMap = new Map(targets.map((t) => [t.control_id, t.target_score]));

  const selectedIgRow = db.prepare('SELECT selected_ig FROM cis_settings WHERE id = 1').get() as { selected_ig: 1 | 2 | 3 | null } | undefined;
  const selectedIg = selectedIgRow?.selected_ig ?? null;

  const crosswalk = db.prepare('SELECT * FROM cis_nist_crosswalk').all() as CrosswalkRow[];
  const crosswalkBySafeguard = new Map<string, CrosswalkRow[]>();
  for (const x of crosswalk) {
    const list = crosswalkBySafeguard.get(x.safeguard_code) ?? [];
    list.push(x);
    crosswalkBySafeguard.set(x.safeguard_code, list);
  }

  const igCounts: Record<1 | 2 | 3, number> = {
    1: safeguards.filter((s) => (s.min_ig ?? 3) <= 1).length,
    2: safeguards.filter((s) => (s.min_ig ?? 3) <= 2).length,
    3: safeguards.filter((s) => (s.min_ig ?? 3) <= 3).length,
  };

  const inScopeCount = targetMap.size;
  const scoredCount = safeguards.filter((s) => scoreMap.has(s.id)).length;

  const gapItems = safeguards
    .filter((s) => targetMap.has(s.id))
    .map((s) => {
      const current = scoreMap.get(s.id) ?? null;
      const target = targetMap.get(s.id)!;
      return { safeguard: s, current, target, gap: current === null ? null : target - current };
    })
    .filter((item) => item.gap === null || item.gap > 0)
    .sort((a, b) => {
      if (a.gap === null && b.gap === null) return 0;
      if (a.gap === null) return -1;
      if (b.gap === null) return 1;
      return b.gap - a.gap;
    });

  const safeguardsByControl = new Map<string, Control[]>();
  for (const s of safeguards) {
    const list = safeguardsByControl.get(s.parent_id ?? '') ?? [];
    list.push(s);
    safeguardsByControl.set(s.parent_id ?? '', list);
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">CIS Controls v8.1</h1>
        <p className="text-slate-500 text-sm mt-1">
          18 Controls · 153 Safeguards
          {latestAssessment ? ` · Current: ${latestAssessment.title} (${latestAssessment.assessed_at ?? 'no date'})` : ' · No published CIS assessment yet'}
        </p>
      </div>

      <CisIgSelector selectedIg={selectedIg} counts={igCounts} total={safeguards.length} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">In Scope</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{inScopeCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">of {safeguards.length} safeguards</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Scored</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{scoredCount}</p>
          <p className="text-xs text-slate-400 mt-0.5">of {safeguards.length} safeguards</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Gaps</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{gapItems.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">below target or unassessed</p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">At Target</p>
          <p className="text-3xl font-bold text-emerald-600 mt-2">{inScopeCount - gapItems.length}</p>
          <p className="text-xs text-slate-400 mt-0.5">in-scope safeguards</p>
        </div>
      </div>

      {gapItems.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-red-50 border-b border-red-200">
            <h2 className="font-semibold text-red-700 text-sm">Priority Gaps</h2>
            <p className="text-xs text-red-700/70 mt-0.5">{gapItems.length} in-scope safeguard{gapItems.length === 1 ? '' : 's'} below target</p>
          </div>
          <div className="divide-y divide-slate-50">
            {gapItems.map(({ safeguard, current, target }) => {
              const related = crosswalkBySafeguard.get(safeguard.code) ?? [];
              return (
                <div key={safeguard.id} className="px-5 py-4">
                  <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="min-w-0 flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{safeguard.code}</span>
                      <FunctionBadge code={safeguard.function_code} />
                      <span className="text-sm font-medium text-slate-800">{safeguard.title}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <MaturityBadge score={current !== null ? (Math.round(current) as MaturityLevel) : null} showLabel={false} size="sm" />
                      <span className="text-slate-400 text-xs">→</span>
                      <MaturityBadge score={target as MaturityLevel} showLabel={false} size="sm" />
                    </div>
                  </div>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">Implement: {safeguard.description}</p>
                  {related.length > 0 && (
                    <p className="text-xs text-slate-400 mt-1">
                      Related: {related.map((r) => `NIST ${r.csf_subcategory_code} (${r.relationship})`).join(', ')}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div>
        <h2 className="font-semibold text-slate-900 mb-3">Controls Catalog</h2>
        <div className="space-y-4">
          {controls.map((control) => {
            const controlSafeguards = safeguardsByControl.get(control.id) ?? [];
            return (
              <div key={control.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
                  <p className="font-semibold text-slate-800 text-sm">
                    <span className="font-mono text-slate-400 mr-2">{control.code}</span>
                    {control.title}
                  </p>
                  {control.description && <p className="text-xs text-slate-500 mt-0.5">{control.description}</p>}
                </div>
                <div className="divide-y divide-slate-50">
                  {controlSafeguards.map((s) => {
                    const current = scoreMap.get(s.id) ?? null;
                    const target = targetMap.get(s.id) ?? null;
                    return (
                      <div key={s.id} className="px-5 py-4 flex items-start justify-between gap-4">
                        <div className="min-w-0 flex items-center gap-2 pt-2">
                          <span className="font-mono text-xs text-slate-400">{s.code}</span>
                          <FunctionBadge code={s.function_code} />
                          <span className="text-[11px] font-medium text-slate-400 border border-slate-200 rounded px-1">IG{s.min_ig}</span>
                          <span className="text-sm text-slate-700">{s.title}</span>
                          <span className="text-slate-300 mx-1">·</span>
                          <span className="text-xs text-slate-400">Current:</span>
                          <MaturityBadge score={current !== null ? (Math.round(current) as MaturityLevel) : null} showLabel={false} size="sm" />
                        </div>
                        <div className="shrink-0 flex flex-col items-end gap-1">
                          <span className="text-[11px] text-slate-400">Target</span>
                          <CisTargetEditor controlId={s.id} initialTarget={target} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
