const Database = require('better-sqlite3');
const path = require('path');

const db = new Database('anime.db');

// 1. Update Fate Image
const newImage = 'https://p2.bahamut.com.tw/B/ACG/c/43/0000133843.JPG';
const info = db.prepare("UPDATE anime SET image_url = ? WHERE title LIKE '%Fate/strange%'").run(newImage);
console.log(`Updated Fate image. Changes: ${info.changes}`);

// 2. Inspect Content
console.log('\n--- Database Content Sample ---');
const rows = db.prepare("SELECT mal_id, title, title_japanese, genres, synopsis FROM anime ORDER BY year DESC, season DESC LIMIT 5").all();
rows.forEach(r => {
    console.log(`[${r.mal_id}] ${r.title}`);
    console.log(`Genres: ${r.genres}`);
    console.log(`Synopsis (first 100 chars): ${r.synopsis ? r.synopsis.substring(0, 100) : 'N/A'}...`);
    console.log('---');
});
