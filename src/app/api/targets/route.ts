import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { logger, getClientIp } from '@/lib/logger';

export async function GET(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const frameworkId = req.nextUrl.searchParams.get('framework_id') ?? '1';
  const targets = db.prepare(
    'SELECT * FROM targets WHERE framework_id = ?'
  ).all(parseInt(frameworkId, 10));
  return NextResponse.json(targets);
}

// Upsert a single target
export async function PUT(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json();
    const { framework_id = 1, control_id, target_score, notes } = body;

    db.prepare(`INSERT INTO targets (framework_id, control_id, target_score, notes)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(framework_id, control_id) DO UPDATE SET
        target_score = excluded.target_score,
        notes = excluded.notes,
        updated_at = datetime('now')`
    ).run(framework_id, control_id, target_score, notes ?? null);

    logger.audit('target.upsert', { control_id, target_score, ip });

    const target = db.prepare(
      'SELECT * FROM targets WHERE framework_id = ? AND control_id = ?'
    ).get(framework_id, control_id);
    return NextResponse.json(target);
  } catch (err) {
    logger.error('target.upsert.failed', { error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Batch upsert targets
export async function POST(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json() as { framework_id?: number; control_id: string; target_score: number; notes?: string }[];

    const upsert = db.prepare(`INSERT INTO targets (framework_id, control_id, target_score, notes)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(framework_id, control_id) DO UPDATE SET
        target_score = excluded.target_score,
        notes = excluded.notes,
        updated_at = datetime('now')`);

    db.transaction(() => {
      for (const item of body) {
        upsert.run(item.framework_id ?? 1, item.control_id, item.target_score, item.notes ?? null);
      }
    })();

    logger.audit('targets.batch_upsert', { count: body.length, ip });
    const targets = db.prepare('SELECT * FROM targets WHERE framework_id = ?').all(body[0]?.framework_id ?? 1);
    return NextResponse.json(targets);
  } catch (err) {
    logger.error('targets.batch_upsert.failed', { error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
