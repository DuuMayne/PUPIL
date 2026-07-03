'use client';

import { useState } from 'react';
import MaturityBadge from '@/components/MaturityBadge';
import ScoreControlRow from '@/components/ScoreControlRow';
import { Control, MaturityLevel } from '@/lib/types';

interface FunctionGroup {
  fn: Control;
  categories: { cat: Control; subcategories: Control[] }[];
}

interface ScoreMap {
  [controlId: string]: { score: number | null; rationale: string };
}

interface Props {
  controls: Control[];
  scores: ScoreMap;
  onScoreChange: (controlId: string, score: number | null) => void;
  onRationaleChange: (controlId: string, rationale: string) => void;
  disabled: boolean;
}

export default function NistScorePanel({ controls, scores, onScoreChange, onRationaleChange, disabled }: Props) {
  const fns = controls.filter((c) => c.level === 'function');
  const cats = controls.filter((c) => c.level === 'category');
  const subs = controls.filter((c) => c.level === 'subcategory');

  const groups: FunctionGroup[] = fns.map((fn) => ({
    fn,
    categories: cats
      .filter((c) => c.parent_id === fn.id)
      .map((cat) => ({
        cat,
        subcategories: subs.filter((s) => s.parent_id === cat.id),
      })),
  }));

  const [activeFunction, setActiveFunction] = useState<string>(groups[0]?.fn.id ?? 'GV');

  const functionAvg = (fn: FunctionGroup): number | null => {
    const subcats = fn.categories.flatMap((c) => c.subcategories);
    const s = subcats.map((sub) => scores[sub.id]?.score).filter(Boolean) as number[];
    return s.length ? s.reduce((a, b) => a + b, 0) / s.length : null;
  };

  const activeGroup = groups.find((g) => g.fn.id === activeFunction);

  return (
    <div className="flex gap-6">
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
                      <ScoreControlRow
                        key={sub.id}
                        control={sub}
                        score={current?.score ?? null}
                        rationale={current?.rationale ?? ''}
                        onScoreChange={(score) => onScoreChange(sub.id, score)}
                        onRationaleChange={(rationale) => onRationaleChange(sub.id, rationale)}
                        disabled={disabled}
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
