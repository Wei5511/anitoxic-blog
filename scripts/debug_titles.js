const db = require('better-sqlite3')('anime.db');

const rows = db.prepare('SELECT mal_id, title, title_japanese FROM anime WHERE year >= 2025 LIMIT 20').all();
console.log(JSON.stringify(rows, null, 2));
