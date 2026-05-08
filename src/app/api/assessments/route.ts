import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { logger, getClientIp } from '@/lib/logger';

export async function GET() {
  seedDatabase();
  const db = getDb();
  const assessments = db.prepare(
    'SELECT * FROM assessments ORDER BY created_at DESC'
  ).all();
  return NextResponse.json(assessments);
}

export async function POST(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json();

    const lastId = db.prepare("SELECT id FROM assessments ORDER BY id DESC LIMIT 1").get() as { id: string } | undefined;
    let nextNum = 1;
    if (lastId) {
      const num = parseInt(lastId.id.replace('ASM-', ''), 10);
      nextNum = isNaN(num) ? 1 : num + 1;
    }
    const id = `ASM-${String(nextNum).padStart(4, '0')}`;

    db.transaction(() => {
      db.prepare(`INSERT INTO assessments (id, framework_id, title, description, assessor, assessed_at)
        VALUES (?, ?, ?, ?, ?, ?)`).run(
        id,
        body.framework_id ?? 1,
        body.title,
        body.description ?? null,
        body.assessor ?? null,
        body.assessed_at ?? null,
      );

      db.prepare(`INSERT INTO audit_log (action, resource_type, resource_id, actor, ip_address, details)
        VALUES (?, ?, ?, ?, ?, ?)`).run(
        'create', 'assessment', id, body.assessor ?? null, ip,
        JSON.stringify({ title: body.title })
      );
    })();

    logger.audit('assessment.create', { resource_id: id, ip, title: body.title });

    const assessment = db.prepare('SELECT * FROM assessments WHERE id = ?').get(id);
    return NextResponse.json(assessment, { status: 201 });
  } catch (err) {
    logger.error('assessment.create.failed', { error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
