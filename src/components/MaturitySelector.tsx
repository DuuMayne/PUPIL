'use client';

import { useState } from 'react';
import { MaturityLevel, MATURITY_LABELS, MATURITY_DESCRIPTIONS } from '@/lib/types';
import { CONTROL_DESCRIPTORS } from '@/lib/descriptors';

interface Props {
  value: number | null;
  onChange: (score: number | null) => void;
  disabled?: boolean;
  controlId?: string;
}

const FULL_LEVELS: MaturityLevel[] = [1, 2, 3, 4, 5];
const HALF_STEPS: number[] = [1.5, 2.5, 3.5, 4.5];

const LEVEL_STYLES: Record<MaturityLevel, { base: string; selected: string; badge: string }> = {
  1: {
    base: 'border-red-200 hover:bg-red-50 hover:border-red-400',
    selected: 'bg-red-100 border-red-500 ring-1 ring-red-400',
    badge: 'bg-red-500',
  },
  2: {
    base: 'border-orange-200 hover:bg-orange-50 hover:border-orange-400',
    selected: 'bg-orange-100 border-orange-500 ring-1 ring-orange-400',
    badge: 'bg-orange-500',
  },
  3: {
    base: 'border-yellow-200 hover:bg-yellow-50 hover:border-yellow-400',
    selected: 'bg-yellow-100 border-yellow-500 ring-1 ring-yellow-400',
    badge: 'bg-yellow-500',
  },
  4: {
    base: 'border-emerald-200 hover:bg-emerald-50 hover:border-emerald-400',
    selected: 'bg-emerald-100 border-emerald-500 ring-1 ring-emerald-400',
    badge: 'bg-emerald-500',
  },
  5: {
    base: 'border-green-200 hover:bg-green-50 hover:border-green-400',
    selected: 'bg-green-100 border-green-500 ring-1 ring-green-400',
    badge: 'bg-green-500',
  },
};

const HALF_STYLES: Record<number, string> = {
  1.5: 'border-red-200/60 hover:bg-red-50/70 text-red-700/80',
  2.5: 'border-orange-200/60 hover:bg-orange-50/70 text-orange-700/80',
  3.5: 'border-yellow-200/70 hover:bg-yellow-50/70 text-yellow-700/80',
  4.5: 'border-emerald-200/70 hover:bg-emerald-50/70 text-emerald-700/80',
};

const HALF_SELECTED: Record<number, string> = {
  1.5: 'bg-red-50 border-red-400 text-red-700 ring-1 ring-red-300',
  2.5: 'bg-orange-50 border-orange-400 text-orange-700 ring-1 ring-orange-300',
  3.5: 'bg-yellow-50 border-yellow-400 text-yellow-700 ring-1 ring-yellow-300',
  4.5: 'bg-emerald-50 border-emerald-400 text-emerald-700 ring-1 ring-emerald-300',
};

export default function MaturitySelector({ value, onChange, disabled, controlId }: Props) {
  const [hovered, setHovered] = useState<MaturityLevel | null>(null);
  const controlDescriptors = controlId ? CONTROL_DESCRIPTORS[controlId] : undefined;

  return (
    <div className="flex flex-col items-end gap-1">
      {/* Full levels with tooltips */}
      <div className="flex gap-1">
        {FULL_LEVELS.map((level) => {
          const isSelected = value === level;
          const styles = LEVEL_STYLES[level];
          const isHovered = hovered === level;

          return (
            <div key={level} className="relative">
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(isSelected ? null : level)}
                onMouseEnter={() => setHovered(level)}
                onMouseLeave={() => setHovered(null)}
                className={`w-9 h-9 rounded border text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  isSelected ? styles.selected : `bg-white text-slate-600 ${styles.base}`
                }`}
              >
                {level}
              </button>

              {isHovered && (
                <div
                  className="absolute z-50 bottom-full mb-2 left-1/2 -translate-x-1/2 w-72 rounded-lg shadow-xl border border-slate-700 bg-slate-900 text-white text-xs pointer-events-none"
                  style={{ minWidth: '18rem' }}
                >
                  <div className={`flex items-center gap-2 px-3 py-2 rounded-t-lg ${styles.badge} bg-opacity-90`}>
                    <span className="font-bold text-sm text-white">Level {level}</span>
                    <span className="text-white/90 font-medium">{MATURITY_LABELS[level]}</span>
                  </div>
                  <div className="px-3 py-2 border-b border-slate-700">
                    <p className="text-slate-300 leading-snug">{MATURITY_DESCRIPTIONS[level]}</p>
                  </div>
                  {controlDescriptors && (
                    <div className="px-3 py-2">
                      <p className="text-slate-100 leading-snug">{controlDescriptors[level]}</p>
                    </div>
                  )}
                  <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-slate-900" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Half steps (no tooltips) */}
      <div className="flex gap-1 pr-[0.55rem]">
        {HALF_STEPS.map((step) => {
          const isSelected = value === step;
          return (
            <button
              key={step}
              type="button"
              disabled={disabled}
              onClick={() => onChange(isSelected ? null : step)}
              title={`${step} (between levels)`}
              className={`w-7 h-5 rounded border text-[10px] font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed ${
                isSelected ? HALF_SELECTED[step] : `bg-white ${HALF_STYLES[step]}`
              }`}
            >
              {step}
            </button>
          );
        })}
      </div>
    </div>
  );
}
