
const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'anime.db');
console.log('Opening DB at:', dbPath);

try {
    const db = new Database(dbPath);
    const count = db.prepare('SELECT COUNT(*) as count FROM articles').get();
    console.log('Total articles:', count.count);

    const article3 = db.prepare('SELECT id, title FROM articles WHERE id = 3').get();
    console.log('Article 3:', article3);

    const all = db.prepare('SELECT id, title FROM articles LIMIT 5').all();
    console.log('First 5 articles:', all);
} catch (e) {
    console.error('DB Error:', e);
}
