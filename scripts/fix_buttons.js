const db = require('better-sqlite3')('anime.db');

const ids = [906, 907];

ids.forEach(id => {
    const row = db.prepare("SELECT content FROM articles WHERE id = ?").get(id);
    if (!row) {
        console.log(`Article ${id} not found.`);
        return;
    }

    let content = row.content;

    // Pattern: <p align="center">👉 <a href="(url)" target="_blank">立即觀看 (MyVideo)</a></p>
    // Goal: <a href="(url)" class="btn-orange-small" target="_blank">立即觀看 (MyVideo)</a>
    // We can use regex to capture the URL.

    const regex = /<p align="center">.*?<a href="(.*?)" target="_blank">.*?<\/a><\/p>/g;

    // Check if we have matches
    const matches = content.match(regex);
    if (matches) {
        console.log(`Found ${matches.length} matches in Article ${id}`);

        const newContent = content.replace(regex, (match, url) => {
            return `<a href="${url}" class="btn-orange-small" target="_blank">立即觀看 (MyVideo)</a>`;
        });

        db.prepare("UPDATE articles SET content = ? WHERE id = ?").run(newContent, id);
        console.log(`✅ Updated Article ${id} buttons.`);
    } else {
        console.log(`⚠️ No matches found in Article ${id}. Content might differ.`);
        // Inspect a snippet?
        console.log('Snippet:', content.substring(content.indexOf('立即觀看') - 50, content.indexOf('立即觀看') + 100));
    }
});
