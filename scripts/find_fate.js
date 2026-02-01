const db = require('better-sqlite3')('anime.db');
const rows = db.prepare("SELECT title, image_url FROM myvideo_library WHERE title LIKE '%Fate%' AND image_url IS NOT NULL").all();
console.log(rows);
