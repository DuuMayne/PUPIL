import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { Assessment, Control } from '@/lib/types';

function csvEscape(v: unknown): string {
  if (v === null || v === undefined) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();

  const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(id) as Assessment | undefined;
  if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const format = req.nextUrl.searchParams.get('format') ?? 'csv';

  const controls = db.prepare(
    `SELECT * FROM controls WHERE framework_id = ? AND level = 'subcategory' ORDER BY sort_order`
  ).all(assessment.framework_id) as Control[];

  const scores = db.prepare(
    `SELECT control_id, score, rationale FROM assessment_scores WHERE assessment_id = ?`
  ).all(id) as { control_id: string; score: number | null; rationale: string | null }[];

  const targets = db.prepare(
    `SELECT control_id, target_score FROM targets WHERE framework_id = ?`
  ).all(assessment.framework_id) as { control_id: string; target_score: number }[];

  const scoreMap = new Map(scores.map((s) => [s.control_id, s]));
  const targetMap = new Map(targets.map((t) => [t.control_id, t.target_score]));

  // Resolve parent codes for category/function context
  const allControls = db.prepare('SELECT id, code, title, parent_id FROM controls WHERE framework_id = ?').all(assessment.framework_id) as { id: string; code: string; title: string; parent_id: string | null }[];
  const ctlById = new Map(allControls.map((c) => [c.id, c]));

  if (format === 'json') {
    return NextResponse.json({
      assessment,
      rows: controls.map((sub) => {
        const cat = sub.parent_id ? ctlById.get(sub.parent_id) : null;
        const fn = cat?.parent_id ? ctlById.get(cat.parent_id) : null;
        const sc = scoreMap.get(sub.id);
        return {
          function_code: fn?.code ?? '', function_title: fn?.title ?? '',
          category_code: cat?.code ?? '', category_title: cat?.title ?? '',
          subcategory_code: sub.code, subcategory_title: sub.title,
          score: sc?.score ?? null,
          target: targetMap.get(sub.id) ?? null,
          rationale: sc?.rationale ?? '',
        };
      }),
    });
  }

  const header = ['Function', 'Function Title', 'Category', 'Category Title', 'Subcategory', 'Subcategory Title', 'Score', 'Target', 'Gap', 'Rationale'];
  const lines = [header.map(csvEscape).join(',')];

  for (const sub of controls) {
    const cat = sub.parent_id ? ctlById.get(sub.parent_id) : null;
    const fn = cat?.parent_id ? ctlById.get(cat.parent_id) : null;
    const sc = scoreMap.get(sub.id);
    const tgt = targetMap.get(sub.id);
    const gap = sc?.score != null && tgt != null ? (tgt - sc.score).toFixed(1) : '';
    lines.push([
      fn?.code ?? '', fn?.title ?? '',
      cat?.code ?? '', cat?.title ?? '',
      sub.code, sub.title,
      sc?.score ?? '',
      tgt ?? '',
      gap,
      sc?.rationale ?? '',
    ].map(csvEscape).join(','));
  }

  const filename = `${assessment.id}_${assessment.title.replace(/[^\w-]+/g, '_')}.csv`;
  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/csv; charset=utf-8',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  });
}
