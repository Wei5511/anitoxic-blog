const Database = require('better-sqlite3');
const db = new Database('anime.db');

const keywords = [
    '咒術', '芙莉蓮', '我推', 'Fate', '炎炎', '不滅', '輝夜', 'MF Ghost', '魔都', '管弦', // Upper
    '判處', '龍蛋' // Lower missing ones
];

keywords.forEach(k => {
    // Get ALL matches with non-null images
    const rows = db.prepare("SELECT title, image_url FROM myvideo_library WHERE title LIKE ? AND image_url IS NOT NULL").all('%' + k + '%');
    if (rows.length > 0) {
        // Prefer the one that matches best? Or just the first one?
        // Let's just pick the last one (often newer?) or print them.
        console.log(`[${k}]: Found ${rows.length} images.`);
        console.log(`   Best: ${rows[0].title} -> ${rows[0].image_url}`);
    } else {
        console.log(`[${k}]: NO images found.`);
    }
});
