const Database = require('better-sqlite3');
const db = new Database('anime.db');

const upper = [
    '咒術迴戰 死滅迴游', // Shortened for better matching
    '葬送的芙莉蓮',
    '我推的孩子',
    'Fate/strange Fake',
    '炎炎消防隊',
    '給不滅的你',
    '輝夜姬想讓人告白',
    'MF Ghost',
    '魔都精兵',
    '藍色管弦樂'
];

const lower = [
    '異國日記',
    '東島丹三郎',
    '相反的你和我',
    '判處勇者刑',
    '魔術師庫諾',
    '轉生之後的我變成了龍蛋',
    '從前從前有隻貓',
    'GNOSIA',
    '靠死亡遊戲混飯吃',
    '現在的是哪一個多聞'
];

function check(list, name) {
    console.log(`\n--- Checking ${name} ---`);
    list.forEach(t => {
        const row = db.prepare('SELECT title, image_url, url FROM myvideo_library WHERE title LIKE ?').get('%' + t + '%');
        if (row) {
            console.log(`[OK] ${t} -> ${row.title} (Img: ${row.image_url ? 'Yes' : 'NULL'})`);
        } else {
            console.log(`[MISSING] ${t}`);
        }
    });
}

check(upper, 'Upper Part');
check(lower, 'Lower Part');
