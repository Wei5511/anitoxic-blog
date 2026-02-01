const fs = require('fs');
const path = require('path');

const userUrls = [
    'scripts/user_urls_1.txt',
    'scripts/user_urls_2.txt',
    'scripts/user_urls_3.txt',
    'scripts/user_urls_4.txt'
];

const themes = {
    'Sports': ['藍色監獄', '排球少年', '黑子的籃球', '灌籃高手', '青之蘆葦', '鑽石王牌', '飆速宅男'],
    'Isekai': ['Re:從零開始的異世界生活', '無職轉生', '為美好的世界獻上祝福', 'Overlord', '轉生史萊姆', '異世界歸來的舅舅', '陰影強者', '關於我轉生變成史萊姆這檔事'],
    'Healing': ['葬送的芙莉蓮', '搖曳露營', '水星領航員', '飛翔的魔女', '夏目友人帳', '比宇宙更遠的地方'],
    'Suspense': ['夏日重現', '朋友遊戲', '怪物', '心靈判官', '約定的夢幻島', '命運石之門', 'Another'],
    'Comedy': ['SPY×FAMILY', '間諜家家酒', '肌肉魔法使', '銀魂', '齊木楠雄', '輝夜姬', '孤獨搖滾', '鹿乃子', '鹿乃子乃子', '鹿乃子乃子乃子虎視眈眈']
};

console.log('🔍 Searching for Candidates...');
const matches = {};

userUrls.forEach(file => {
    try {
        const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf-8');
        const lines = content.split('\n');

        lines.forEach(line => {
            for (const [theme, keywords] of Object.entries(themes)) {
                if (!matches[theme]) matches[theme] = [];

                for (const keyword of keywords) {
                    if (line.includes(keyword)) {
                        // Avoid duplicates
                        const existing = matches[theme].find(m => m.line === line.trim());
                        if (!existing) {
                            matches[theme].push({ keyword, line: line.trim() });
                        }
                    }
                }
            }
        });
    } catch (e) {
        console.error(`Error reading ${file}:`, e.message);
    }
});

// fs already required at top

const output = {};
for (const [theme, items] of Object.entries(matches)) {
    // console.log(`\n=== ${theme} (${items.length}) ===`);
    // items.slice(0, 5).forEach(m => console.log(m.line));
    output[theme] = items.slice(0, 5).map(m => {
        const parts = m.line.split('\t');
        return {
            title: parts[0].trim(),
            url: parts[1] ? parts[1].trim() : ''
        };
    });
}

fs.writeFileSync(path.join(__dirname, 'candidates.json'), JSON.stringify(output, null, 2), 'utf-8');
console.log('✅ Candidates saved to scripts/candidates.json');
