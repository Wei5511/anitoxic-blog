const db = require('better-sqlite3')('anime.db');

const queries = [
    '葬送的芙莉蓮',
    '咒術迴戰',
    '我推的孩子',
    '貴族轉生',
    '泛而不精',
    '判處勇者刑',
    '相反的你和我',
    'Fate/strange Fake',
    '安逸領主',
    '燃油車鬥魂'
];

console.log('Searching for titles...');
const stmt = db.prepare('SELECT mal_id, title, title_chinese, image_url, year FROM anime WHERE title_chinese LIKE ? OR title LIKE ? LIMIT 1');

for (const q of queries) {
    const row = stmt.get(`%${q}%`, `%${q}%`);
    if (row) {
        console.log(`[FOUND] ${q} -> ID: ${row.mal_id} (${row.title_chinese || row.title}) Image: ${row.image_url}`);
    } else {
        console.log(`[MISSING] ${q}`);
    }
}
