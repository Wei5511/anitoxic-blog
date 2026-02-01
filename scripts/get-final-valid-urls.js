const fs = require('fs');
const path = require('path');

const categories = {
    'Sports': ['強風吹拂', '排球少年', '藍色監獄', '黑子的籃球', '鑽石王牌', '飆速宅男', '足球風雲', '網球王子', '白領羽球部', '蜻蛉高球', '灌籃高手', '棒球大聯盟', 'Free!', '藍色時期', '青之蘆葦'],
    'Isekai': ['無職轉生', '從零開始', '史萊姆', '美好的世界', '異世界歸來', '轉生賢者', '轉生成蜘蛛', '異世界藥局', '迷宮裡的後宮', '轉生貴族', 'Overlord', '刀劍神域', '陰影強者', '關於我轉生變成史萊姆這檔事', 'Re:從零開始的異世界生活', '盾之勇者'],
    'Healing': ['葬送的芙莉蓮', '夏目友人帳', '水星領航員', '飛翔的魔女', '間諜家家酒', '比宇宙更遠的地方', '房間露營', '雙人單身露營', '悠閒農家', '異世界溫泉', '搖曳露營', '蟲師', '國王排名', '只有我不存在的城市'],
    'Suspense': ['進擊的巨人', '命運石之門', '夏日重現', '藥師少女', '咒術迴戰', '朋友遊戲', '怪物事變', '風都偵探', '偵探已經', '自殺突擊隊', '鏈鋸人', '鬼滅之刃', '約定的夢幻島', '死亡筆記本', '黑暗集會'],
    'Comedy': ['孤獨搖滾', '輝夜姬', '銀魂', '鹿乃子', '肌肉魔法使', '齊木楠雄', '月刊少女', '遊戲3人娘', '碧藍之海', '派對咖孔明', '蠟筆小新', '哆啦A夢', '名偵探柯南', '烏龍派出所', '我們這一家', '吸血鬼馬上死', '吸血鬼', '在下坂本']
};

const found = {};
Object.keys(categories).forEach(c => {
    categories[c].forEach(t => found[t] = null);
});

[1, 2, 3, 4].forEach(n => {
    try {
        const content = fs.readFileSync(path.join(__dirname, `user_urls_${n}.txt`), 'utf8');
        content.split('\n').forEach(line => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                const title = parts[0].trim();
                const url = parts[1].trim();
                if (!url.includes('/details/')) return;

                Object.keys(categories).forEach(cat => {
                    categories[cat].forEach(t => {
                        if (title.includes(t)) {
                            // Only update if not found, or if new title is shorter (better match)
                            if (!found[t] || title.length < found[t].title.length) {
                                found[t] = { title, url };
                            }
                        }
                    });
                });
            }
        });
    } catch (e) { }
});

console.log('--- RESULTS ---');
Object.keys(categories).forEach(cat => {
    console.log(`\n### ${cat}`);
    let count = 0;
    categories[cat].forEach(t => {
        if (found[t]) {
            console.log(`FOUND: ${t} => ${found[t].url} (${found[t].title})`);
            count++;
        }
    });
    console.log(`Total Found: ${count}`);
});
