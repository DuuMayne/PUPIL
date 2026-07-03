import Link from 'next/link';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { getRoadmapData, getCisRoadmapData, getCombinedRadarData, templateRecommendationText, RoadmapItem, CisRoadmapItem } from '@/lib/roadmap';
import { MaturityLevel, FUNCTION_COLORS } from '@/lib/types';
import MaturityBadge from '@/components/MaturityBadge';
import RoadmapRadar from '@/components/RoadmapRadar';

export const dynamic = 'force-dynamic';

interface CombinedItem {
  framework: 'NIST' | 'CIS';
  code: string;
  title: string;
  current: number | null;
  target: number;
  gap: number | null;
  recommendation: string | null;
}

function CombinedItemRow({ item }: { item: CombinedItem }) {
  return (
    <div className="px-5 py-4 border-t border-slate-100 first:border-t-0">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex items-center gap-2">
          <span
            className={`text-[11px] font-semibold px-1.5 py-0.5 rounded ${
              item.framework === 'NIST' ? 'bg-indigo-100 text-indigo-700' : 'bg-teal-100 text-teal-700'
            }`}
          >
            {item.framework}
          </span>
          <span className="font-mono text-xs text-slate-400">{item.code}</span>
          <span className="text-sm font-medium text-slate-800">{item.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <MaturityBadge score={item.current !== null ? (Math.round(item.current) as MaturityLevel) : null} showLabel={false} size="sm" />
          <span className="text-slate-400 text-xs">→</span>
          <MaturityBadge score={Math.round(item.target) as MaturityLevel} showLabel={false} size="sm" />
        </div>
      </div>
      {item.recommendation && (
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.recommendation}</p>
      )}
    </div>
  );
}

const PHASE_STYLES: Record<1 | 2 | 3, { header: string; border: string }> = {
  1: { header: 'bg-red-50 border-red-200 text-red-700', border: 'border-red-200' },
  2: { header: 'bg-orange-50 border-orange-200 text-orange-700', border: 'border-orange-200' },
  3: { header: 'bg-yellow-50 border-yellow-200 text-yellow-700', border: 'border-yellow-200' },
};

