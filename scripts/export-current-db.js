const db = require('better-sqlite3')('anime.db');
const fs = require('fs');

console.log('Exporting data from local anime.db...');

// 1. Export 2026 Anime (and others if needed, but let's stick to 2026 for now as per script)
// Actually, I should probably export ALL anime that have changes?
// The sync script ref loop suggests it iterates over the JSON.
// Let's export all anime for safety or just 2026?
// The previous script name `anime-2026-export.json` suggests it was scoped.
// But some of the image fixes I did might be for older anime (Frieren, etc)?
// Frieren S2 is 2026.
// Let's export all anime from 2023-2026 to be safe?
// Or just export ALL anime. The DB isn't that huge.
const anime = db.prepare('SELECT * FROM anime').all();
fs.writeFileSync('anime-2026-export.json', JSON.stringify(anime, null, 2));
console.log(`Exported ${anime.length} anime to anime-2026-export.json`);

// 2. Export Articles
const articles = db.prepare('SELECT * FROM articles').all();
fs.writeFileSync('articles-export.json', JSON.stringify(articles, null, 2));
console.log(`Exported ${articles.length} articles to articles-export.json`);

console.log('Export complete.');
