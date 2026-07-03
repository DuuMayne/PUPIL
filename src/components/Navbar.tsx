'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_LINKS = [
  { href: '/', label: 'Dashboard' },
  { href: '/assessments', label: 'Assessments' },
  { href: '/targets', label: 'Targets' },
  { href: '/gap', label: 'Gap Analysis' },
  { href: '/roadmap', label: 'Roadmap' },
  { href: '/trends', label: 'Trends' },
  { href: '/cis', label: 'CIS Controls' },
];

export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="bg-slate-900 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-14">
        <div className="flex items-center gap-8">
          <span className="font-bold text-white tracking-wide text-sm">
            PUPIL
            <span className="ml-2 text-slate-400 font-normal text-xs hidden sm:inline">
              Program Uplift &amp; Posture Improvement Ledger
            </span>
          </span>
          <div className="flex gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`px-3 py-1.5 rounded text-sm transition-colors ${
                    active
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </div>
        </div>
        <span className="text-slate-500 text-xs">NIST CSF 2.0 · CIS Controls v8.1</span>
      </div>
    </nav>
  );
}
