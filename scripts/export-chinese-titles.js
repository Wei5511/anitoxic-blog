// Export all Chinese titles from local database to sync with Turso
const db = require('better-sqlite3')('anime.db');

console.log('=== Exporting Chinese Titles for Turso Sync ===\n');

// Get all anime with Chinese titles
const animeWithChinese = db.prepare(`
  SELECT mal_id, title, title_chinese
  FROM anime
  WHERE title_chinese IS NOT NULL AND title_chinese != ''
  ORDER BY mal_id
`).all();

console.log(`Found ${animeWithChinese.length} anime with Chinese titles\n`);

// Save to JSON for import
const fs = require('fs');
fs.writeFileSync('chinese-titles-export.json', JSON.stringify(animeWithChinese, null, 2));

console.log('✅ Exported to chinese-titles-export.json');
console.log('\nSample data:');
animeWithChinese.slice(0, 5).forEach(a => {
    console.log(`  ${a.mal_id}: ${a.title} → ${a.title_chinese}`);
});

db.close();
