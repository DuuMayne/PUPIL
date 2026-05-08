import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { seedDatabase } from '@/lib/seed';

export async function POST() {
  seedDatabase();
  const db = getDb();

  const fwCount = (db.prepare('SELECT COUNT(*) as c FROM frameworks').get() as { c: number }).c;
  const ctlCount = (db.prepare('SELECT COUNT(*) as c FROM controls').get() as { c: number }).c;

  return NextResponse.json({
    success: true,
    counts: { frameworks: fwCount, controls: ctlCount },
  });
}
