
const fs = require('fs');
const path = require('path');

const keywords = ["芙莉蓮", "我推", "地獄樂", "炎炎", "黃金神威"];

for (let i = 1; i <= 4; i++) {
    const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            if (keywords.some(k => line.includes(k))) {
                console.log(`File ${i}, Line ${idx + 1}: ${line.trim()}`);
            }
        });
    }
}
