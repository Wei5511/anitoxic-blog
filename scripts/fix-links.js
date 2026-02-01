/**
 * FIX LINKS
 * 
 * 1. Remove MyVideo URLs for shows NOT on MyVideo (Darwin, Medalist, etc.)
 * 2. Fix specific MyVideo URLs for shows that ARE on MyVideo but had wrong links.
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🚀 Fixing Database Links...');

// 1. Remove Links (Exclusive elsewhere or requested removal)
const toRemove = [
    'darwin-ep1',            // Disney+
    'medalist-ep1',          // Requested by user
    'hells-paradise-s2-ep1', // Netflix
    'jojo-sbr-ep1'           // Netflix
];

const removeStmt = db.prepare('UPDATE articles SET myvideo_url = NULL WHERE slug = ?');
let totalRemoved = 0;

for (const slug of toRemove) {
    const info = removeStmt.run(slug);
    if (info.changes > 0) {
        console.log(`✅ Removed Link (Set to NULL): ${slug}`);
        totalRemoved++;
    } else {
        console.log(`⚠️  Could not remove link (Slug not found?): ${slug}`);
    }
}

// 2. Update Links (Fix broken ones)
const toUpdate = [
    {
        slug: 'fire-force-s3-ep1',
        url: 'https://www.myvideo.net.tw/search/炎炎消防隊'
    },
    {
        slug: 'mf-ghost-s3-ep1',
        url: 'https://www.myvideo.net.tw/search/燃油車鬥魂'
    }
];

const updateStmt = db.prepare('UPDATE articles SET myvideo_url = ? WHERE slug = ?');
let totalUpdated = 0;

for (const item of toUpdate) {
    const info = updateStmt.run(item.url, item.slug);
    if (info.changes > 0) {
        console.log(`✅ Updated Link: ${item.slug} -> ${item.url}`);
        totalUpdated++;
    } else {
        console.log(`⚠️  Could not update link (Slug not found?): ${item.slug}`);
    }
}

console.log(`\n🎉 Link Fix Complete! Removed: ${totalRemoved}, Updated: ${totalUpdated}`);
