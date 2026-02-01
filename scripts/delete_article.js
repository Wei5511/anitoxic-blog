const db = require('better-sqlite3')('anime.db');

const rows = db.prepare("SELECT id, title FROM articles WHERE title LIKE '%2026%'").all();

console.log('Found ' + rows.length + ' candidate articles:');
rows.forEach(r => console.log(`[${r.id}] ${r.title}`));

// Target to delete: "【2026新番】1月動畫強力推薦總整理"
// Note: The new ones have "【MyVideo ...】" and "（上篇）/（下篇）"

const target = rows.find(r =>
    r.title.includes('2026新番') &&
    r.title.includes('1月動畫強力推薦總整理') &&
    !r.title.includes('上篇') &&
    !r.title.includes('下篇')
);

if (target) {
    db.prepare("DELETE FROM articles WHERE id = ?").run(target.id);
    console.log(`\n✅ Deleted Article ID ${target.id}: "${target.title}"`);
} else {
    console.log('\n⚠️ Target article not found (or already deleted).');
}
