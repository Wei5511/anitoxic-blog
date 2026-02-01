const db = require('better-sqlite3')('anime.db');

// 1. Unpin all first (optional, but cleaner to assume these are THE pinned ones)
db.prepare("UPDATE articles SET is_pinned = 0").run();
console.log("Cleared existing pins.");

// 2. Pin specific articles
const titles = [
    '【MyVideo 2026 新番特輯】1月動畫強力推薦總整理（上篇）',
    '【MyVideo 2026 新番特輯】1月動畫強力推薦總整理（下篇）'
];

titles.forEach(t => {
    const row = db.prepare("SELECT id FROM articles WHERE title = ?").get(t);
    if (row) {
        db.prepare("UPDATE articles SET is_pinned = 1 WHERE id = ?").run(row.id);
        console.log(`✅ Pinned Article ${row.id}: ${t}`);
    } else {
        console.log(`❌ Could not find article: ${t}`);
    }
});
