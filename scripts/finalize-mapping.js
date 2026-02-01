const fs = require('fs');
const path = require('path');

const titles = JSON.parse(fs.readFileSync('tmp_titles.json', 'utf8'));
const filenames = ['user_urls_1.txt', 'user_urls_2.txt', 'user_urls_3.txt', 'user_urls_4.txt', 'all_matches.txt'];

const v8ManualIds = {
    '排球少年!! 第四季': '17393',
    '藍色監獄 VS. 日本代表 U-20': '32386',
    '黑子的籃球': '2361',
    '鑽石王牌': '12695',
    '飆速宅男 第五季': '31206',
    '轉生賢者的異世界生活': '21049',
    '關於我轉生變成史萊姆這檔事 第1季': '17235',
    'Re:從零開始的異世界生活 第1季': '13562',
    '無職轉生~到了異世界就拿出真本事~ (第2季)': '24227',
    '夏目友人帳': '4819',
    '水星領航員': '6511',
    '咒術迴戰 (第1季)': '13241',
    '名湯「異世界溫泉」開拓記': '26203',
    '咒術迴戰 死滅迴游 前篇': '32428',
    '命運石之門': '4665',
    '夏日重現': '17849',
    '藥師少女的獨語': '24292',
    '進擊的巨人 The Final Season': '24584',
    'SPY×FAMILY 間諜家家酒': '17236',
    '比宇宙更遠的地方': '12704',
    '雙人單身露營': '31281'
};

const map = {};

filenames.forEach(f => {
    const p = path.join('scripts', f);
    if (!fs.existsSync(p)) return;
    const lines = fs.readFileSync(p, 'utf8').split('\n');
    lines.forEach(line => {
        const parts = line.split('\t');
        if (parts.length >= 2) {
            const sourceTitle = parts[0].trim();
            const url = parts[1].trim();
            const idMatch = url.match(/\/3\/(\d+)/);
            if (idMatch) {
                const id = idMatch[1];
                // Exact title match
                if (titles.includes(sourceTitle)) {
                    map[sourceTitle] = id;
                }
                // Check if this ID belongs to one of our target titles (manual mapping check)
                for (const [v8Title, targetId] of Object.entries(v8ManualIds)) {
                    if (id === targetId) {
                        map[v8Title] = id;
                    }
                }
            }
        }
    });
});

console.log(JSON.stringify(map, null, 2));
