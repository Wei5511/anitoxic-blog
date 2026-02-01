const fs = require('fs');
const path = require('path');

const targets = [
    // Sports (Check all candidates to fill 10)
    '強風吹拂', '排球少年', '藍色監獄', '黑子的籃球', '鑽石王牌', '飆速宅男', '足球風雲', '網球王子', '白領羽球部', '蜻蛉高球', '灌籃高手', '棒球大聯盟',
    // Isekai (Check for replacements)
    '無職轉生', 'Re:從零開始', '史萊姆', '美好的世界', '異世界歸來的舅舅', '轉生賢者', '轉生成蜘蛛', '異世界藥局', '迷宮裡的後宮', '轉生貴族',
    'Overlord', '刀劍神域', '盾之勇者',
    // Comedy additional
    '蠟筆小新', '哆啦A夢', '名偵探柯南'
];

const found = {};
targets.forEach(t => found[t] = null);

[1, 2, 3, 4].forEach(n => {
    try {
        const content = fs.readFileSync(path.join(__dirname, `user_urls_${n}.txt`), 'utf8');
        content.split('\n').forEach(line => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                const title = parts[0].trim();
                const url = parts[1].trim();
                if (!url.includes('/details/')) return;

                targets.forEach(t => {
                    if (title.includes(t)) {
                        // Prefer shorter titles (usually main series)
                        if (!found[t] || title.length < found[t].title.length) {
                            found[t] = { title, url };
                        }
                    }
                });
            }
        });
    } catch (e) { }
});

console.log('--- VERIFIED LINKS ---');
targets.forEach(t => {
    if (found[t]) {
        console.log(`${t} => ${found[t].url} (${found[t].title})`);
    } else {
        console.log(`${t} => MISSING`);
    }
});
