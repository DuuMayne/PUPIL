import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { logger, getClientIp } from '@/lib/logger';

export async function GET(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const params = req.nextUrl.searchParams;
  const entityType = params.get('entity_type');
  const entityId = params.get('entity_id');

  let sql = 'SELECT * FROM notes WHERE 1=1';
  const args: string[] = [];
  if (entityType) { sql += ' AND entity_type = ?'; args.push(entityType); }
  if (entityId) { sql += ' AND entity_id = ?'; args.push(entityId); }
  sql += ' ORDER BY created_at DESC';

  return NextResponse.json(db.prepare(sql).all(...args));
}

export async function POST(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json();

    const result = db.prepare(`INSERT INTO notes (entity_type, entity_id, author, body)
      VALUES (?, ?, ?, ?)`).run(
      body.entity_type,
      body.entity_id,
      body.author ?? null,
      body.body,
    );

    logger.audit('note.create', { entity_type: body.entity_type, entity_id: body.entity_id, ip });

    const record = db.prepare('SELECT * FROM notes WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    logger.error('note.create.failed', { error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
