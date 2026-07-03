'use client';

import ScoreControlRow from '@/components/ScoreControlRow';
import { Control, FUNCTION_LABELS, FUNCTION_COLORS } from '@/lib/types';

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

function FunctionBadge({ code }: { code: string | null }) {
  if (!code) return null;
  const color = FUNCTION_COLORS[code] ?? '#94a3b8';
  return (
    <span
      title={FUNCTION_LABELS[code] ?? code}
      className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold"
      style={{ backgroundColor: `${color}22`, color }}
    >
      {code}
    </span>
  );
}

export default function CisScorePanel({ controls, scores, onScoreChange, onRationaleChange, disabled }: Props) {
  const cisControls = controls.filter((c) => c.level === 'category');
  const safeguards = controls.filter((c) => c.level === 'subcategory');

  const safeguardsByControl = new Map<string, Control[]>();
  for (const s of safeguards) {
    const list = safeguardsByControl.get(s.parent_id ?? '') ?? [];
    list.push(s);
    safeguardsByControl.set(s.parent_id ?? '', list);
  }

  return (
    <div className="space-y-6">
      {cisControls.map((control) => (
        <div key={control.id} className="bg-white border border-slate-200 rounded-lg">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-100 rounded-t-lg">
            <p className="font-semibold text-slate-800 text-sm">
              {control.code} — {control.title}
            </p>
            {control.description && (
              <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{control.description}</p>
            )}
          </div>
          <div className="divide-y divide-slate-50">
            {(safeguardsByControl.get(control.id) ?? []).map((sub) => {
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
                  badge={
                    <>
                      <FunctionBadge code={sub.function_code} />
                      <span className="text-[10px] font-medium text-slate-400 border border-slate-200 rounded px-1">IG{sub.min_ig}</span>
                    </>
                  }
                />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
