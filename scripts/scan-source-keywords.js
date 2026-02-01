const fs = require('fs');
const path = require('path');

const fullData = [];

function loadFile(n) {
    const filePath = path.join(__dirname, `user_urls_${n}.txt`);
    const buffer = fs.readFileSync(filePath);
    let text = (buffer[0] === 0xff && buffer[1] === 0xfe) ? buffer.toString('utf16le') : buffer.toString('utf8');

    text.split(/\r?\n/).forEach(line => {
        const parts = line.split(/\s+/);
        const url = parts.find(p => p.includes('myvideo.net.tw/details/3/'));
        if (url) {
            const id = url.split('/').pop().trim();
            const title = line.replace(url, '').trim();
            if (id && title) {
                fullData.push({ id, title, url, file: n });
            }
        }
    });
}
[1, 2, 3, 4].forEach(loadFile);

const targetKeywords = [
    '進擊的巨人', '命運石之門', '夏日重現', '藥師少女的獨語', '咒術迴戰', 'SPY', '排球少年', '藍色監獄', '黑子的籃球', '鑽石王牌', '孤獨搖滾', '銀魂', '齊木楠雄'
];

console.log('--- SCANNING SOURCE FOR KEYWORDS ---');
targetKeywords.forEach(kw => {
    console.log(`\nResults for "${kw}":`);
    const matches = fullData.filter(d => d.title.includes(kw));
    matches.sort((a, b) => a.title.length - b.title.length); // Base series usually shorter
    matches.slice(0, 5).forEach(m => {
        console.log(`  [File ${m.file}] ${m.title} -> ID: ${m.id}`);
    });
    if (matches.length === 0) console.log('  ❌ NO MATCH FOUND');
});
