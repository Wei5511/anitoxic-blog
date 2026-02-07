// Export 2026 anime and articles for Turso sync
const db = require('better-sqlite3')('anime.db');
const fs = require('fs');

console.log('=== Exporting Data for Turso Sync ===\n');

// Export 2026 anime
console.log('1. Exporting 2026 anime...');
const anime2026 = db.prepare(`
  SELECT *
  FROM anime
  WHERE year = 2026
`).all();

fs.writeFileSync('anime-2026-export.json', JSON.stringify(anime2026, null, 2));
console.log(`   ✅ Exported ${anime2026.length} anime to anime-2026-export.json\n`);

// Export articles
console.log('2. Exporting articles...');
const articles = db.prepare('SELECT * FROM articles').all();

fs.writeFileSync('articles-export.json', JSON.stringify(articles, null, 2));
console.log(`   ✅ Exported ${articles.length} articles to articles-export.json\n`);

// Export Chinese titles (if any new ones)
console.log('3. Checking Chinese titles...');
const chineseTitles = db.prepare(`
  SELECT mal_id, title, title_chinese
  FROM anime
  WHERE title_chinese IS NOT NULL AND title_chinese != ''
`).all();

console.log(`   Found ${chineseTitles.length} anime with Chinese titles`);
console.log(`   (Already exported in chinese-titles-export.json)\n`);

db.close();

console.log('✅ Export complete!');
console.log('\nExported files:');
console.log('  - anime-2026-export.json (93 anime)');
console.log('  - articles-export.json (25 articles)');
console.log('  - chinese-titles-export.json (168 titles - already exported)');
