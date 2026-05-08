'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import MaturitySelector from '@/components/MaturitySelector';
import MaturityBadge from '@/components/MaturityBadge';
import { Assessment, Control, AssessmentScore, MaturityLevel } from '@/lib/types';

interface FunctionGroup {
  fn: Control;
  categories: { cat: Control; subcategories: Control[] }[];
}

interface ScoreMap {
  [controlId: string]: { score: number | null; rationale: string };
}

export default function AssessmentScorePage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [groups, setGroups] = useState<FunctionGroup[]>([]);
  const [scores, setScores] = useState<ScoreMap>({});
  const [notes, setNotes] = useState<{ [controlId: string]: string }>({});
  const [activeFunction, setActiveFunction] = useState<string>('GV');
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [asmRes, ctlRes] = await Promise.all([
        fetch(`/api/assessments/${id}`),
        fetch('/api/controls'),
      ]);
      const asmData = await asmRes.json() as Assessment & { scores: AssessmentScore[] };
      const controls = await ctlRes.json() as Control[];

      setAssessment(asmData);

      const fns = controls.filter((c) => c.level === 'function');
      const cats = controls.filter((c) => c.level === 'category');
      const subs = controls.filter((c) => c.level === 'subcategory');

      const grouped: FunctionGroup[] = fns.map((fn) => ({
        fn,
        categories: cats
          .filter((c) => c.parent_id === fn.id)
          .map((cat) => ({
            cat,
            subcategories: subs.filter((s) => s.parent_id === cat.id),
          })),
      }));
      setGroups(grouped);

      const scoreMap: ScoreMap = {};
      for (const s of asmData.scores ?? []) {
        scoreMap[s.control_id] = {
          score: s.score,
          rationale: s.rationale ?? '',
        };
      }
      setScores(scoreMap);
      setLoading(false);
    }
    load();
  }, [id]);

  const handleScoreChange = useCallback((controlId: string, score: number | null) => {
    setScores((prev) => ({
      ...prev,
      [controlId]: { score, rationale: prev[controlId]?.rationale ?? '' },
    }));
    setDirty(true);
  }, []);

  const handleRationaleChange = useCallback((controlId: string, rationale: string) => {
    setScores((prev) => ({
      ...prev,
      [controlId]: { score: prev[controlId]?.score ?? null, rationale },
    }));
    setDirty(true);
  }, []);

  async function save() {
    setSaving(true);
    const payload = Object.entries(scores).map(([control_id, v]) => ({
      control_id,
      score: v.score,
      rationale: v.rationale || null,
    }));
    await fetch(`/api/assessments/${id}/scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setDirty(false);
    setSaving(false);
  }

  async function publish() {
    await save();
    setPublishing(true);
    await fetch(`/api/assessments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...assessment, status: 'published' }),
    });
    setAssessment((prev) => prev ? { ...prev, status: 'published' } : prev);
    setPublishing(false);
  }

  async function unlock() {
    if (!assessment) return;
    if (!confirm('Re-open this published assessment for editing? It will return to draft status.')) return;
    await fetch(`/api/assessments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...assessment, status: 'draft' }),
    });
    setAssessment((prev) => prev ? { ...prev, status: 'draft' } : prev);
  }

  const readOnly = assessment?.status === 'published';

  const scoredCount = Object.values(scores).filter((s) => s.score !== null).length;
  const totalSubs = groups.reduce((a, g) => a + g.categories.reduce((b, c) => b + c.subcategories.length, 0), 0);

  const functionAvg = (fn: FunctionGroup): number | null => {
    const subs = fn.categories.flatMap((c) => c.subcategories);
    const s = subs.map((sub) => scores[sub.id]?.score).filter(Boolean) as number[];
    return s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;
  };

  if (loading) {
    return <div className="text-slate-400 text-sm">Loading…</div>;
  }

  if (!assessment) {
    return <div className="text-red-500 text-sm">Assessment not found.</div>;
  }

  const activeGroup = groups.find((g) => g.fn.id === activeFunction);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-slate-400">{assessment.id}</span>
            <span className={`text-xs px-1.5 py-0.5 rounded font-medium border ${
              assessment.status === 'published'
                ? 'bg-green-100 text-green-800 border-green-200'
                : 'bg-yellow-100 text-yellow-800 border-yellow-200'
            }`}>
              {assessment.status}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{assessment.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {assessment.assessed_at} {assessment.assessor && `· ${assessment.assessor}`}
            {' · '}{scoredCount}/{totalSubs} subcategories scored
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link
            href={`/assessments/${id}/report`}
            className="text-sm px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 transition-colors"
          >
            Report
          </Link>
          {readOnly ? (
            <button
              onClick={unlock}
              className="text-sm px-3 py-1.5 border border-amber-300 bg-amber-50 text-amber-800 rounded hover:bg-amber-100 transition-colors"
            >
              Edit (unpublish)
            </button>
          ) : (
            <>
              <button
                onClick={save}
                disabled={saving || !dirty}
                className="text-sm px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                {saving ? 'Saving…' : 'Save Draft'}
              </button>
              <button
                onClick={publish}
                disabled={publishing}
                className="text-sm px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-700 disabled:opacity-40 transition-colors"
              >
                {publishing ? 'Publishing…' : 'Publish'}
              </button>
            </>
          )}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Function sidebar */}
        <aside className="w-48 shrink-0 space-y-1">
          {groups.map((g) => {
            const avg = functionAvg(g);
            const isActive = activeFunction === g.fn.id;
            return (
              <button
                key={g.fn.id}
                onClick={() => setActiveFunction(g.fn.id)}
                className={`w-full text-left px-3 py-2.5 rounded text-sm transition-colors ${
                  isActive ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="font-medium">{g.fn.code} {g.fn.title}</span>
                  {avg !== null && (
                    <MaturityBadge score={Math.round(avg) as MaturityLevel} showLabel={false} size="sm" />
                  )}
                </div>
              </button>
            );
          })}
        </aside>

        {/* Scoring panel */}
        <div className="flex-1 min-w-0">
          {activeGroup && (
            <div className="space-y-6">
              <h2 className="font-semibold text-slate-800 text-lg">
                {activeGroup.fn.code} — {activeGroup.fn.title}
              </h2>
              {activeGroup.categories.map((catGroup) => (
                <div key={catGroup.cat.id} className="bg-white border border-slate-200 rounded-lg">
                  <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 rounded-t-lg">
                    <p className="font-semibold text-slate-800 text-sm">
                      {catGroup.cat.code} — {catGroup.cat.title}
                    </p>
                    {catGroup.cat.description && (
                      <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{catGroup.cat.description}</p>
                    )}
                  </div>
                  <div className="divide-y divide-slate-50">
                    {catGroup.subcategories.map((sub) => {
                      const current = scores[sub.id];
                      return (
                        <div key={sub.id} className="px-5 py-4">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div className="min-w-0">
                              <p className="text-xs font-mono text-slate-400 mb-0.5">{sub.code}</p>
                              <p className="text-sm font-medium text-slate-800">{sub.title}</p>
                              {sub.description && (
                                <p className="text-xs text-slate-500 mt-0.5">{sub.description}</p>
                              )}
                            </div>
                            <MaturitySelector
                              value={current?.score ?? null}
                              onChange={(score) => handleScoreChange(sub.id, score)}
                              disabled={readOnly}
                              controlId={sub.id}
                            />
                          </div>
                          {(current?.score !== null && current?.score !== undefined || current?.rationale) && (
                            <textarea
                              placeholder="Rationale, evidence, or notes…"
                              value={current?.rationale ?? ''}
                              onChange={(e) => handleRationaleChange(sub.id, e.target.value)}
                              disabled={readOnly}
                              rows={2}
                              className="w-full text-xs border border-slate-200 rounded px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none disabled:bg-slate-50"
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
