const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Select all articles in the target category
const rows = db.prepare("SELECT id, title, content FROM articles WHERE category = '動畫介紹'").all();

console.log(`Checking ${rows.length} articles in '動畫介紹'...`);

let count = 0;
rows.forEach(row => {
    let content = row.content;
    const originalContent = content;

    // 1. Remove the "Viewing Information" block (Header + Text)
    // Matches "## 觀看資訊" followed by "本作品..." and "若您...", roughly.
    // We use a broader match to catch the section at the end of the file.
    // Pattern: ## 觀看資訊 [anything until end OR next section]
    // Since this is usually at the end, we can try matching specifically.

    const regexBlock = /## 觀看資訊\s*本作品目前已在 MyVideo 上架[\s\S]*?(?=(##|$))/g;
    content = content.replace(regexBlock, '');

    // 2. Remove the parenthesis line specifically (it might be separate)
    content = content.replace(/\(本段落依據發布規範補充相關資訊以確保內容完整性\)\s*/g, '');

    // 3. Clean up trailing "---" if the removal left one dangling at the end
    content = content.replace(/\n---\s*$/g, '');
    content = content.replace(/\n\s*$/g, '\n'); // Trim trailing whitespace

    if (content !== originalContent) {
        console.log(`Updating Article ${row.id}: ${row.title}`);
        db.prepare('UPDATE articles SET content = ? WHERE id = ?').run(content, row.id);
        count++;
    }
});

console.log(`Total updated: ${count}`);
