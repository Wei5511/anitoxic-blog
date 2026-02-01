const db = require('better-sqlite3')('anime.db');

try {
    const rows = db.prepare('SELECT mal_id, title, synopsis FROM anime WHERE year IN (2025, 2026) ORDER BY mal_id DESC LIMIT 10').all();
    console.log(JSON.stringify(rows, null, 2));
} catch (e) {
    console.error(e);
}
