const db = require('better-sqlite3')('anime.db');

const article = db.prepare('SELECT content FROM articles WHERE id = ?').get(927);

const lines = article.content.split('\n').slice(0, 40);

console.log('=== First 40 lines of Article 927 ===\n');
lines.forEach((line, i) => {
    const display = line.length > 120 ? line.substring(0, 120) + '...' : line;
    console.log(`${i + 1}: ${display}`);
});

db.close();
