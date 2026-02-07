const db = require('better-sqlite3')('anime.db');

console.log('Localizing titles in anime.db...');

// Update title to be title_chinese where available
const stmt = db.prepare(`
    UPDATE anime 
    SET title = title_chinese 
    WHERE title_chinese IS NOT NULL 
      AND title_chinese != ''
      AND title != title_chinese
`);

const info = stmt.run();

console.log(`Updated ${info.changes} rows to use Chinese titles.`);

// Verify a few
const sample = db.prepare(`
    SELECT title, title_chinese, year 
    FROM anime 
    WHERE title_chinese IS NOT NULL 
    LIMIT 5
`).all();

console.log('Sample after update:');
console.log(JSON.stringify(sample, null, 2));
