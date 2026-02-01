const db = require('better-sqlite3')('anime.db');
try {
    const rows = db.prepare('SELECT mal_id, title, image_url FROM anime WHERE year IN (2023, 2024) AND image_url IS NOT NULL LIMIT 20').all();
    console.log(JSON.stringify(rows, null, 2));
} catch (e) { console.error(e); }
