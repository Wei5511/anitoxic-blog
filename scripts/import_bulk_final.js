
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

async function main() {
    console.log('Starting Final Bulk Import...');

    // 1. Read all files
    let allLines = [];
    for (let i = 1; i <= 4; i++) {
        const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf8');
            // Split by newline
            const lines = content.split(/\r?\n/);
            allLines = allLines.concat(lines);
        }
    }

    // 2. Parse items
    const items = [];
    for (const line of allLines) {
        if (!line.trim()) continue;

        // Strategy: find "http"
        const httpIndex = line.indexOf('http');
        if (httpIndex === -1) continue;

        const title = line.substring(0, httpIndex).trim();
        const url = line.substring(httpIndex).trim();

        if (title && url) {
            items.push({ title, url });
        }
    }

    console.log(`Parsed ${items.length} items from text files.`);

    // 3. Prepare Statements
    // Schema: title, slug, category, image_url, content, myvideo_url
    // (published_at has default CURRENT_TIMESTAMP, is_pinned default 0)
    const insertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, myvideo_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `);

    const checkStmt = db.prepare('SELECT id FROM articles WHERE title = ?');

    let inserted = 0;
    let skipped = 0;
    let errors = 0;

    db.transaction(() => {
        for (const item of items) {
            try {
                // Check duplicate
                const exist = checkStmt.get(item.title);
                if (exist) {
                    skipped++;
                    continue;
                }

                // Insert
                insertStmt.run(
                    item.title,
                    item.title, // slug
                    '編輯精選', // category
                    '/images/placeholder.jpg',
                    `<h2>${item.title}</h2><p>本作目前尚未有詳細介紹。資料庫建檔中。</p>`,
                    item.url
                );
                inserted++;

            } catch (e) {
                console.error(`Failed to insert "${item.title}":`, e.message);
                errors++;
            }
        }
    })();

    console.log('-----------------------------');
    console.log(`Import Complete.`);
    console.log(`Inserted: ${inserted}`);
    console.log(`Skipped (Duplicate): ${skipped}`);
    console.log(`Errors: ${errors}`);
}

main();
