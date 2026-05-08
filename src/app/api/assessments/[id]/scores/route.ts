import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { logger, getClientIp } from '@/lib/logger';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();
  const scores = db.prepare('SELECT * FROM assessment_scores WHERE assessment_id = ?').all(id);
  return NextResponse.json(scores);
}

// Upsert a single score
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json();
    const { control_id, score, rationale } = body;

    db.prepare(`INSERT INTO assessment_scores (assessment_id, control_id, score, rationale)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(assessment_id, control_id) DO UPDATE SET
        score = excluded.score,
        rationale = excluded.rationale,
        updated_at = datetime('now')`
    ).run(id, control_id, score ?? null, rationale ?? null);

    logger.audit('assessment.score.upsert', { assessment_id: id, control_id, score, ip });

    const updated = db.prepare(
      'SELECT * FROM assessment_scores WHERE assessment_id = ? AND control_id = ?'
    ).get(id, control_id);
    return NextResponse.json(updated);
  } catch (err) {
    logger.error('assessment.score.upsert.failed', { assessment_id: id, error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Batch upsert — array of { control_id, score, rationale }
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  seedDatabase();
  const { id } = await params;
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const body = await req.json() as { control_id: string; score: number | null; rationale: string | null }[];

    const upsert = db.prepare(`INSERT INTO assessment_scores (assessment_id, control_id, score, rationale)
      VALUES (?, ?, ?, ?)
      ON CONFLICT(assessment_id, control_id) DO UPDATE SET
        score = excluded.score,
        rationale = excluded.rationale,
        updated_at = datetime('now')`);

    db.transaction(() => {
      for (const item of body) {
        upsert.run(id, item.control_id, item.score ?? null, item.rationale ?? null);
      }
    })();

    logger.audit('assessment.scores.batch_upsert', { assessment_id: id, count: body.length, ip });

    const scores = db.prepare('SELECT * FROM assessment_scores WHERE assessment_id = ?').all(id);
    return NextResponse.json(scores);
  } catch (err) {
    logger.error('assessment.scores.batch_upsert.failed', { assessment_id: id, error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
