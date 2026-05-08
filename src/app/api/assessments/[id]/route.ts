import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { logger, getClientIp } from '@/lib/logger';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();

  const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(id);
  if (!assessment) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const scores = db.prepare(
    'SELECT * FROM assessment_scores WHERE assessment_id = ?'
  ).all(id);

  return NextResponse.json({ ...assessment as object, scores });
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json();

    const existing = db.prepare('SELECT id FROM assessments WHERE id = ?').get(id);
    if (!existing) return NextResponse.json({ error: 'Not found' }, { status: 404 });

    db.transaction(() => {
      db.prepare(`UPDATE assessments SET
        title = ?, description = ?, assessor = ?, status = ?, assessed_at = ?,
        updated_at = datetime('now')
      WHERE id = ?`).run(
        body.title, body.description ?? null, body.assessor ?? null,
        body.status, body.assessed_at ?? null, id
      );

      db.prepare(`INSERT INTO audit_log (action, resource_type, resource_id, actor, ip_address, details)
        VALUES (?, ?, ?, ?, ?, ?)`).run(
        'update', 'assessment', id, body.assessor ?? null, ip,
        JSON.stringify({ title: body.title, status: body.status })
      );
    })();

    logger.audit('assessment.update', { resource_id: id, ip, status: body.status });

    const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(id);
    return NextResponse.json(assessment);
  } catch (err) {
    logger.error('assessment.update.failed', { resource_id: id, error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();
  const ip = getClientIp(req);

  try {
    db.transaction(() => {
      db.prepare('DELETE FROM assessments WHERE id = ?').run(id);
      db.prepare(`INSERT INTO audit_log (action, resource_type, resource_id, actor, ip_address, details)
        VALUES (?, ?, ?, ?, ?, ?)`).run('delete', 'assessment', id, null, ip, null);
    })();

    logger.audit('assessment.delete', { resource_id: id, ip });
    return NextResponse.json({ ok: true });
  } catch (err) {
    logger.error('assessment.delete.failed', { resource_id: id, error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
