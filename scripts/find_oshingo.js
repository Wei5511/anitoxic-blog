const Database = require('better-sqlite3');
const db = new Database('anime.db');
const entries = db.prepare('SELECT title, image_url FROM myvideo_library WHERE title LIKE ?').all('%我推的孩子%');
console.log(JSON.stringify(entries, null, 2));
