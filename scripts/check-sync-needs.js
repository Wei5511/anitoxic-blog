// Check what needs to be synced to Turso
const db = require('better-sqlite3')('anime.db');

console.log('=== Database Sync Check ===\n');

// Check January 2026 anime
console.log('1. January 2026 Anime:');
const jan2026 = db.prepare(`
  SELECT COUNT(*) as count, 
         GROUP_CONCAT(DISTINCT season) as seasons
  FROM anime 
  WHERE year = 2026
`).get();
console.log(`   Total 2026 anime: ${jan2026.count}`);
console.log(`   Seasons: ${jan2026.seasons || 'None'}\n`);

// Sample 2026 anime
const sample2026 = db.prepare(`
  SELECT mal_id, title, season, year
  FROM anime
  WHERE year = 2026
  LIMIT 5
`).all();
console.log('   Sample:');
sample2026.forEach(a => {
    console.log(`     ${a.mal_id}: ${a.title} (${a.season} ${a.year})`);
});

// Check articles
console.log('\n2. Articles:');
const articles = db.prepare('SELECT COUNT(*) as count FROM articles').get();
console.log(`   Total articles: ${articles.count}\n`);

// Sample articles
const sampleArticles = db.prepare(`
  SELECT id, title, created_at
  FROM articles
  ORDER BY created_at DESC
  LIMIT 5
`).all();
console.log('   Recent articles:');
sampleArticles.forEach(a => {
    console.log(`     ${a.id}: ${a.title.substring(0, 50)}...`);
});

// Check Chinese titles
console.log('\n3. Chinese Titles:');
const chinese = db.prepare(`
  SELECT COUNT(*) as count
  FROM anime
  WHERE title_chinese IS NOT NULL AND title_chinese != ''
`).get();
console.log(`   Anime with Chinese: ${chinese.count}\n`);

db.close();

console.log('✅ Local database check complete');
console.log('\nNext: Sync this data to Turso production database');