function FrameworkTabs({ active }: { active: 'nist' | 'cis' | 'combined' }) {
  return (
    <div className="flex gap-1 bg-slate-100 rounded-lg p-1 w-fit">
      {[
        { key: 'nist' as const, href: '/roadmap', label: 'NIST CSF 2.0' },
        { key: 'cis' as const, href: '/roadmap?framework=cis', label: 'CIS Controls v8.1' },
        { key: 'combined' as const, href: '/roadmap?framework=combined', label: 'Combined' },
      ].map((tab) => (
        <Link
          key={tab.key}
          href={tab.href}
          className={`px-3 py-1.5 rounded text-sm font-medium transition-colors ${
            active === tab.key ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          {tab.label}
        </Link>
      ))}
    </div>
  );
}

function RoadmapItemRow({ item }: { item: RoadmapItem }) {
  const recommendation = templateRecommendationText(item);
  return (
    <div className="px-5 py-4 border-t border-slate-100 first:border-t-0">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <span className="font-mono text-xs text-slate-400 mr-2">{item.code}</span>
          <span className="text-sm font-medium text-slate-800">{item.title}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <MaturityBadge score={item.currentLevel} showLabel={false} size="sm" />
          <span className="text-slate-400 text-xs">→</span>
          <MaturityBadge score={item.targetLevel} showLabel={false} size="sm" />
        </div>
      </div>
      {recommendation && (
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">{recommendation}</p>
      )}
      {item.related.length > 0 && (
        <p className="text-xs text-slate-400 mt-1">
          Related: {item.related.map((r) => `CIS Safeguard ${r.safeguardCode} (${r.relationship})`).join(', ')}
        </p>
      )}
    </div>
  );
}

function CisRoadmapItemRow({ item }: { item: CisRoadmapItem }) {
  const color = item.functionCode ? FUNCTION_COLORS[item.functionCode] ?? '#94a3b8' : null;
  return (
    <div className="px-5 py-4 border-t border-slate-100 first:border-t-0">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0 flex items-center gap-2">
          <span className="font-mono text-xs text-slate-400">{item.code}</span>
          {item.functionCode && color && (
            <span
              title={item.functionCode}
              className="inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-semibold"
              style={{ backgroundColor: `${color}22`, color }}
            >
              {item.functionCode}
            </span>
          )}
          <span className="text-sm font-medium text-slate-800">{item.title}</span>
          <span className="text-xs text-slate-400">({item.controlNum} — {item.controlTitle})</span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <MaturityBadge score={item.current !== null ? (Math.round(item.current) as MaturityLevel) : null} showLabel={false} size="sm" />
          <span className="text-slate-400 text-xs">→</span>
          <MaturityBadge score={item.target as MaturityLevel} showLabel={false} size="sm" />
        </div>
      </div>
      <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.recommendation}</p>
      {item.related.length > 0 && (
        <p className="text-xs text-slate-400 mt-1">
          Related: {item.related.map((r) => `NIST ${r.csfSubcategoryCode} (${r.relationship})`).join(', ')}
        </p>
      )}
    </div>
  );
}

export default async function RoadmapPage({ searchParams }: { searchParams: Promise<{ framework?: string }> }) {
  seedDatabase();
  const db = getDb();
  const { framework } = await searchParams;

  if (framework === 'combined') {
    const radarData = getCombinedRadarData(db);
    const nist = getRoadmapData(db, 1);
    const cis = getCisRoadmapData(db);

    const nistItems: CombinedItem[] = [
      ...nist.phases.flatMap((p) => p.items),
      ...nist.unassessedWithTarget,
    ].map((item) => ({
      framework: 'NIST' as const,
      code: item.code,
      title: item.title,
      current: item.current,
      target: item.target,
      gap: item.gap,
      recommendation: templateRecommendationText(item),
    }));

    const cisItems: CombinedItem[] = [
      ...cis.gapItems,
      ...cis.unassessedWithTarget,
    ].map((item) => ({
      framework: 'CIS' as const,
      code: item.code,
      title: item.title,
      current: item.current,
      target: item.target,
      gap: item.gap,
      recommendation: item.recommendation,
    }));

    const allItems = [...nistItems, ...cisItems];
    const unassessed = allItems.filter((i) => i.gap === null).sort((a, b) => b.target - a.target);
    const gaps = allItems.filter((i) => i.gap !== null).sort((a, b) => (b.gap ?? 0) - (a.gap ?? 0));

    const hasAnyPublished = nist.hasPublishedAssessment || cis.hasPublishedAssessment;
    const radarChartData = radarData.map((f) => ({ function: f.code, title: f.title, Current: f.current, Target: f.target }));

    if (!hasAnyPublished) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Strategic Roadmap</h1>
            <p className="text-slate-500 text-sm mt-1">Combined view · NIST CSF 2.0 + CIS Controls v8.1</p>
          </div>
          <FrameworkTabs active="combined" />
          <div className="bg-white border border-slate-200 rounded-lg px-6 py-10 text-center text-slate-400 text-sm">
            No published assessments yet in either framework.{' '}
            <Link href="/assessments/new" className="text-slate-600 underline hover:text-slate-900">
              Create one
            </Link>{' '}
            to see a combined roadmap here.
          </div>
        </div>
      );
    }

    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Strategic Roadmap</h1>
          <p className="text-slate-500 text-sm mt-1">Combined view · function-level posture across NIST CSF 2.0 and CIS Controls v8.1</p>
        </div>

        <FrameworkTabs active="combined" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">NIST Published</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{nist.hasPublishedAssessment ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">CIS Published</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{cis.hasPublishedAssessment ? 'Yes' : 'No'}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Combined Gaps</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{gaps.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Not Yet Assessed</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{unassessed.length}</p>
          </div>
        </div>

        <div>
          <h2 className="font-semibold text-slate-900 mb-3">Function-Level Radar (Combined)</h2>
          <RoadmapRadar data={radarChartData} />
        </div>

        {unassessed.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700 text-sm">Not Yet Assessed</h2>
              <p className="text-xs text-slate-400 mt-0.5">Targets are set but these controls have no current score, across both frameworks.</p>
            </div>
            {unassessed.map((item) => (
              <CombinedItemRow key={`${item.framework}-${item.code}`} item={item} />
            ))}
          </div>
        )}

        {gaps.length > 0 && (
          <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b bg-red-50 border-red-200 text-red-700">
              <h2 className="font-semibold text-sm">Priority Gaps (Combined)</h2>
              <p className="text-xs opacity-75 mt-0.5">{gaps.length} item{gaps.length === 1 ? '' : 's'}, sorted by gap size</p>
            </div>
            {gaps.map((item) => (
              <CombinedItemRow key={`${item.framework}-${item.code}`} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  }

  if (framework === 'cis') {
    const roadmap = getCisRoadmapData(db);

    if (!roadmap.hasPublishedAssessment) {
      return (
        <div className="space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Strategic Roadmap</h1>
            <p className="text-slate-500 text-sm mt-1">CIS Controls v8.1 · Auto-generated priority actions</p>
          </div>
          <FrameworkTabs active="cis" />
          <div className="bg-white border border-slate-200 rounded-lg px-6 py-10 text-center text-slate-400 text-sm">
            No published CIS assessment yet.{' '}
            <Link href="/assessments/new" className="text-slate-600 underline hover:text-slate-900">
              Create one
            </Link>{' '}
            to see a roadmap here.
          </div>
        </div>
      );
    }

    const { summary } = roadmap;

    return (
      <div className="space-y-8">
        <div className="flex items-start justify-between flex-wrap gap-2">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Strategic Roadmap</h1>
            <p className="text-slate-500 text-sm mt-1">
              {roadmap.latestAssessmentTitle
                ? `Current: ${roadmap.latestAssessmentTitle} (${roadmap.latestAssessmentDate ?? 'no date'})`
                : 'CIS Controls v8.1 · Auto-generated priority actions'}
            </p>
          </div>
          {!roadmap.hasTargets && (
            <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
              No Implementation Group selected. Pick one on the{' '}
              <Link href="/cis" className="underline">CIS Controls</Link> page.
            </p>
          )}
        </div>

        <FrameworkTabs active="cis" />

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">In Scope</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{summary.inScopeCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Scored</p>
            <p className="text-3xl font-bold text-slate-900 mt-2">{summary.scoredCount}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Gaps</p>
            <p className="text-3xl font-bold text-red-600 mt-2">{roadmap.gapItems.length}</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-lg p-4">
            <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">At Target</p>
            <p className="text-3xl font-bold text-emerald-600 mt-2">{summary.atTargetCount}</p>
          </div>
        </div>

        {roadmap.unassessedWithTarget.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
              <h2 className="font-semibold text-slate-700 text-sm">Not Yet Assessed</h2>
              <p className="text-xs text-slate-400 mt-0.5">In-scope safeguards with no current score.</p>
            </div>
            {roadmap.unassessedWithTarget.map((item) => (
              <CisRoadmapItemRow key={item.code} item={item} />
            ))}
          </div>
        )}

        {roadmap.gapItems.length > 0 && (
          <div className="bg-white border border-red-200 rounded-lg overflow-hidden">
            <div className="px-5 py-3 border-b bg-red-50 border-red-200 text-red-700">
              <h2 className="font-semibold text-sm">Priority Gaps</h2>
              <p className="text-xs opacity-75 mt-0.5">{roadmap.gapItems.length} item{roadmap.gapItems.length === 1 ? '' : 's'}</p>
            </div>
            {roadmap.gapItems.map((item) => (
              <CisRoadmapItemRow key={item.code} item={item} />
            ))}
          </div>
        )}
      </div>
    );
  }

  const roadmap = getRoadmapData(db);

  if (!roadmap.hasPublishedAssessment) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Strategic Roadmap</h1>
          <p className="text-slate-500 text-sm mt-1">NIST CSF 2.0 · Radar overview and auto-generated priority actions</p>
        </div>
        <FrameworkTabs active="nist" />
        <div className="bg-white border border-slate-200 rounded-lg px-6 py-10 text-center text-slate-400 text-sm">
          No published assessments yet.{' '}
          <Link href="/assessments/new" className="text-slate-600 underline hover:text-slate-900">
            Create your first assessment
          </Link>{' '}
          to see a roadmap here.
        </div>
      </div>
    );
  }

  const { summary } = roadmap;
  const radarChartData = roadmap.radarData.map((f) => ({
    function: f.code,
    title: f.title,
    Current: f.current,
    Target: f.target,
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Strategic Roadmap</h1>
          <p className="text-slate-500 text-sm mt-1">
            {roadmap.latestAssessmentTitle
              ? `Current: ${roadmap.latestAssessmentTitle} (${roadmap.latestAssessmentDate ?? 'no date'})`
              : 'NIST CSF 2.0 · Radar overview and auto-generated priority actions'}
          </p>
        </div>
        {!roadmap.hasTargets && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            No targets set. Define them on the{' '}
            <Link href="/targets" className="underline">Targets</Link> page.
          </p>
        )}
      </div>

      <FrameworkTabs active="nist" />

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Overall Current</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {summary.overallCurrentAvg !== null ? summary.overallCurrentAvg.toFixed(1) : '—'}
            </span>
            {summary.overallCurrentAvg !== null && (
              <MaturityBadge score={Math.round(summary.overallCurrentAvg) as MaturityLevel} showLabel={false} />
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Overall Target</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-3xl font-bold text-slate-900">
              {summary.overallTargetAvg !== null ? summary.overallTargetAvg.toFixed(1) : '—'}
            </span>
            {summary.overallTargetAvg !== null && (
              <MaturityBadge score={Math.round(summary.overallTargetAvg) as MaturityLevel} showLabel={false} />
            )}
          </div>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Gap to Close</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {summary.overallGap !== null ? summary.overallGap.toFixed(1) : '—'}
          </p>
        </div>
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Urgent Items</p>
          <p className="text-3xl font-bold text-red-600 mt-2">{summary.urgentCount}</p>
        </div>
      </div>

      {/* Radar */}
      <div>
        <h2 className="font-semibold text-slate-900 mb-3">Function-Level Radar</h2>
        <RoadmapRadar data={radarChartData} />
      </div>

      {/* Not yet assessed */}
      {roadmap.unassessedWithTarget.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100">
            <h2 className="font-semibold text-slate-700 text-sm">Not Yet Assessed</h2>
            <p className="text-xs text-slate-400 mt-0.5">Targets are set but these controls have no current score.</p>
          </div>
          {roadmap.unassessedWithTarget.map((item) => (
            <RoadmapItemRow key={item.code} item={item} />
          ))}
        </div>
      )}

      {/* Priority phases */}
      {roadmap.phases.map((p) =>
        p.items.length > 0 ? (
          <div key={p.phase} className={`bg-white border rounded-lg overflow-hidden ${PHASE_STYLES[p.phase].border}`}>
            <div className={`px-5 py-3 border-b ${PHASE_STYLES[p.phase].header}`}>
              <h2 className="font-semibold text-sm">{p.label}</h2>
              <p className="text-xs opacity-75 mt-0.5">{p.items.length} item{p.items.length === 1 ? '' : 's'}</p>
            </div>
            {p.items.map((item) => (
              <RoadmapItemRow key={item.code} item={item} />
            ))}
          </div>
        ) : null
      )}
    </div>
  );
}
