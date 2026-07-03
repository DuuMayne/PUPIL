import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import TrendChart from '@/components/TrendChart';

export const dynamic = 'force-dynamic';

interface DataPoint {
  label: string;
  assessmentId: string;
  [functionCode: string]: string | number | null;
}

const FUNCTION_COLORS: Record<string, string> = {
  GV: '#6366f1',
  ID: '#f59e0b',
  PR: '#3b82f6',
  DE: '#ec4899',
  RS: '#ef4444',
  RC: '#10b981',
};

export default function TrendsPage() {
  seedDatabase();
  const db = getDb();

  const published = db.prepare(
    `SELECT * FROM assessments WHERE status = 'published' AND framework_id = 1 ORDER BY assessed_at ASC, created_at ASC`
  ).all() as { id: string; title: string; assessed_at: string | null }[];

  const functions = db.prepare(
    `SELECT * FROM controls WHERE level = 'function' AND framework_id = 1 ORDER BY sort_order`
  ).all() as { id: string; code: string; title: string }[];

  const dataPoints: DataPoint[] = published.map((asm) => {
    const point: DataPoint = {
      label: asm.assessed_at?.slice(0, 7) ?? asm.id,
      assessmentId: asm.id,
    };

    for (const fn of functions) {
      const subcategoryIds = db.prepare(
        `SELECT c.id FROM controls c
         WHERE c.level = 'subcategory'
           AND c.parent_id IN (SELECT id FROM controls WHERE level = 'category' AND parent_id = ?)`
      ).all(fn.id) as { id: string }[];

      if (subcategoryIds.length === 0) {
        point[fn.code] = null;
        continue;
      }

      const ids = subcategoryIds.map((s) => s.id);
      const placeholders = ids.map(() => '?').join(',');
      const scores = db.prepare(
        `SELECT score FROM assessment_scores
         WHERE assessment_id = ? AND control_id IN (${placeholders}) AND score IS NOT NULL`
      ).all(asm.id, ...ids) as { score: number }[];

      point[fn.code] = scores.length > 0
        ? Math.round((scores.reduce((a, s) => a + s.score, 0) / scores.length) * 10) / 10
        : null;
    }

    return point;
  });

  const functionDefs = functions.map((fn) => ({
    code: fn.code,
    title: fn.title,
    color: FUNCTION_COLORS[fn.code] ?? '#94a3b8',
  }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Trends</h1>
        <p className="text-slate-500 text-sm mt-1">
          Average maturity per function across {published.length} published assessment{published.length !== 1 ? 's' : ''}
        </p>
      </div>

      {published.length < 2 ? (
        <div className="bg-white border border-slate-200 rounded-lg px-6 py-16 text-center">
          <p className="text-slate-500">Trends require at least 2 published assessments.</p>
          <p className="text-slate-400 text-sm mt-1">
            You have {published.length} published assessment{published.length !== 1 ? 's' : ''}.
          </p>
        </div>
      ) : (
        <TrendChart data={dataPoints} functions={functionDefs} />
      )}

      {/* Summary table */}
      {published.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-100">
            <h2 className="font-semibold text-slate-800 text-sm">Score History by Function</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs text-slate-500 text-left">
                  <th className="px-5 py-2 font-medium">Function</th>
                  {published.map((a) => (
                    <th key={a.id} className="px-3 py-2 font-medium text-center whitespace-nowrap">
                      {a.assessed_at?.slice(0, 7) ?? a.id}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {functionDefs.map((fn) => (
                  <tr key={fn.code}>
                    <td className="px-5 py-2.5 font-medium text-slate-700">
                      <span className="font-mono text-slate-400 text-xs mr-2">{fn.code}</span>
                      {fn.title}
                    </td>
                    {dataPoints.map((point, i) => {
                      const val = point[fn.code] as number | null;
                      return (
                        <td key={i} className="px-3 py-2.5 text-center">
                          {val !== null ? (
                            <span className="font-medium text-slate-700">{val.toFixed(1)}</span>
                          ) : (
                            <span className="text-slate-300">—</span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
