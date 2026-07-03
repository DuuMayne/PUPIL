'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import MaturitySelector from '@/components/MaturitySelector';
import MaturityBadge from '@/components/MaturityBadge';
import { Control, MaturityLevel, Target } from '@/lib/types';

interface FunctionGroup {
  fn: Control;
  categories: { cat: Control; subcategories: Control[] }[];
}

export default function TargetsPage() {
  const [groups, setGroups] = useState<FunctionGroup[]>([]);
  const [targets, setTargets] = useState<Record<string, number | null>>({});
  const [activeFunction, setActiveFunction] = useState<string>('GV');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    let ignore = false;
    (async () => {
      const [ctlRes, tgtRes] = await Promise.all([
        fetch('/api/controls'),
        fetch('/api/targets'),
      ]);
      const controls = await ctlRes.json() as Control[];
      const tgts = await tgtRes.json() as Target[];

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

      const tmap: Record<string, number | null> = {};
      for (const t of tgts) tmap[t.control_id] = t.target_score;

      if (!ignore) {
        setGroups(grouped);
        setTargets(tmap);
        setLoading(false);
      }
    })();
    return () => {
      ignore = true;
    };
  }, []);

  const handleChange = useCallback((controlId: string, score: number | null) => {
    setTargets((prev) => ({ ...prev, [controlId]: score }));
    setDirty(true);
  }, []);

  async function save() {
    setSaving(true);
    const payload = Object.entries(targets)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([control_id, target_score]) => ({
        framework_id: 1,
        control_id,
        target_score: target_score as number,
      }));

    if (payload.length > 0) {
      await fetch('/api/targets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    }
    setDirty(false);
    setSaving(false);
  }

  const activeGroup = groups.find((g) => g.fn.id === activeFunction);

  const functionAvgTarget = useCallback((fn: FunctionGroup) => {
    const subs = fn.categories.flatMap((c) => c.subcategories);
    const vals = subs.map((s) => targets[s.id]).filter((v): v is number => v !== null && v !== undefined);
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }, [targets]);

  const setAllInFunction = useCallback((fn: FunctionGroup, score: number) => {
    setTargets((prev) => {
      const next = { ...prev };
      fn.categories.flatMap((c) => c.subcategories).forEach((s) => { next[s.id] = score; });
      return next;
    });
    setDirty(true);
  }, []);

  const totalTargeted = useMemo(
    () => Object.values(targets).filter((v) => v !== null && v !== undefined).length,
    [targets]
  );

  if (loading) return <div className="text-slate-400 text-sm">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Target Maturity</h1>
          <p className="text-slate-500 text-sm mt-1">
            Set the desired maturity level for each subcategory. Used by Gap Analysis to compare against current scores.
            <span className="ml-1">{totalTargeted} subcategories targeted</span>
          </p>
        </div>
        <button
          onClick={save}
          disabled={saving || !dirty}
          className="text-sm px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-700 disabled:opacity-40 transition-colors shrink-0"
        >
          {saving ? 'Saving…' : 'Save Targets'}
        </button>
      </div>

      <div className="flex gap-6">
        <aside className="w-48 shrink-0 space-y-1">
          {groups.map((g) => {
            const avg = functionAvgTarget(g);
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

        <div className="flex-1 min-w-0">
          {activeGroup && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold text-slate-800 text-lg">
                  {activeGroup.fn.code} — {activeGroup.fn.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span>Quick set all:</span>
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      onClick={() => setAllInFunction(activeGroup, n)}
                      className="w-7 h-7 rounded border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
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
                    {catGroup.subcategories.map((sub) => (
                      <div key={sub.id} className="px-5 py-4 flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="text-xs font-mono text-slate-400 mb-0.5">{sub.code}</p>
                          <p className="text-sm font-medium text-slate-800">{sub.title}</p>
                          {sub.description && (
                            <p className="text-xs text-slate-500 mt-0.5">{sub.description}</p>
                          )}
                        </div>
                        <MaturitySelector
                          value={targets[sub.id] ?? null}
                          onChange={(score) => handleChange(sub.id, score)}
                          controlId={sub.id}
                        />
                      </div>
                    ))}
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
