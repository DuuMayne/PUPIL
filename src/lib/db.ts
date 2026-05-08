import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const DB_PATH = process.env.DB_PATH ?? path.join(process.cwd(), 'data', 'pupil.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

  db = new Database(DB_PATH);
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  db.exec(`
    CREATE TABLE IF NOT EXISTS frameworks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      version TEXT NOT NULL,
      description TEXT,
      is_active INTEGER DEFAULT 1,
      UNIQUE(name, version)
    );

    CREATE TABLE IF NOT EXISTS controls (
      id TEXT PRIMARY KEY,
      framework_id INTEGER NOT NULL REFERENCES frameworks(id),
      parent_id TEXT REFERENCES controls(id),
      level TEXT NOT NULL CHECK(level IN ('function', 'category', 'subcategory')),
      code TEXT NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      sort_order INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS assessments (
      id TEXT PRIMARY KEY,
      framework_id INTEGER NOT NULL REFERENCES frameworks(id),
      title TEXT NOT NULL,
      description TEXT,
      assessor TEXT,
      status TEXT NOT NULL DEFAULT 'draft' CHECK(status IN ('draft', 'published')),
      assessed_at TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS assessment_scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      assessment_id TEXT NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
      control_id TEXT NOT NULL REFERENCES controls(id),
      score REAL CHECK(score BETWEEN 1 AND 5),
      rationale TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(assessment_id, control_id)
    );

    CREATE TABLE IF NOT EXISTS targets (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      framework_id INTEGER NOT NULL REFERENCES frameworks(id),
      control_id TEXT NOT NULL REFERENCES controls(id),
      target_score REAL NOT NULL CHECK(target_score BETWEEN 1 AND 5),
      notes TEXT,
      updated_at TEXT DEFAULT (datetime('now')),
      UNIQUE(framework_id, control_id)
    );

    CREATE TABLE IF NOT EXISTS stakeholder_inputs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      control_id TEXT NOT NULL REFERENCES controls(id),
      assessment_id TEXT REFERENCES assessments(id) ON DELETE SET NULL,
      team TEXT NOT NULL,
      contact TEXT,
      input_text TEXT NOT NULL,
      evidence_url TEXT,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      entity_type TEXT NOT NULL,
      entity_id TEXT NOT NULL,
      author TEXT,
      body TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS audit_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp TEXT DEFAULT (datetime('now')),
      action TEXT NOT NULL,
      resource_type TEXT NOT NULL,
      resource_id TEXT NOT NULL,
      actor TEXT,
      ip_address TEXT,
      details TEXT
    );
  `);

  return db;
}
