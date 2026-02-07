const db = require('better-sqlite3')('anime.db');
const fs = require('fs');
const path = require('path');

function restore() {
    const exportPath = path.join(__dirname, '..', 'chinese-titles-export.json');
    if (!fs.existsSync(exportPath)) {
        console.error('Export file not found!');
        return;
    }

    const data = JSON.parse(fs.readFileSync(exportPath, 'utf8'));
    console.log(`Loaded ${data.length} titles from backup.`);

    const stmt = db.prepare(`
        UPDATE anime 
        SET title_chinese = ? 
        WHERE mal_id = ? 
        AND (title_chinese IS NULL OR title_chinese = '')
    `);

    let updated = 0;
    db.transaction(() => {
        for (const item of data) {
            if (item.title_chinese && item.mal_id) {
                const res = stmt.run(item.title_chinese, item.mal_id);
                updated += res.changes;
            }
        }
    })();

    console.log(`✅ Restored ${updated} Chinese titles.`);
}

restore();
