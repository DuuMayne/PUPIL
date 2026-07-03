'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Props {
  selectedIg: 1 | 2 | 3 | null;
  counts: Record<1 | 2 | 3, number>;
  total: number;
}

export default function CisIgSelector({ selectedIg, counts, total }: Props) {
  const router = useRouter();
  const [applying, setApplying] = useState(false);
  const [pendingIg, setPendingIg] = useState<1 | 2 | 3 | null>(selectedIg);

  async function apply(ig: 1 | 2 | 3) {
    setApplying(true);
    setPendingIg(ig);
    await fetch('/api/cis/targets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ig }),
    });
    setApplying(false);
    router.refresh();
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-5">
      <p className="text-sm font-semibold text-slate-800 mb-1">Target Implementation Group</p>
      <p className="text-xs text-slate-500 mb-4">
        Selecting an IG auto-populates targets for every safeguard at or below that group (IGs are cumulative — IG1 ⊆ IG2 ⊆ IG3).
      </p>
      <div className="flex gap-3">
        {([1, 2, 3] as const).map((ig) => (
          <button
            key={ig}
            onClick={() => apply(ig)}
            disabled={applying}
            className={`flex-1 rounded-lg border px-4 py-3 text-left transition-colors disabled:opacity-50 ${
              pendingIg === ig
                ? 'border-slate-900 bg-slate-900 text-white'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-400'
            }`}
          >
            <div className="text-sm font-bold">IG{ig}</div>
            <div className={`text-xs mt-0.5 ${pendingIg === ig ? 'text-slate-300' : 'text-slate-500'}`}>
              {counts[ig]} of {total} safeguards
            </div>
          </button>
        ))}
      </div>
      {selectedIg === null && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded px-3 py-2 mt-4">
          No Implementation Group selected yet — pick one above to auto-populate targets.
        </p>
      )}
    </div>
  );
}
