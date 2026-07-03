import { ReactNode } from 'react';
import MaturitySelector from '@/components/MaturitySelector';
import { Control } from '@/lib/types';

interface Props {
  control: Control;
  score: number | null;
  rationale: string;
  onScoreChange: (score: number | null) => void;
  onRationaleChange: (rationale: string) => void;
  disabled: boolean;
  badge?: ReactNode;
}

export default function ScoreControlRow({ control, score, rationale, onScoreChange, onRationaleChange, disabled, badge }: Props) {
  return (
    <div className="px-5 py-4">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="min-w-0">
          <p className="text-xs font-mono text-slate-400 mb-0.5 flex items-center gap-1.5">
            {control.code}
            {badge}
          </p>
          <p className="text-sm font-medium text-slate-800">{control.title}</p>
          {control.description && (
            <p className="text-xs text-slate-500 mt-0.5">{control.description}</p>
          )}
        </div>
        <MaturitySelector
          value={score}
          onChange={onScoreChange}
          disabled={disabled}
          controlId={control.id}
        />
      </div>
      {((score !== null && score !== undefined) || rationale) && (
        <textarea
          placeholder="Rationale, evidence, or notes…"
          value={rationale}
          onChange={(e) => onRationaleChange(e.target.value)}
          disabled={disabled}
          rows={2}
          className="w-full text-xs border border-slate-200 rounded px-3 py-2 text-slate-700 placeholder-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 resize-none disabled:bg-slate-50"
        />
      )}
    </div>
  );
}
