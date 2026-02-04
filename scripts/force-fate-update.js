const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

const stmt = db.prepare("UPDATE anime SET image_url = '/images/anime/fate-strange-fake.png?v=3' WHERE title LIKE '%Fate/strange%'");
const info = stmt.run();
console.log(`Updated Fate image with cache buster v3. Changes: ${info.changes}`);
