const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);
db.prepare('DELETE FROM myvideo_library').run();
console.log('🗑️ Cleared myvideo_library table.');
