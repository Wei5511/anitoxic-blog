
const fs = require('fs');
const path = require('path');

let highIds = [];

for (let i = 1; i <= 4; i++) {
    const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split('\n');
        lines.forEach(line => {
            const match = line.match(/\/details\/3\/(\d+)/);
            if (match && parseInt(match[1]) >= 32300) {
                highIds.push(line.trim());
            }
        });
    }
}

console.log(JSON.stringify(highIds, null, 2));
