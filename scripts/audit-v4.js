const fs = require('fs');
const path = require('path');

const targets = [
    // Sports
    '強風吹拂', '排球少年', '藍色監獄', '黑子的籃球', '鑽石王牌', '飆速宅男', '足球風雲', '網球王子', '白領羽球部', '蜻蛉高球',
    // Isekai
    '無職轉生', '從零開始', '史萊姆', '美好的世界', '異世界溫泉', '轉生賢者', '轉生成蜘蛛', '異世界藥局', '迷宮裡的後宮', '轉生貴族',
    // Healing
    '葬送的芙莉蓮', '夏目友人帳', '水星領航員', '我們這一家', '間諜家家酒', '比宇宙更遠', '房間露營', '單身露營', '悠閒農家', '搖曳露營',
    // Suspense
    '進擊的巨人', '命運石之門', '夏日重現', '藥師少女', '咒術迴戰', '朋友遊戲', '怪物事變', '風都偵探', '偵探已經', '自殺突擊隊',
    // Comedy
    '孤獨搖滾', '輝夜姬', '銀魂', '鹿乃子', '蠟筆小新', '齊木楠雄', '月刊少女', '派對咖孔明', '烏龍派出所', '間諜家家酒'
];

const results = {};
targets.forEach(t => results[t] = []);

[1, 2, 3, 4].forEach(n => {
    try {
        const filePath = path.join(__dirname, `user_urls_${n}.txt`);
        let content = fs.readFileSync(filePath, 'utf8');

        // Handle potential encoding issues / weird characters
        content = content.replace(/\r/g, '');
        const lines = content.split('\n');

        lines.forEach(line => {
            // Some lines use spaces or tabs
            const parts = line.split(/\s+/);
            if (parts.length >= 2) {
                const url = parts.find(p => p.startsWith('http'));
                if (!url || !url.includes('/details/')) return;

                const title = line.replace(url, '').trim();

                targets.forEach(t => {
                    if (title.includes(t)) {
                        results[t].push({ title, url });
                    }
                });
            }
        });
    } catch (e) {
        console.error(e);
    }
});

console.log('--- AUDIT RESULTS ---');
const finalSelection = {};
targets.forEach(t => {
    const matches = results[t];
    if (matches.length > 0) {
        // Sort by title length to get the most "base" series if many seasons exist
        matches.sort((a, b) => a.title.length - b.title.length);
        const best = matches[0];
        finalSelection[t] = best.url;
        console.log(`✅ [${t}] -> ${best.title} (${best.url})`);
    } else {
        console.log(`❌ [${t}] NOT FOUND`);
    }
});

// Specifically check for Article 842 (Healing) duplicates
console.log('\n--- Article 842 (Healing) Deep Dive ---');
const healingItems = ['葬送的芙莉蓮', '夏目友人帳', '水星領航員', '我們這一家', '間諜家家酒', '比宇宙更遠', '房間露營', '單身露營', '悠閒農家', '搖曳露營'];
healingItems.forEach(item => {
    console.log(`${item}: ${finalSelection[item] || 'MISSING'}`);
});
