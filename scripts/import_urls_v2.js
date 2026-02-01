
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'anime.db');

try {
    const db = new Database(dbPath, { timeout: 10000 }); // Increase timeout to 10s
    console.log('DB Connection Open.');

    // Read files
    let allContent = '';
    for (let i = 1; i <= 4; i++) {
        const filePath = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
        if (fs.existsSync(filePath)) {
            allContent += fs.readFileSync(filePath, 'utf8') + '\n';
        }
    }

    const lines = allContent.split('\n').filter(l => l.trim().length > 0);
    console.log(`Processing ${lines.length} items...`);

    const insertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, myvideo_url)
        VALUES (?, ?, ?, ?, ?, ?)
    `);
    const updateStmt = db.prepare('UPDATE articles SET myvideo_url = ? WHERE id = ?');
    const findTitle = db.prepare('SELECT id, title FROM articles WHERE title = ? COLLATE NOCASE');
    const findLike = db.prepare('SELECT id, title FROM articles WHERE title LIKE ?');

    let inserted = 0;
    let updated = 0;
    let errors = 0;

    // Use immediate transaction to prevent locking issues
    db.transaction(() => {
        for (const line of lines) {
            try {
                // Parse line
                let namePart = '', urlPart = '';
                if (line.includes('\t')) {
                    [namePart, urlPart] = line.split('\t');
                } else if (line.includes('http')) {
                    const idx = line.indexOf('http');
                    namePart = line.substring(0, idx).trim();
                    urlPart = line.substring(idx).trim();
                }

                if (!namePart || !urlPart) continue;
                namePart = namePart.trim();
                urlPart = urlPart.trim();

                // Check exist
                let exist = findTitle.get(namePart);
                if (!exist) exist = findTitle.get(`《${namePart}》`);
                // if (!exist) exist = findLike.get(`${namePart}%`); // Fuzzy match might be risky for unrelated titles

                if (exist) {
                    const res = updateStmt.run(urlPart, exist.id);
                    if (res.changes) updated++;
                } else {
                    // Insert
                    insertStmt.run(
                        namePart,
                        namePart,
                        '編輯精選',
                        '/images/placeholder.jpg', // Placeholder
                        `<h2>${namePart}</h2><p>本作目前尚未有詳細介紹。</p><p>資料庫建檔中，敬請期待。</p>`,
                        1,
                        urlPart
                    );
                    inserted++;
                }
            } catch (e) {
                console.error(`Error on line: ${line.substring(0, 20)}... ${e.message}`);
                errors++;
            }
        }
    })();

    console.log(`Done. Inserted: ${inserted}, Updated: ${updated}, Errors: ${errors}`);

} catch (e) {
    console.error('Fatal Error:', e);
    process.exit(1);
}
