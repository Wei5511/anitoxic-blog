
const fs = require('fs');
const path = require('path');

const KEYWORDS = [
    "咒術", "芙莉蓮", "我推", "地獄樂", "炎炎",
    "英雄", "黃金神威", "相反的你和我", "Fate", "單人房", "怪獸"
];

let found = [];
let allLines = [];

for (let i = 1; i <= 4; i++) {
    const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        allLines = allLines.concat(content.split('\n'));
    }
}

for (const line of allLines) {
    if (!line.includes('http')) continue;
    if (KEYWORDS.some(k => line.includes(k))) {
        found.push(line.trim());
    }
}

const outputPath = path.join(process.cwd(), 'scripts', 'matches.json');
fs.writeFileSync(outputPath, JSON.stringify(found, null, 2), 'utf8');
console.log(`Matches written to ${outputPath}`);
