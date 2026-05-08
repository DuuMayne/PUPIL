import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function GET(req: NextRequest) {
  seedDatabase();
  const db = getDb();
  const params = req.nextUrl.searchParams;
  const level = params.get('level');
  const parentId = params.get('parent_id');
  const frameworkId = params.get('framework_id') ?? '1';

  let sql = 'SELECT * FROM controls WHERE framework_id = ?';
  const args: (string | number)[] = [parseInt(frameworkId, 10)];

  if (level) { sql += ' AND level = ?'; args.push(level); }
  if (parentId) { sql += ' AND parent_id = ?'; args.push(parentId); }

  sql += ' ORDER BY sort_order, id';

  const controls = db.prepare(sql).all(...args);
  return NextResponse.json(controls);
}
