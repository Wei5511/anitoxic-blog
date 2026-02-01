const db = require('better-sqlite3')('anime.db');

const rows = db.prepare("SELECT id, title FROM articles WHERE title LIKE '%2026新番】1月動畫強力推薦總整理%'").all();

const targets = rows.filter(r =>
    !r.title.includes('上篇') &&
    !r.title.includes('下篇')
);

if (targets.length > 0) {
    const ids = targets.map(t => t.id);
    const stmt = db.prepare(`DELETE FROM articles WHERE id IN (${ids.join(',')})`);
    stmt.run();
    console.log(`✅ Deleted ${targets.length} articles: IDs ${ids.join(', ')}`);
} else {
    console.log('✅ No redundant articles found.');
}
