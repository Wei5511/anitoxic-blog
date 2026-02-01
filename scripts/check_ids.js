
const fs = require('fs');
const path = require('path');

const ids = ["32450", "32428", "32346", "32380", "31673"];

for (let i = 1; i <= 4; i++) {
    const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
    if (fs.existsSync(p)) {
        const content = fs.readFileSync(p, 'utf8');
        const lines = content.split('\n');
        lines.forEach((line, idx) => {
            if (ids.some(id => line.includes(id))) {
                console.log(`File ${i}, Line ${idx + 1}: ${line.trim()}`);
            }
        });
    }
}
