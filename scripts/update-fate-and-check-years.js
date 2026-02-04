const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

const newImage = '/images/anime/fate-strange-fake.png'; // Local path relative to public

const info = db.prepare('UPDATE anime SET image_url = ? WHERE title LIKE ?').run(newImage, '%Fate/strange Fake%');
console.log(`Updated Fate/strange Fake image. Changes: ${info.changes}`);

// Verify seasons query too
const seasons = db.prepare(`
    SELECT DISTINCT year, season 
    FROM anime 
    WHERE year IS NOT NULL AND season IS NOT NULL
    ORDER BY year DESC
`).all();
console.log('Available Years in DB:', [...new Set(seasons.map(s => s.year))].join(', '));
