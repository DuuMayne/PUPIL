import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { MaturityLevel, MATURITY_LABELS } from '@/lib/types';
import MaturityBadge from '@/components/MaturityBadge';

export const dynamic = 'force-dynamic';

interface GapRow {
  code: string;
  title: string;
  level: string;
  current: number | null;
  target: number | null;
  gap: number | null;
}

function GapBar({ current, target }: { current: number | null; target: number | null }) {
  const c = current ?? 0;
  const t = target ?? 0;
  const gap = t > c;

  return (
    <div className="flex items-center gap-2 w-40">
      <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden relative">
        <div
          className="h-full rounded-full bg-slate-400 absolute left-0"
          style={{ width: `${(c / 5) * 100}%` }}
        />
        {target && (
          <div
            className="absolute top-0 h-full w-0.5 bg-slate-700"
            style={{ left: `${(t / 5) * 100}%` }}
          />
        )}
      </div>
      {current !== null && target !== null && (
        <span className={`text-xs font-medium w-8 text-right ${gap ? 'text-red-600' : 'text-green-600'}`}>
          {gap ? `-${(t - c).toFixed(1)}` : '✓'}
        </span>
      )}
    </div>
  );
}

export default function GapPage() {
  seedDatabase();
  const db = getDb();

  const latestAssessment = db.prepare(
    `SELECT * FROM assessments WHERE status = 'published' ORDER BY assessed_at DESC, created_at DESC LIMIT 1`
  ).get() as { id: string; title: string; assessed_at: string | null } | undefined;

  const functions = db.prepare(
    `SELECT * FROM controls WHERE level = 'function' ORDER BY sort_order`
  ).all() as { id: string; code: string; title: string }[];

  const targets = db.prepare('SELECT * FROM targets WHERE framework_id = 1').all() as {
    control_id: string; target_score: number;
  }[];
  const targetMap = Object.fromEntries(targets.map((t) => [t.control_id, t.target_score]));

  const scoreMap: Record<string, number | null> = {};
  if (latestAssessment) {
    const scores = db.prepare(
      `SELECT control_id, score FROM assessment_scores WHERE assessment_id = ?`
    ).all(latestAssessment.id) as { control_id: string; score: number | null }[];
    for (const s of scores) scoreMap[s.control_id] = s.score;
  }

  const hasTargets = targets.length > 0;

  const functionRows: {
    fn: { id: string; code: string; title: string };
    categories: {
      cat: { id: string; code: string; title: string };
      subcategories: GapRow[];
      catAvgCurrent: number | null;
      catAvgTarget: number | null;
    }[];
    fnAvgCurrent: number | null;
    fnAvgTarget: number | null;
  }[] = functions.map((fn) => {
    const categories = db.prepare(
      `SELECT * FROM controls WHERE level = 'category' AND parent_id = ? ORDER BY sort_order`
    ).all(fn.id) as { id: string; code: string; title: string }[];

    const catRows = categories.map((cat) => {
      const subcategories = db.prepare(
        `SELECT * FROM controls WHERE level = 'subcategory' AND parent_id = ? ORDER BY sort_order`
      ).all(cat.id) as { id: string; code: string; title: string }[];

      const subRows: GapRow[] = subcategories.map((sub) => {
        const current = scoreMap[sub.id] ?? null;
        const target = targetMap[sub.id] ?? null;
        return {
          code: sub.code,
          title: sub.title,
          level: 'subcategory',
          current,
          target,
          gap: current !== null && target !== null ? target - current : null,
        };
      });

      const scoredSubs = subRows.filter((r) => r.current !== null);
      const catAvgCurrent = scoredSubs.length ? scoredSubs.reduce((a, r) => a + (r.current ?? 0), 0) / scoredSubs.length : null;
      const targetedSubs = subRows.filter((r) => r.target !== null);
      const catAvgTarget = targetedSubs.length ? targetedSubs.reduce((a, r) => a + (r.target ?? 0), 0) / targetedSubs.length : null;

      return { cat, subcategories: subRows, catAvgCurrent, catAvgTarget };
    });

    const allSubs = catRows.flatMap((c) => c.subcategories);
    const scoredAll = allSubs.filter((r) => r.current !== null);
    const fnAvgCurrent = scoredAll.length ? scoredAll.reduce((a, r) => a + (r.current ?? 0), 0) / scoredAll.length : null;
    const targetedAll = allSubs.filter((r) => r.target !== null);
    const fnAvgTarget = targetedAll.length ? targetedAll.reduce((a, r) => a + (r.target ?? 0), 0) / targetedAll.length : null;

    return { fn, categories: catRows, fnAvgCurrent, fnAvgTarget };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Gap Analysis</h1>
          <p className="text-slate-500 text-sm mt-1">
            {latestAssessment
              ? `Current: ${latestAssessment.title} (${latestAssessment.assessed_at ?? 'no date'})`
              : 'No published assessment — scores will be empty'}
          </p>
        </div>
        {!hasTargets && (
          <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            No targets set. Define them on the Targets page.
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-xs text-slate-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-2 bg-slate-400 rounded inline-block" /> Current</span>
        <span className="flex items-center gap-1.5"><span className="w-0.5 h-3 bg-slate-700 inline-block" /> Target</span>
        <span className="flex items-center gap-1.5"><span className="text-red-600 font-medium">-X.X</span> Gap</span>
        <span className="flex items-center gap-1.5"><span className="text-green-600 font-medium">✓</span> Met or exceeded</span>
      </div>

      <div className="space-y-6">
        {functionRows.map(({ fn, categories, fnAvgCurrent, fnAvgTarget }) => (
          <div key={fn.id} className="bg-white border border-slate-200 rounded-lg overflow-hidden">
            {/* Function header */}
            <div className="px-5 py-3 bg-slate-800 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="font-mono text-slate-300 text-sm">{fn.code}</span>
                <span className="font-semibold">{fn.title}</span>
              </div>
              <div className="flex items-center gap-4">
                <MaturityBadge score={fnAvgCurrent !== null ? Math.round(fnAvgCurrent) as MaturityLevel : null} showLabel={false} />
                <GapBar current={fnAvgCurrent} target={fnAvgTarget} />
              </div>
            </div>

            {/* Categories */}
            {categories.map(({ cat, subcategories, catAvgCurrent, catAvgTarget }) => (
              <div key={cat.id}>
                <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-slate-400 text-xs">{cat.code}</span>
                    <span className="font-medium text-slate-700 text-sm">{cat.title}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <MaturityBadge score={catAvgCurrent !== null ? Math.round(catAvgCurrent) as MaturityLevel : null} showLabel={false} size="sm" />
                    <GapBar current={catAvgCurrent} target={catAvgTarget} />
                  </div>
                </div>

                {/* Subcategories */}
                <div className="divide-y divide-slate-50">
                  {subcategories.map((sub) => (
                    <div key={sub.code} className="px-5 py-3 flex items-center justify-between gap-4">
                      <div className="min-w-0">
                        <span className="font-mono text-xs text-slate-400 mr-2">{sub.code}</span>
                        <span className="text-sm text-slate-700">{sub.title}</span>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500 hidden sm:flex">
                          <MaturityBadge score={sub.current as MaturityLevel | null} showLabel={false} size="sm" />
                          {sub.target && (
                            <>
                              <span>→</span>
                              <MaturityBadge score={sub.target as MaturityLevel} showLabel={false} size="sm" />
                            </>
                          )}
                        </div>
                        <GapBar current={sub.current} target={sub.target} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
