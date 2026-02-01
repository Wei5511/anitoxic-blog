const db = require('better-sqlite3')('anime.db');

function addColumn(colName, colType) {
    try {
        db.prepare(`ALTER TABLE anime ADD COLUMN ${colName} ${colType}`).run();
        console.log(`Added column: ${colName}`);
    } catch (e) {
        if (e.message.includes('duplicate column')) {
            console.log(`Column ${colName} already exists.`);
        } else {
            console.error(`Error adding ${colName}:`, e.message);
        }
    }
}

console.log('Migrating database...');
addColumn('staff', 'TEXT');
addColumn('cast', 'TEXT');
addColumn('streaming', 'TEXT');
addColumn('youtube_id', 'TEXT');
console.log('Migration complete.');
