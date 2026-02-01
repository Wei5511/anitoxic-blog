const Database = require('better-sqlite3');
const db = new Database('anime.db');

// 1. Create Banners Table
db.exec(`
  CREATE TABLE IF NOT EXISTS banners (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    title TEXT,
    link TEXT,
    is_active INTEGER DEFAULT 1,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('Table "banners" ready.');

// 2. Create Settings Table
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);
console.log('Table "settings" ready.');

// 3. Ensure 'articles' has 'is_pinned' (It should, but safety first)
try {
    const info = db.prepare("PRAGMA table_info(articles)").all();
    const hasPinned = info.some(col => col.name === 'is_pinned');
    if (!hasPinned) {
        db.exec("ALTER TABLE articles ADD COLUMN is_pinned INTEGER DEFAULT 0");
        console.log('Added column "is_pinned" to articles.');
    } else {
        console.log('Column "is_pinned" already exists.');
    }
} catch (e) {
    console.error('Error checking articles table:', e);
}
