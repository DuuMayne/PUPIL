import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';
import { logger, getClientIp } from '@/lib/logger';

const CIS_FRAMEWORK_ID = 2;
const AUTO_TARGET_SCORE = 3;

export async function GET() {
  seedDatabase();
  const db = getDb();
  const row = db.prepare('SELECT selected_ig FROM cis_settings WHERE id = 1').get() as { selected_ig: 1 | 2 | 3 | null } | undefined;
  return NextResponse.json({ selectedIg: row?.selected_ig ?? null });
}

export async function POST(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const ip = getClientIp(req);

  try {
    const { ig } = await req.json() as { ig: 1 | 2 | 3 };
    if (![1, 2, 3].includes(ig)) {
      return NextResponse.json({ error: 'ig must be 1, 2, or 3' }, { status: 400 });
    }

    const safeguards = db.prepare(
      `SELECT id, min_ig FROM controls WHERE framework_id = ? AND level = 'subcategory'`
    ).all(CIS_FRAMEWORK_ID) as { id: string; min_ig: 1 | 2 | 3 }[];

    const upsert = db.prepare(`INSERT INTO targets (framework_id, control_id, target_score)
      VALUES (?, ?, ?)
      ON CONFLICT(framework_id, control_id) DO UPDATE SET
        target_score = excluded.target_score,
        updated_at = datetime('now')`);
    const clear = db.prepare('DELETE FROM targets WHERE framework_id = ? AND control_id = ?');

    let inScope = 0;
    db.transaction(() => {
      for (const s of safeguards) {
        if (s.min_ig <= ig) {
          upsert.run(CIS_FRAMEWORK_ID, s.id, AUTO_TARGET_SCORE);
          inScope++;
        } else {
          clear.run(CIS_FRAMEWORK_ID, s.id);
        }
      }
      db.prepare(`INSERT INTO cis_settings (id, selected_ig, updated_at) VALUES (1, ?, datetime('now'))
        ON CONFLICT(id) DO UPDATE SET selected_ig = excluded.selected_ig, updated_at = datetime('now')`).run(ig);
    })();

    logger.audit('cis.targets.regenerate', { ig, inScope, total: safeguards.length, ip });
    return NextResponse.json({ ok: true, ig, inScope, total: safeguards.length });
  } catch (err) {
    logger.error('cis.targets.regenerate.failed', { error: String(err), ip });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
