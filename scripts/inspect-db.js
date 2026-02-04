const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

const row = db.prepare('SELECT * FROM anime LIMIT 1').get();
console.log(JSON.stringify(row, null, 2));

const total = db.prepare('SELECT COUNT(*) as count FROM anime').get();
console.log('Total rows:', total.count);
