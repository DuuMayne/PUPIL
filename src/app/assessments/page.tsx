import Link from 'next/link';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { Assessment } from '@/lib/types';

function statusBadge(status: string) {
  return status === 'published'
    ? 'bg-green-100 text-green-800 border border-green-200'
    : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
}

export default function AssessmentsPage() {
  seedDatabase();
  const db = getDb();

  const assessments = db.prepare(
    `SELECT a.*,
       (SELECT COUNT(*) FROM assessment_scores WHERE assessment_id = a.id AND score IS NOT NULL) as scored_count,
       (SELECT COUNT(*) FROM controls WHERE level = 'subcategory') as total_controls
     FROM assessments a ORDER BY created_at DESC`
  ).all() as (Assessment & { scored_count: number; total_controls: number })[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
          <p className="text-slate-500 text-sm mt-1">{assessments.length} total</p>
        </div>
        <Link
          href="/assessments/new"
          className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          New Assessment
        </Link>
      </div>

      {assessments.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-lg px-6 py-16 text-center">
          <p className="text-slate-500 mb-4">No assessments yet.</p>
          <Link
            href="/assessments/new"
            className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-700"
          >
            Create First Assessment
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-lg divide-y divide-slate-100">
          {assessments.map((a) => (
            <div key={a.id} className="px-6 py-4 flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-slate-400">{a.id}</span>
                  <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusBadge(a.status)}`}>
                    {a.status}
                  </span>
                </div>
                <p className="font-medium text-slate-800 mt-0.5 truncate">{a.title}</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {a.assessed_at ?? a.created_at.slice(0, 10)}
                  {a.assessor && ` · ${a.assessor}`}
                </p>
              </div>
              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-medium text-slate-700">{a.scored_count}/{a.total_controls}</p>
                  <p className="text-xs text-slate-400">scored</p>
                </div>
                <Link
                  href={`/assessments/${a.id}/score`}
                  className="text-sm px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  {a.status === 'published' ? 'View' : 'Score'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
