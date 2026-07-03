import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { Assessment, Control, MATURITY_LABELS } from '@/lib/types';
import ReportActions from './ReportActions';

export const dynamic = 'force-dynamic';

interface ScoreRow { control_id: string; score: number | null; rationale: string | null; }
interface TargetRow { control_id: string; target_score: number; }

function fmt(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return Number(n).toFixed(1);
}

function levelLabel(score: number | null | undefined): string {
  if (score === null || score === undefined) return '';
  const rounded = Math.round(score);
  if (rounded >= 1 && rounded <= 5) return MATURITY_LABELS[rounded as 1 | 2 | 3 | 4 | 5];
  return '';
}

function SubcategoryTable({
  subcategories, scoreMap, targetMap,
}: {
  subcategories: Control[];
  scoreMap: Map<string, ScoreRow>;
  targetMap: Map<string, number>;
}) {
  return (
    <table className="w-full text-sm">
      <tbody className="divide-y divide-slate-50">
        {subcategories.map((sub) => {
          const sc = scoreMap.get(sub.id);
          const tg = targetMap.get(sub.id);
          return (
            <tr key={sub.id} className="break-inside-avoid">
              <td className="px-5 py-3 align-top w-2/3">
                <p>
                  <span className="font-mono text-xs text-slate-400 mr-2">{sub.code}</span>
                  <span className="text-slate-800">{sub.title}</span>
                </p>
                {sc?.rationale && (
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed whitespace-pre-wrap">{sc.rationale}</p>
                )}
              </td>
              <td className="px-5 py-3 text-right align-top w-1/3 whitespace-nowrap">
                <span className="font-semibold text-slate-900">{fmt(sc?.score ?? null)}</span>
                <span className="text-slate-400 mx-1">/</span>
                <span className="text-slate-600">{fmt(tg ?? null)}</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default async function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();

  const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(id) as Assessment | undefined;
  if (!assessment) notFound();

  const controls = db.prepare('SELECT * FROM controls WHERE framework_id = ? ORDER BY sort_order').all(assessment.framework_id) as Control[];
  const scores = db.prepare('SELECT control_id, score, rationale FROM assessment_scores WHERE assessment_id = ?').all(id) as ScoreRow[];
  const targets = db.prepare('SELECT control_id, target_score FROM targets WHERE framework_id = ?').all(assessment.framework_id) as TargetRow[];

  const scoreMap = new Map(scores.map((s) => [s.control_id, s]));
  const targetMap = new Map(targets.map((t) => [t.control_id, t.target_score]));

  const fns = controls.filter((c) => c.level === 'function');
  const cats = controls.filter((c) => c.level === 'category');
  const subs = controls.filter((c) => c.level === 'subcategory');

  // CIS Controls v8.1 has no function tier — Controls (`cats`) are the
  // top-level grouping directly over Safeguards, a flat 2-level report
  // instead of NIST's Function → Category → Subcategory 3-level one.
  const isFlatFramework = fns.length === 0;

  const groups = fns.map((fn) => ({
    fn,
    categories: cats.filter((c) => c.parent_id === fn.id).map((cat) => ({
      cat,
      subcategories: subs.filter((s) => s.parent_id === cat.id),
    })),
  }));

  const flatGroups = cats.map((cat) => ({
    cat,
    subcategories: subs.filter((s) => s.parent_id === cat.id),
  }));

  const allScored = scores.filter((s) => s.score !== null).map((s) => s.score as number);
  const overall = allScored.length ? allScored.reduce((a, b) => a + b, 0) / allScored.length : null;
  const totalSubs = subs.length;

  function fnAverage(fnId: string): number | null {
    const fnSubs = cats.filter((c) => c.parent_id === fnId).flatMap((c) => subs.filter((s) => s.parent_id === c.id));
    const vals = fnSubs.map((s) => scoreMap.get(s.id)?.score).filter((v): v is number => typeof v === 'number');
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }
  function fnTargetAverage(fnId: string): number | null {
    const fnSubs = cats.filter((c) => c.parent_id === fnId).flatMap((c) => subs.filter((s) => s.parent_id === c.id));
    const vals = fnSubs.map((s) => targetMap.get(s.id)).filter((v): v is number => typeof v === 'number');
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }
  function catAverage(catId: string): number | null {
    const catSubs = subs.filter((s) => s.parent_id === catId);
    const vals = catSubs.map((s) => scoreMap.get(s.id)?.score).filter((v): v is number => typeof v === 'number');
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }
  function catTargetAverage(catId: string): number | null {
    const catSubs = subs.filter((s) => s.parent_id === catId);
    const vals = catSubs.map((s) => targetMap.get(s.id)).filter((v): v is number => typeof v === 'number');
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto print:max-w-none print:mx-0 print:space-y-6 print:text-black">
      {/* Action bar — hidden on print */}
      <div className="flex items-center justify-between print:hidden">
        <Link href="/assessments" className="text-sm text-slate-500 hover:text-slate-900">← Back to assessments</Link>
        <ReportActions id={id} title={assessment.title} />
      </div>

      {/* Header */}
      <header className="border-b border-slate-200 pb-6 print:pb-4">
        <p className="text-xs font-mono text-slate-400">{assessment.id}</p>
        <h1 className="text-3xl font-bold text-slate-900 mt-1 print:text-2xl">{assessment.title}</h1>
        <div className="flex flex-wrap gap-x-6 gap-y-1 text-sm text-slate-600 mt-3">
          <span><strong className="text-slate-800">Framework:</strong> {assessment.framework_id === 2 ? 'CIS Controls v8.1' : 'NIST CSF 2.0'}</span>
          <span><strong className="text-slate-800">Status:</strong> {assessment.status}</span>
          {assessment.assessed_at && <span><strong className="text-slate-800">Assessed:</strong> {assessment.assessed_at}</span>}
          {assessment.assessor && <span><strong className="text-slate-800">Assessor:</strong> {assessment.assessor}</span>}
        </div>
        {assessment.description && (
          <p className="text-sm text-slate-700 mt-3 leading-relaxed">{assessment.description}</p>
        )}
      </header>

      {/* Executive summary */}
      <section>
        <h2 className="text-lg font-semibold text-slate-900 mb-3">Executive Summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 print:grid-cols-4">
          <div className="border border-slate-200 rounded p-4 print:p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Overall Maturity</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{fmt(overall)}</p>
            <p className="text-xs text-slate-500 mt-0.5">{levelLabel(overall)}</p>
          </div>
          <div className="border border-slate-200 rounded p-4 print:p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Subcategories Scored</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{allScored.length}/{totalSubs}</p>
          </div>
          <div className="border border-slate-200 rounded p-4 print:p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Targets Defined</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{targets.length}</p>
          </div>
          <div className="border border-slate-200 rounded p-4 print:p-3">
            <p className="text-xs text-slate-500 uppercase tracking-wide">{isFlatFramework ? 'Controls Covered' : 'Functions Covered'}</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">{isFlatFramework ? cats.length : fns.length}</p>
          </div>
        </div>

        <div className="mt-4 border border-slate-200 rounded">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
              <tr>
                <th className="text-left px-4 py-2 font-medium">{isFlatFramework ? 'Control' : 'Function'}</th>
                <th className="text-right px-4 py-2 font-medium w-32">Current</th>
                <th className="text-right px-4 py-2 font-medium w-32">Target</th>
                <th className="text-right px-4 py-2 font-medium w-32">Gap</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {(isFlatFramework ? cats : fns).map((row) => {
                const cur = isFlatFramework ? catAverage(row.id) : fnAverage(row.id);
                const tgt = isFlatFramework ? catTargetAverage(row.id) : fnTargetAverage(row.id);
                const gap = cur !== null && tgt !== null ? tgt - cur : null;
                return (
                  <tr key={row.id}>
                    <td className="px-4 py-2"><span className="font-mono text-slate-400 mr-2">{row.code}</span>{row.title}</td>
                    <td className="px-4 py-2 text-right font-medium">{fmt(cur)}</td>
                    <td className="px-4 py-2 text-right">{fmt(tgt)}</td>
                    <td className={`px-4 py-2 text-right font-medium ${gap !== null && gap > 0 ? 'text-red-600' : 'text-green-700'}`}>
                      {gap === null ? '—' : gap > 0 ? `-${gap.toFixed(1)}` : '✓'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* Detail */}
      <section className="space-y-6">
        <h2 className="text-lg font-semibold text-slate-900">Detailed Scores</h2>
        {isFlatFramework ? (
          flatGroups.map(({ cat, subcategories }) => (
            <div key={cat.id} className="border border-slate-200 rounded overflow-hidden break-inside-avoid">
              <div className="bg-slate-800 text-white px-5 py-3 print:bg-slate-200 print:text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm opacity-80">{cat.code}</span>
                  <span className="font-semibold">{cat.title}</span>
                </div>
                <span className="text-sm">Current {fmt(catAverage(cat.id))} · Target {fmt(catTargetAverage(cat.id))}</span>
              </div>
              <SubcategoryTable subcategories={subcategories} scoreMap={scoreMap} targetMap={targetMap} />
            </div>
          ))
        ) : (
          groups.map(({ fn, categories }) => (
            <div key={fn.id} className="border border-slate-200 rounded overflow-hidden break-inside-avoid">
              <div className="bg-slate-800 text-white px-5 py-3 print:bg-slate-200 print:text-slate-900 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-sm opacity-80">{fn.code}</span>
                  <span className="font-semibold">{fn.title}</span>
                </div>
                <span className="text-sm">Current {fmt(fnAverage(fn.id))} · Target {fmt(fnTargetAverage(fn.id))}</span>
              </div>
              {categories.map(({ cat, subcategories }) => (
                <div key={cat.id} className="border-t border-slate-200">
                  <div className="px-5 py-2 bg-slate-50 border-b border-slate-100">
                    <span className="font-mono text-xs text-slate-400 mr-2">{cat.code}</span>
                    <span className="font-medium text-slate-700 text-sm">{cat.title}</span>
                  </div>
                  <SubcategoryTable subcategories={subcategories} scoreMap={scoreMap} targetMap={targetMap} />
                </div>
              ))}
            </div>
          ))
        )}
      </section>

      <footer className="text-xs text-slate-400 text-center pt-6 border-t border-slate-100">
        Generated by PUPIL · {new Date().toISOString().slice(0, 10)}
      </footer>
    </div>
  );
}
