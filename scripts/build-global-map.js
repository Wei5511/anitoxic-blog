const fs = require('fs');
const path = require('path');

const globalData = [];

function loadFile(n) {
    const filePath = path.join(__dirname, `user_urls_${n}.txt`);
    const buffer = fs.readFileSync(filePath);
    let text = (buffer[0] === 0xff && buffer[1] === 0xfe) ? buffer.toString('utf16le') : buffer.toString('utf8');

    text.split(/\r?\n/).forEach(line => {
        // Find the URL anywhere in the line
        const urlMatch = line.match(/https:\/\/www\.myvideo\.net\.tw\/details\/3\/(\d+)/);
        if (urlMatch) {
            const id = urlMatch[1];
            const url = urlMatch[0];
            const title = line.replace(url, '').trim();
            if (id && title) {
                globalData.push({ id, title, url, file: n });
            }
        }
    });
}
[1, 2, 3, 4].forEach(loadFile);

const targetKeywords = [
    // Must find these for Article 842 and others
    '我們這一家', '宇宙', '房間露營', '江戶前精靈', '悠閒農家', '明日同學', '單身露營', '夏目', '間諜', '水星', '排球', '藍色監獄', '巨人', '命運石', '重現', '藥師', '咒術', '朋友遊戲', '孤獨搖滾', '銀魂', '鹿乃子', '蠟筆小新', '烏龍派出所', '工作細胞', '鑽石王牌', '飆速宅男', '足球風雲', '網球王子', '白領羽球部', '蜻蛉高球', '無職轉生', '從零開始', '史萊姆', '美好的世界', '異世界', '轉生'
];

console.log('--- GLOBAL SOURCE MAP SCAN ---');
const found = {};
targetKeywords.forEach(kw => {
    const matches = globalData.filter(d => d.title.includes(kw));
    matches.sort((a, b) => a.title.length - b.title.length);
    found[kw] = matches;
});

// JSON output for easy copy-paste as a source of truth
console.log(JSON.stringify(found, null, 2));
