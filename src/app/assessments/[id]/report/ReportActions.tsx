'use client';

import { useState } from 'react';

export default function ReportActions({ id, title }: { id: string; title: string }) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    const url = `${window.location.origin}/assessments/${id}/report`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      window.prompt('Copy this link:', url);
    }
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={copyLink}
        className="text-sm px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 transition-colors"
      >
        {copied ? 'Copied ✓' : 'Copy Link'}
      </button>
      <a
        href={`/api/assessments/${id}/export?format=csv`}
        download={`${title.replace(/[^\w-]+/g, '_')}.csv`}
        className="text-sm px-3 py-1.5 border border-slate-200 rounded hover:bg-slate-50 text-slate-700 transition-colors"
      >
        Export CSV
      </a>
      <button
        onClick={() => window.print()}
        className="text-sm px-3 py-1.5 bg-slate-900 text-white rounded hover:bg-slate-700 transition-colors"
      >
        Print / Save PDF
      </button>
    </div>
  );
}
