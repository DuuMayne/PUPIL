'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewAssessmentPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    description: '',
    assessor: '',
    assessed_at: new Date().toISOString().slice(0, 10),
    framework_id: 1,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const res = await fetch('/api/assessments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error('Failed to create assessment');
      const data = await res.json();
      router.push(`/assessments/${data.id}/score`);
    } catch (err) {
      setError(String(err));
      setSaving(false);
    }
  }

  return (
    <div className="max-w-xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">New Assessment</h1>
        <p className="text-slate-500 text-sm mt-1">NIST CSF 2.0 · CMMI 1–5</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-lg p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Framework</label>
          <div className="flex gap-3">
            {[
              { id: 1, label: 'NIST CSF 2.0' },
              { id: 2, label: 'CIS Controls v8.1' },
            ].map((fw) => (
              <button
                key={fw.id}
                type="button"
                onClick={() => setForm({ ...form, framework_id: fw.id })}
                className={`flex-1 rounded border px-3 py-2 text-sm font-medium transition-colors ${
                  form.framework_id === fw.id
                    ? 'border-slate-900 bg-slate-900 text-white'
                    : 'border-slate-200 text-slate-600 hover:border-slate-400'
                }`}
              >
                {fw.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Title <span className="text-red-500">*</span></label>
          <input
            type="text"
            required
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="e.g. Q2 2026 Annual Maturity Assessment"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Assessment Date</label>
          <input
            type="date"
            value={form.assessed_at}
            onChange={(e) => setForm({ ...form, assessed_at: e.target.value })}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Assessor</label>
          <input
            type="text"
            value={form.assessor}
            onChange={(e) => setForm({ ...form, assessor: e.target.value })}
            placeholder="Name or team"
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Optional context, scope, or methodology notes"
            rows={3}
            className="w-full border border-slate-200 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400 resize-none"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-slate-900 text-white px-5 py-2 rounded text-sm font-medium hover:bg-slate-700 disabled:opacity-50 transition-colors"
          >
            {saving ? 'Creating…' : 'Create & Start Scoring'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="text-slate-600 px-4 py-2 rounded text-sm border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
