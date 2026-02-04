const Database = require('better-sqlite3');
const db = new Database('anime.db');

const slug = '2026-winter-must-watch';

try {
    const info = db.prepare('DELETE FROM articles WHERE slug = ?').run(slug);
    console.log(`Deleted article '${slug}': ${info.changes} rows affected.`);

    // Verify
    const check = db.prepare('SELECT * FROM articles WHERE slug = ?').get(slug);
    if (!check) {
        console.log('Verification: Article no longer exists.');
    } else {
        console.log('Verification FAILED: Article still exists.');
    }
} catch (e) {
    console.error('Error deleting article:', e);
}
