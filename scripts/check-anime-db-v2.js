const Database = require('better-sqlite3');
const db = new Database('anime.db');

const jp_keywords = ['呪術', 'パーティー', '貴族転生', 'フリーレン', '推しの子'];
const results = {};

console.log('--- Anime Table Search (JP) ---');
jp_keywords.forEach(kw => {
    const rows = db.prepare(`SELECT id, title, title_jp, image_url, link, myvideo_url FROM anime WHERE title_jp LIKE '%${kw}%' OR title LIKE '%${kw}%'`).all();
    if (rows.length > 0) results[kw] = rows;
});
console.log(JSON.stringify(results, null, 2));

console.log('--- Existing Articles Content ---');
const articles = db.prepare("SELECT id, title, content FROM articles WHERE id IN (914, 915)").all();
articles.forEach(a => {
    console.log(`\n[ID: ${a.id}] ${a.title}`);
    console.log(a.content.substring(0, 500) + '...');
});
