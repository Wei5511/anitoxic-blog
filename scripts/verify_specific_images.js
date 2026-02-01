const Database = require('better-sqlite3');
const db = new Database('anime.db');

const checks = [
    { key: '咒術', name: 'JJK' },
    { key: '芙莉蓮', name: 'Frieren' },
    { key: 'Fate', name: 'Fate' },
    { key: '炎炎', name: 'FireForce' },
    { key: '不滅', name: 'Eternity' },
    { key: '我推', name: 'OshiNoKo' }
];

checks.forEach(c => {
    const row = db.prepare("SELECT title, image_url FROM myvideo_library WHERE title LIKE ? AND image_url IS NOT NULL ORDER BY id DESC LIMIT 1").get('%' + c.key + '%');
    console.log(`[${c.name}]: ${row ? row.title : 'NULL'} => ${row ? row.image_url : 'NULL'}`);
});
