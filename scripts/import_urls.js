
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

async function main() {
    console.log('Starting URL Import (Mass Insert Mode)...');

    // Read all 4 parts
    let allContent = '';
    for (let i = 1; i <= 4; i++) {
        const filePath = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
        if (fs.existsSync(filePath)) {
            allContent += fs.readFileSync(filePath, 'utf-8') + '\n';
        }
    }

    const lines = allContent.split('\n').filter(line => line.trim());
    console.log(`Total lines to process: ${lines.length}`);

    // Prepare statements
    const updateStmt = db.prepare('UPDATE articles SET myvideo_url = ? WHERE id = ?');
    const insertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, is_published, myvideo_url, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    const findExact = db.prepare('SELECT id, title FROM articles WHERE title = ? COLLATE NOCASE');
    const findLike = db.prepare('SELECT id, title FROM articles WHERE title LIKE ?');

    // Check if duplicate strictly by title
    const checkDuplicate = db.prepare('SELECT id FROM articles WHERE title = ?');

    let updatedCount = 0;
    let insertedCount = 0;
    let skippedCount = 0;

    db.transaction(() => {
        for (const line of lines) {
            const httpIndex = line.indexOf('http');
            if (httpIndex === -1) continue;

            const namePart = line.substring(0, httpIndex).trim();
            const urlPart = line.substring(httpIndex).trim();

            if (!namePart || !urlPart) continue;

            // 1. Try to find existing article to update
            let article = findExact.get(namePart);
            if (!article) article = findExact.get(`《${namePart}》`);
            if (!article) article = findLike.get(`${namePart}%`);

            if (article) {
                // UPDATE
                const res = updateStmt.run(urlPart, article.id);
                if (res.changes > 0) updatedCount++;
            } else {
                // INSERT
                // Double check exact duplicate to prevent re-inserting if run multiple times
                const dup = checkDuplicate.get(namePart);
                if (dup) {
                    skippedCount++;
                    continue; // Already exists but maybe fuzzy match failed. safely skip.
                }

                try {
                    insertStmt.run(
                        namePart, // title
                        namePart, // slug (temporary)
                        '編輯精選', // category (User requested merge)
                        '/images/placeholder.jpg', // image_url
                        `<h2>${namePart}</h2><p>本作目前尚未有詳細介紹。</p><p>資料庫建檔中。</p>`, // content
                        1, // published
                        urlPart // myvideo_url
                    );
                    insertedCount++;
                } catch (e) {
                    console.error(`Failed to insert ${namePart}:`, e.message);
                }
            }
        }
    })();

    console.log('-----------------------------------');
    console.log(`Import Complete.`);
    console.log(`Updated Existing: ${updatedCount}`);
    console.log(`Inserted New: ${insertedCount}`);
    console.log(`Skipped (Duplicate): ${skippedCount}`);
}

main();
