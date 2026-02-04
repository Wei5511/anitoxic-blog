const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

console.log('📊 Verifying Database Content...\n');

// 1. Count by Year
const years = db.prepare('SELECT year, COUNT(*) as count FROM anime GROUP BY year ORDER BY year DESC').all();
console.log('--- Anime by Year ---');
years.forEach(r => {
    console.log(`${r.year}: ${r.count}`);
});

// 2. Sample Tags (Genres)
const genresSample = db.prepare('SELECT genres FROM anime WHERE year BETWEEN 2010 AND 2022 LIMIT 20').all();
console.log('\n--- Sample Genres (2010-2022) ---');
const allTags = new Set();
genresSample.forEach(r => {
    if (r.genres) {
        r.genres.split(',').forEach(g => allTags.add(g.trim()));
    }
});
console.log([...allTags].join(', '));

// 3. Check for specific mappings
console.log('\n--- Checking specific mappings ---');
const checkMapping = (english, chinese) => {
    const found = db.prepare(`SELECT title, genres FROM anime WHERE genres LIKE ? OR genres LIKE ? LIMIT 1`).get(`%${chinese}%`, `%${english}%`);
    if (found) {
        console.log(`Found entry for tag '${chinese}' (or '${english}'): ${found.title} [${found.genres}]`);
    } else {
        console.log(`❌ No entries found for tag '${chinese}'`);
    }
}

checkMapping('Action', '動作');
checkMapping('Isekai', '異世界');

// 4. Total Count
const total = db.prepare('SELECT COUNT(*) as count FROM anime').get();
console.log(`\nTotal Anime: ${total.count}`);
