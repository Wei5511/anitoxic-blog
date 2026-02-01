/**
 * Import MyVideo Links into myvideo_library table
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'anime.db');
const rawPath = path.join(__dirname, 'myvideo_links_raw.txt');

async function main() {
    console.log('🔗 Importing MyVideo Links...');
    const db = new Database(dbPath);

    // 1. Create Table
    db.exec(`
        CREATE TABLE IF NOT EXISTS myvideo_library (
            title TEXT PRIMARY KEY,
            url TEXT,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `);

    // 2. Read Raw File
    if (!fs.existsSync(rawPath)) {
        console.error("❌ Raw definition file not found!");
        return;
    }

    const rawData = fs.readFileSync(rawPath, 'utf-8');
    const lines = rawData.split('\n');

    let inserted = 0;
    let updated = 0;

    const insertStmt = db.prepare(`
        INSERT INTO myvideo_library (title, url) 
        VALUES (@title, @url)
        ON CONFLICT(title) DO UPDATE SET 
        url = excluded.url,
        updated_at = CURRENT_TIMESTAMP
    `);

    db.transaction(() => {
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;

            // Allow tab or multiple spaces as separator
            const parts = line.split(/\t+/);
            // Fallback if no tab found, try last space? No, trust tab or maybe just split by first http

            let title, url;

            if (parts.length >= 2) {
                title = parts[0].trim();
                url = parts[1].trim();
            } else {
                // Try to find the start of http
                const httpIndex = line.indexOf('http');
                if (httpIndex > 0) {
                    title = line.substring(0, httpIndex).trim();
                    url = line.substring(httpIndex).trim();
                } else {
                    console.warn(`⚠️ skipping invalid line: ${line}`);
                    continue;
                }
            }

            if (title && url) {
                insertStmt.run({ title, url });
                inserted++;
            }
        }
    })();

    console.log(`✅ Processed. Total definitions in library: ${db.prepare('SELECT count(*) as c FROM myvideo_library').get().c}`);

    // 3. Migrate / Update Articles (Fuzzy Match or Exact Match)
    // We want to update ANY article where we can find a title match in our new library.
    // Logic: 
    // - Iterate through all articles
    // - Try to find a match in myvideo_library with the article title
    // - If match found, update myvideo_url

    console.log('🔄 Attempting to auto-link existing articles...');

    const articles = db.prepare("SELECT title, slug, myvideo_url FROM articles").all();
    const lib = db.prepare("SELECT title, url FROM myvideo_library").all();

    // Create simple normalization map for the library
    const libMap = new Map();
    lib.forEach(item => {
        libMap.set(item.title, item.url);
        // Also map normalized key
        libMap.set(normalize(item.title), item.url);
    });

    let linkedCount = 0;
    const updateArticle = db.prepare("UPDATE articles SET myvideo_url = ? WHERE slug = ?");

    for (const article of articles) {
        // 1. Direct match
        if (libMap.has(article.title)) {
            const newUrl = libMap.get(article.title);
            if (normalUrl(article.myvideo_url) !== normalUrl(newUrl)) {
                updateArticle.run(newUrl, article.slug);
                linkedCount++;
                console.log(`   🔗 Linked [${article.title}] -> ${newUrl}`);
            }
            continue;
        }

        // 2. Normalized match of article title
        const normTitle = normalize(article.title);
        if (libMap.has(normTitle)) {
            const newUrl = libMap.get(normTitle);
            if (normalUrl(article.myvideo_url) !== normalUrl(newUrl)) {
                updateArticle.run(newUrl, article.slug);
                linkedCount++;
                console.log(`   🔗 Linked (Normalized) [${article.title}] -> ${newUrl}`);
            }
            continue;
        }
    }

    console.log(`✨ Link Update Complete. Updated ${linkedCount} articles.`);
}

function normalize(str) {
    if (!str) return '';
    return str.replace(/\s+/g, '')
        .replace(/：/g, ':')
        .replace(/〜/g, '~')
        .replace(/！/g, '!')
        .toLowerCase();
}

function normalUrl(url) {
    if (!url) return '';
    return url.split('?')[0].trim(); // Ignore query params for comparison
}

main();
