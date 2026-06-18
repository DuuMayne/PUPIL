import Link from 'next/link';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import MaturityBadge from '@/components/MaturityBadge';
import { MaturityLevel } from '@/lib/types';

export const dynamic = 'force-dynamic';

interface FunctionSummary {
  code: string;
  title: string;
  avg: number | null;
  scored: number;
  total: number;
}

function maturityColor(avg: number | null): string {
  if (!avg) return 'bg-slate-200';
  if (avg < 1.5) return 'bg-red-400';
  if (avg < 2.5) return 'bg-orange-400';
  if (avg < 3.5) return 'bg-yellow-400';
  if (avg < 4.5) return 'bg-emerald-400';
  return 'bg-green-400';
}

export default function DashboardPage() {
  seedDatabase();
  const db = getDb();

  const latestAssessment = db.prepare(
    `SELECT * FROM assessments WHERE status = 'published' ORDER BY assessed_at DESC, created_at DESC LIMIT 1`
  ).get() as { id: string; title: string; assessed_at: string | null; assessor: string | null } | undefined;

  const allAssessments = db.prepare(
    `SELECT COUNT(*) as c FROM assessments`
  ).get() as { c: number };

  const publishedCount = db.prepare(
    `SELECT COUNT(*) as c FROM assessments WHERE status = 'published'`
  ).get() as { c: number };

  const functions = db.prepare(
    `SELECT * FROM controls WHERE level = 'function' ORDER BY sort_order`
  ).all() as { id: string; code: string; title: string }[];

  const functionSummaries: FunctionSummary[] = functions.map((fn) => {
    const subcategories = db.prepare(
      `SELECT id FROM controls WHERE level = 'subcategory' AND parent_id IN (
         SELECT id FROM controls WHERE level = 'category' AND parent_id = ?
       )`
    ).all(fn.id) as { id: string }[];

    const total = subcategories.length;

    if (!latestAssessment || total === 0) {
      return { code: fn.code, title: fn.title, avg: null, scored: 0, total };
    }

    const ids = subcategories.map((s) => s.id);
    const placeholders = ids.map(() => '?').join(',');
    const scores = db.prepare(
      `SELECT score FROM assessment_scores
       WHERE assessment_id = ? AND control_id IN (${placeholders}) AND score IS NOT NULL`
    ).all(latestAssessment.id, ...ids) as { score: number }[];

    const scored = scores.length;
    const avg = scored > 0 ? scores.reduce((s, r) => s + r.score, 0) / scored : null;

    return { code: fn.code, title: fn.title, avg, scored, total };
  });

  const overallAvg = (() => {
    const all = functionSummaries.filter((f) => f.avg !== null);
    if (!all.length) return null;
    return all.reduce((s, f) => s + (f.avg ?? 0), 0) / all.length;
  })();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500 text-sm mt-1">NIST CSF 2.0 · CMMI Maturity Scale</p>
        </div>
        <Link
          href="/assessments/new"
          className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          New Assessment
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Overall Maturity</p>
          <div className="mt-2">
            {overallAvg ? (
              <div className="flex items-center gap-2">
                <span className="text-3xl font-bold text-slate-900">{overallAvg.toFixed(1)}</span>
                <MaturityBadge score={Math.round(overallAvg) as MaturityLevel} showLabel={false} />
              </div>
            ) : (
              <span className="text-slate-400 text-sm">No data yet</span>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Total Assessments</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{allAssessments.c}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Published</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{publishedCount.c}</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-lg p-4">
          <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Latest Assessment</p>
          {latestAssessment ? (
            <div className="mt-2">
              <Link href={`/assessments/${latestAssessment.id}/score`} className="text-sm font-medium text-slate-700 hover:text-slate-900 line-clamp-1">
                {latestAssessment.title}
              </Link>
              <p className="text-xs text-slate-400 mt-0.5">{latestAssessment.assessed_at ?? 'No date'}</p>
            </div>
          ) : (
            <span className="text-slate-400 text-sm mt-2 block">None published</span>
          )}
        </div>
      </div>

      {/* Function maturity bars */}
      <div className="bg-white border border-slate-200 rounded-lg">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-semibold text-slate-900">Maturity by Function</h2>
          {latestAssessment && (
            <span className="text-xs text-slate-400">Latest: {latestAssessment.title}</span>
          )}
        </div>
        <div className="divide-y divide-slate-50">
          {functionSummaries.map((fn) => (
            <div key={fn.code} className="px-6 py-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono font-bold text-slate-400 w-6">{fn.code}</span>
                  <span className="font-medium text-slate-800">{fn.title}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-500">
                  <span>{fn.scored}/{fn.total} scored</span>
                  {fn.avg !== null && (
                    <MaturityBadge score={Math.round(fn.avg) as MaturityLevel} size="sm" />
                  )}
                </div>
              </div>
              <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${maturityColor(fn.avg)}`}
                  style={{ width: fn.avg ? `${(fn.avg / 5) * 100}%` : '0%' }}
                />
              </div>
            </div>
          ))}
        </div>
        {!latestAssessment && (
          <div className="px-6 py-8 text-center text-slate-400 text-sm">
            No published assessments yet.{' '}
            <Link href="/assessments/new" className="text-slate-600 underline hover:text-slate-900">
              Create your first assessment
            </Link>{' '}
            to see maturity scores here.
          </div>
        )}
      </div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link href="/assessments" className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-colors group">
          <p className="font-semibold text-slate-800 group-hover:text-slate-900">Assessments</p>
          <p className="text-sm text-slate-500 mt-1">Create, score, and publish assessments</p>
        </Link>
        <Link href="/gap" className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-colors group">
          <p className="font-semibold text-slate-800 group-hover:text-slate-900">Gap Analysis</p>
          <p className="text-sm text-slate-500 mt-1">Current maturity vs. target state</p>
        </Link>
        <Link href="/trends" className="bg-white border border-slate-200 rounded-lg p-5 hover:border-slate-400 transition-colors group">
          <p className="font-semibold text-slate-800 group-hover:text-slate-900">Trends</p>
          <p className="text-sm text-slate-500 mt-1">Maturity improvement over time</p>
        </Link>
      </div>
    </div>
  );
}
