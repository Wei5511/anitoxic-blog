import Database from 'better-sqlite3';
import path from 'path';

// Singleton-like pattern for database connection in Next.js dev environment
// In production, this might need adjustment, but for local app it's fine.
const dbPath = path.join(process.cwd(), 'anime.db');

export function getDb() {
    const db = new Database(dbPath, { verbose: console.log });
    db.pragma('journal_mode = WAL');
    return db;
}
