'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Assessment } from '@/lib/types';

type AssessmentRow = Assessment & { scored_count: number; total_controls: number };

function statusBadge(status: string) {
  return status === 'published'
    ? 'bg-green-100 text-green-800 border border-green-200'
    : 'bg-yellow-100 text-yellow-800 border border-yellow-200';
}

export default function AssessmentsPage() {
  const [assessments, setAssessments] = useState<AssessmentRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  async function load() {
    const res = await fetch('/api/assessments?include_counts=1', { cache: 'no-store' });
    const data = await res.json();
    setAssessments(data);
    setLoading(false);
  }

  useEffect(() => {
    load();
  }, []);

  async function unlock(a: AssessmentRow) {
    if (!confirm(`Re-open "${a.title}" for editing? It will return to draft status.`)) return;
    setBusy(a.id);
    await fetch(`/api/assessments/${a.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...a, status: 'draft' }),
    });
    setBusy(null);
    load();
  }

  async function remove(a: AssessmentRow) {
    if (!confirm(`Delete "${a.title}"? This permanently removes all scores. This cannot be undone.`)) return;
    setBusy(a.id);
    await fetch(`/api/assessments/${a.id}`, { method: 'DELETE' });
    setBusy(null);
    load();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Assessments</h1>
          <p className="text-slate-500 text-sm mt-1">{loading ? 'Loading…' : `${assessments.length} total`}</p>
        </div>
        <Link
          href="/assessments/new"
          className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-medium hover:bg-slate-700 transition-colors"
        >
          New Assessment
        </Link>
      </div>

      {!loading && assessments.length === 0 ? (
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
              <div className="flex items-center gap-3 shrink-0">
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
                <Link
                  href={`/assessments/${a.id}/report`}
                  className="text-sm px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 transition-colors"
                >
                  Report
                </Link>
                {a.status === 'published' && (
                  <button
                    onClick={() => unlock(a)}
                    disabled={busy === a.id}
                    className="text-sm px-3 py-1.5 border border-amber-300 bg-amber-50 text-amber-800 rounded hover:bg-amber-100 disabled:opacity-50 transition-colors"
                    title="Re-open this assessment for editing"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => remove(a)}
                  disabled={busy === a.id}
                  className="text-sm px-3 py-1.5 border border-red-200 text-red-700 rounded hover:bg-red-50 disabled:opacity-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
