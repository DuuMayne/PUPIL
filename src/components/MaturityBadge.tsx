import { MaturityLevel, MATURITY_LABELS, MATURITY_COLORS } from '@/lib/types';

interface Props {
  score: MaturityLevel | null | undefined;
  showLabel?: boolean;
  size?: 'sm' | 'md';
}

export default function MaturityBadge({ score, showLabel = true, size = 'md' }: Props) {
  if (!score) {
    return (
      <span className={`inline-flex items-center border rounded font-medium text-slate-400 bg-slate-100 border-slate-200 ${size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'}`}>
        —
      </span>
    );
  }

  const colorClass = MATURITY_COLORS[score];
  const label = MATURITY_LABELS[score];

  return (
    <span className={`inline-flex items-center gap-1 border rounded font-medium ${colorClass} ${size === 'sm' ? 'px-1.5 py-0.5 text-xs' : 'px-2 py-1 text-xs'}`}>
      <span className="font-bold">{score}</span>
      {showLabel && <span className="hidden sm:inline">{label}</span>}
    </span>
  );
}
