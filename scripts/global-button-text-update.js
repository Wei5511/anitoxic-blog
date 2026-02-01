/**
 * GLOBAL BUTTON TEXT UPDATE
 * 
 * Objective: Change "立即觀看" to "前往MyVideo線上觀看" in all articles.
 * Target: Content containing "btn-orange-small".
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🚀 Updating Button Text Globally...');

// 1. Get all articles with the button
const rows = db.prepare("SELECT id, content FROM articles WHERE content LIKE '%btn-orange-small%'").all();

console.log(`Found ${rows.length} articles with buttons.`);

let updateCount = 0;
const updateStmt = db.prepare('UPDATE articles SET content = ? WHERE id = ?');

for (const row of rows) {
    let newContent = row.content.replace(/>立即觀看<\/a>/g, '>前往MyVideo線上觀看</a>');

    if (newContent !== row.content) {
        updateStmt.run(newContent, row.id);
        updateCount++;
        console.log(`✅ Updated Article ID ${row.id}`);
    }
}

console.log(`🎉 Complete! Updated text in ${updateCount} articles.`);
