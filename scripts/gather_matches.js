
const fs = require('fs');
const path = require('path');

const keywords = ["芙莉蓮", "我推", "地獄樂", "炎炎", "黃金神威", "相反", "Fate", "單人房", "怪獸", "英雄"];
let results = [];

for (let i = 1; i <= 4; i++) {
    const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split('\n');
        lines.forEach(line => {
            if (keywords.some(k => line.includes(k))) {
                results.push(line.trim());
            }
        });
    }
}

fs.writeFileSync(path.join(process.cwd(), 'scripts', 'all_matches.txt'), results.join('\n'));
console.log('Results written to scripts/all_matches.txt');
