const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Select all articles in the target category '動畫介紹'
const rows = db.prepare("SELECT id, title, content FROM articles WHERE category = '動畫介紹'").all();

console.log(`Checking ${rows.length} articles in '動畫介紹'...`);

let count = 0;
rows.forEach(row => {
    let content = row.content;
    const originalContent = content;

    // Pattern to remove: <a href="..." class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>
    // We match broadly to catch variations in spacing or attributes
    const regex = /<a\s+href="[^"]*"\s+class="btn-orange-small"\s+target="_blank">.*?<\/a>/g;

    content = content.replace(regex, '');

    // Cleanup extra newlines that might be left behind (e.g. \n\n\n)
    content = content.replace(/\n{3,}/g, '\n\n');

    if (content !== originalContent) {
        console.log(`Removing duplicate button from Article ${row.id}: ${row.title}`);
        db.prepare('UPDATE articles SET content = ? WHERE id = ?').run(content, row.id);
        count++;
    }
});

console.log(`Total buttons removed: ${count}`);
