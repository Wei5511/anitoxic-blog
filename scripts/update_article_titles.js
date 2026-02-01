const db = require('better-sqlite3')('anime.db');

const updates = [
    {
        old: '【MyVideo 2026 新番特輯】1月動畫強力推薦總整理（上篇）',
        new: '【2026 動漫新番特輯】1月動畫強力推薦總整理（上篇）'
    },
    {
        old: '【MyVideo 2026 新番特輯】1月動畫強力推薦總整理（下篇）',
        new: '【2026 動漫新番特輯】1月動畫強力推薦總整理（下篇）'
    }
];

updates.forEach(u => {
    const info = db.prepare('UPDATE articles SET title = ? WHERE title = ?').run(u.new, u.old);
    console.log(`Updated '${u.old}' -> '${u.new}': ${info.changes} changes`);
});
