'use client';

import { MaturityLevel, MATURITY_LABELS, MATURITY_DESCRIPTIONS } from '@/lib/types';

interface Props {
  value: MaturityLevel | null;
  onChange: (score: MaturityLevel | null) => void;
  disabled?: boolean;
}

const LEVELS: MaturityLevel[] = [1, 2, 3, 4, 5];

const LEVEL_STYLES: Record<MaturityLevel, { base: string; selected: string }> = {
  1: { base: 'border-red-200 hover:bg-red-50 hover:border-red-400', selected: 'bg-red-100 border-red-500 ring-1 ring-red-400' },
  2: { base: 'border-orange-200 hover:bg-orange-50 hover:border-orange-400', selected: 'bg-orange-100 border-orange-500 ring-1 ring-orange-400' },
  3: { base: 'border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400', selected: 'bg-yellow-100 border-yellow-500 ring-1 ring-yellow-400' },
  4: { base: 'border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400', selected: 'bg-emerald-100 border-emerald-500 ring-1 ring-emerald-400' },
  5: { base: 'border-green-200 hover:bg-green-50 hover:border-green-400', selected: 'bg-green-100 border-green-500 ring-1 ring-green-400' },
};

export default function MaturitySelector({ value, onChange, disabled }: Props) {
  return (
    <div className="flex gap-1">
      {LEVELS.map((level) => {
        const isSelected = value === level;
        const styles = LEVEL_STYLES[level];
        return (
          <button
            key={level}
            type="button"
            disabled={disabled}
            onClick={() => onChange(isSelected ? null : level)}
            title={`${level} — ${MATURITY_LABELS[level]}: ${MATURITY_DESCRIPTIONS[level]}`}
            className={`w-9 h-9 rounded border text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
              isSelected ? styles.selected : `bg-white text-slate-600 ${styles.base}`
            }`}
          >
            {level}
          </button>
        );
      })}
    </div>
  );
}
