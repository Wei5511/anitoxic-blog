const fs = require('fs');
const files = ['user_urls_1.txt', 'user_urls_2.txt', 'user_urls_3.txt', 'user_urls_4.txt', 'all_matches.txt'];

const keywords = [
    'Blue Lock', '藍色監獄',
    'Jujutsu', '咒術',
    'Frieren', '芙莉蓮',
    'Oshi no', '我推',
    'Hero Academia', '英雄學院'
];

const results = {};

files.forEach(f => {
    const p = 'scripts/' + f;
    if (fs.existsSync(p)) {
        const lines = fs.readFileSync(p, 'utf8').split('\n');
        lines.forEach(line => {
            const lower = line.toLowerCase();
            keywords.forEach(k => {
                if (lower.includes(k.toLowerCase())) {
                    if (!results[k]) results[k] = [];
                    results[k].push({ file: f, content: line.trim() });
                }
            });
        });
    }
});

console.log(JSON.stringify(results, null, 2));
