const fs = require('fs');
const path = require('path');

const files = ['temp_links_1.txt', 'temp_links_2.txt', 'temp_links_3.txt'];
const outFile = path.join(__dirname, 'myvideo_links_raw.txt');

let content = '';
for (const f of files) {
    const p = path.join(__dirname, '..', f); // Look in root dir
    if (fs.existsSync(p)) {
        content += fs.readFileSync(p, 'utf-8');
    } else {
        console.warn(`File not found: ${p}`);
    }
}

fs.writeFileSync(outFile, content, 'utf-8');
console.log(`Merged ${files.length} files into ${outFile}`);
