const fs = require('fs');
const path = require('path');

const targets = [
    // Sports
    '排球少年', '強風吹拂', '藍色監獄', '黑子的籃球', '鑽石王牌', '飆速宅男', '足球風雲', '網球王子', '白領羽球部', '蜻蛉高球',
    '灌籃高手', '棒球大聯盟',
    // Isekai
    '無職轉生', 'Re:從零開始', '史萊姆', '美好的世界', '賢者', '藥局', '迷宮裡的後宮', '轉生貴族',
    'Overlord', '刀劍神域', '盾之勇者', '陰影強者',
    // Healing
    '葬送的芙莉蓮', '夏目友人帳', '水星領航員', '飛翔的魔女', '間諜家家酒', '比宇宙更遠的地方', '房間露營', '雙人單身露營', '悠閒農家', '異世界溫泉',
    '搖曳露營', '蟲師', '國王排名',
    // Suspense
    '進擊的巨人', '命運石之門', '夏日重現', '藥師少女', '咒術迴戰', '朋友遊戲', '怪物事變', '風都偵探', '偵探已經', '自殺突擊隊',
    '鏈鋸人', '鬼滅之刃', '約定的夢幻島', '死亡筆記本',
    // Comedy
    '孤獨搖滾', '輝夜姬', '銀魂', '鹿乃子', '肌肉魔法使', '齊木楠雄', '月刊少女', '遊戲3人娘', '碧藍之海',
    '派對咖孔明', '吸血鬼馬上死', '烏龍派出所', '我們這一家'
];

const found = {};
targets.forEach(t => found[t] = []);

[1, 2, 3, 4].forEach(n => {
    try {
        const content = fs.readFileSync(path.join(__dirname, `user_urls_${n}.txt`), 'utf8');
        content.split('\n').forEach(line => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                const title = parts[0].trim();
                const url = parts[1].trim();

                // Strict check: Must be /details/, not /search/
                if (!url.includes('/details/')) return;

                targets.forEach(t => {
                    if (title.includes(t)) {
                        found[t].push({ title, url });
                    }
                });
            }
        });
    } catch (e) {
        // ignore missing file
    }
});

console.log('--- FOUND LINKS ---');
targets.forEach(t => {
    const matches = found[t];
    if (matches.length > 0) {
        // Deduplicate by URL
        const unique = [];
        const seen = new Set();
        matches.forEach(m => {
            if (!seen.has(m.url)) {
                seen.add(m.url);
                unique.push(m);
            }
        });

        // Pick best: Prefer exact match, or shortest title (usually Season 1)
        unique.sort((a, b) => a.title.length - b.title.length);

        console.log(`[${t}] Found ${unique.length}:`);
        console.log(`  BEST: ${unique[0].title} => ${unique[0].url}`);
        // unique.forEach(m => console.log(`  - ${m.title} => ${m.url}`));
    } else {
        console.log(`[${t}] NOT FOUND`);
    }
});
