'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import NistScorePanel from '@/components/NistScorePanel';
import CisScorePanel from '@/components/CisScorePanel';
import { Assessment, Control, AssessmentScore } from '@/lib/types';

interface ScoreMap {
  [controlId: string]: { score: number | null; rationale: string };
}

export default function AssessmentScorePage() {
  const { id } = useParams<{ id: string }>();

  const [assessment, setAssessment] = useState<Assessment | null>(null);
  const [controls, setControls] = useState<Control[]>([]);
  const [scores, setScores] = useState<ScoreMap>({});
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const asmRes = await fetch(`/api/assessments/${id}`);
      const asmData = await asmRes.json() as Assessment & { scores: AssessmentScore[] };
      setAssessment(asmData);

      const ctlRes = await fetch(`/api/controls?framework_id=${asmData.framework_id}`);
      const ctls = await ctlRes.json() as Control[];
      setControls(ctls);

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
  const totalSubs = controls.filter((c) => c.level === 'subcategory').length;

  if (loading) {
    return <div className="text-slate-400 text-sm">Loading…</div>;
  }

  if (!assessment) {
    return <div className="text-red-500 text-sm">Assessment not found.</div>;
  }

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
            <span className="text-xs px-1.5 py-0.5 rounded font-medium border border-slate-200 bg-slate-50 text-slate-600">
              {assessment.framework_id === 2 ? 'CIS Controls v8.1' : 'NIST CSF 2.0'}
            </span>
          </div>
          <h1 className="text-xl font-bold text-slate-900">{assessment.title}</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            {assessment.assessed_at} {assessment.assessor && `· ${assessment.assessor}`}
            {' · '}{scoredCount}/{totalSubs} {assessment.framework_id === 2 ? 'safeguards' : 'subcategories'} scored
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

      {assessment.framework_id === 2 ? (
        <CisScorePanel
          controls={controls}
          scores={scores}
          onScoreChange={handleScoreChange}
          onRationaleChange={handleRationaleChange}
          disabled={readOnly}
        />
      ) : (
        <NistScorePanel
          controls={controls}
          scores={scores}
          onScoreChange={handleScoreChange}
          onRationaleChange={handleRationaleChange}
          disabled={readOnly}
        />
      )}
    </div>
  );
}
