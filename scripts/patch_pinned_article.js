const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🔧 Patching Pinned Article Links...');

const slug = '2026-winter-anime-guide';
const row = db.prepare('SELECT content FROM articles WHERE slug=?').get(slug);

if (!row) {
    console.error('Pinned article not found!');
    process.exit(1);
}

let content = row.content;
const targetTitle = '《燃油車鬥魂》第三季';
const targetUrl = 'https://www.myvideo.net.tw/details/4/28879';

// Find the block containing this title
// The HTML structure is likely: <h2 ...>TITLE</h2> ... <a href="...">
// We can use a regex that matches the title and captures the following link.
const regex = new RegExp(`(${targetTitle}[\\s\\S]*?href=")([^"]+)(")`);
const match = content.match(regex);

if (match) {
    console.log(`Found match for ${targetTitle}. Current Link: ${match[2]}`);
    if (match[2] !== targetUrl) {
        // Replace only the first occurrence after the title
        // We can recreate the string carefully
        const newContent = content.replace(regex, `$1${targetUrl}$3`);
        db.prepare('UPDATE articles SET content = ? WHERE slug = ?').run(newContent, slug);
        console.log('✅ Link Updated.');
    } else {
        console.log('Link already correct.');
    }
} else {
    console.warn(`⚠️ Title [${targetTitle}] not found in content (Regex mismatch). Check exact string.`);
    // Debug: print headers
    const headers = content.match(/<h2.*?>(.*?)<\/h2>/g);
    console.log('Available Headers:', headers);
}
