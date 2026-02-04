const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Check schema
const schema = db.prepare("PRAGMA table_info(anime)").all();
console.log('Schema:', schema);

// Search for titles
const keywords = ['泛而不精', 'Party', 'Healer', 'Kizoku', 'Noble', 'Jujutsu', '咒術', 'Frieren', '芙莉蓮', 'Oshi', '我推'];
const results = {};

keywords.forEach(kw => {
    try {
        const rows = db.prepare(`SELECT * FROM anime WHERE title LIKE '%${kw}%' OR title_en LIKE '%${kw}%' OR title_jp LIKE '%${kw}%'`).all();
        if (rows.length > 0) results[kw] = rows;
    } catch (e) {
        // e.g. column might not exist
    }
});

console.log('Results:', JSON.stringify(results, null, 2));

// Also check articles table just in case
const articles = db.prepare("SELECT slug, title, image_url FROM articles WHERE title LIKE '%2026%'").all();
console.log('Articles:', articles);
