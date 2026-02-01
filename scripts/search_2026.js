const db = require('better-sqlite3')('anime.db');
const rows = db.prepare("SELECT id, title, slug FROM articles WHERE title LIKE ? OR content LIKE ?").all('%2026%', '%2026%');
console.log(JSON.stringify(rows, null, 2));
