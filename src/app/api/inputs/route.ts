import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { logger, getClientIp } from '@/lib/logger';

export async function GET(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const params = req.nextUrl.searchParams;
  const controlId = params.get('control_id');
  const assessmentId = params.get('assessment_id');

  let sql = 'SELECT * FROM stakeholder_inputs WHERE 1=1';
  const args: string[] = [];
  if (controlId) { sql += ' AND control_id = ?'; args.push(controlId); }
  if (assessmentId) { sql += ' AND assessment_id = ?'; args.push(assessmentId); }
  sql += ' ORDER BY created_at DESC';

  return NextResponse.json(db.prepare(sql).all(...args));
}

export async function POST(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json();

    const result = db.prepare(`INSERT INTO stakeholder_inputs
      (control_id, assessment_id, team, contact, input_text, evidence_url)
      VALUES (?, ?, ?, ?, ?, ?)`).run(
      body.control_id,
      body.assessment_id ?? null,
      body.team,
      body.contact ?? null,
      body.input_text,
      body.evidence_url ?? null,
    );

    logger.audit('stakeholder_input.create', { control_id: body.control_id, team: body.team, ip });

    const record = db.prepare('SELECT * FROM stakeholder_inputs WHERE id = ?').get(result.lastInsertRowid);
    return NextResponse.json(record, { status: 201 });
  } catch (err) {
    logger.error('stakeholder_input.create.failed', { error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
