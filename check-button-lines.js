const db = require('better-sqlite3')('anime.db');

const article = db.prepare('SELECT content FROM articles WHERE id = 927').get();

const lines = article.content.split('\n');

console.log('=== Checking Button Lines Exactly ===\n');

const buttonLines = [];
lines.forEach((line, i) => {
    if (line.includes('btn-orange-small')) {
        buttonLines.push({ lineNum: i + 1, line: line });
    }
});

console.log(`Found ${buttonLines.length} lines with btn-orange-small\n`);

buttonLines.forEach(b => {
    console.log(`Line ${b.lineNum}:`);
    console.log(`  Length: ${b.line.length}`);
    console.log(`  Trimmed length: ${b.line.trim().length}`);
    console.log(`  Starts with '<a': ${b.line.startsWith('<a')}`);
    console.log(`  Trimmed starts with '<a': ${b.line.trim().startsWith('<a')}`);
    console.log(`  Ends with '</a>': ${b.line.endsWith('</a>')}`);
    console.log(`  Trimmed ends with '</a>': ${b.line.trim().endsWith('</a>')}`);
    console.log(`  Raw: "${b.line}"`);
    console.log(`  Hex first 5 chars:`, Buffer.from(b.line.substring(0, 5)).toString('hex'));
    console.log('');
});

// Test regex
const regex = /^<a href="([^"]+)" class="btn-orange-small" target="_blank">(.+)<\/a>$/;
console.log('Testing regex match:');
buttonLines.forEach(b => {
    const match = b.line.match(regex);
    const trimmedMatch = b.line.trim().match(regex);
    console.log(`  Line ${b.lineNum}: direct=${!!match}, trimmed=${!!trimmedMatch}`);
});

db.close();
