const db = require('better-sqlite3')('anime.db');
const tables = db.prepare("SELECT name FROM sqlite_master WHERE type='table'").all();
console.log('Tables:', tables);

tables.forEach(t => {
    const info = db.prepare(`PRAGMA table_info(${t.name})`).all();
    console.log(`\nSchema for ${t.name}:`);
    console.log(info);
});
