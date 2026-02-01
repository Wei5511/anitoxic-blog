/**
 * FIX FINAL LINKS
 * 
 * Objectives:
 * 1. Update 'myvideo_url' for Fire Force S3 and MF Ghost S3 to the specific details pages provided by the user.
 * 2. Update the embedded links in the 'content' of listicle articles (winter-2026-top10, action-picks).
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🚀 Applying User Provided Specific Links...');

// Map of [Slug] -> { Specific URL, Old Search URL (to replace in content) }
const fixes = {
    'fire-force-s3-ep1': {
        newUrl: 'https://www.myvideo.net.tw/details/4/29972',
        oldSearchUrl: 'https://www.myvideo.net.tw/search/炎炎消防隊'
    },
    'mf-ghost-s3-ep1': {
        newUrl: 'https://www.myvideo.net.tw/details/3/32440',
        oldSearchUrl: 'https://www.myvideo.net.tw/search/燃油車鬥魂'
    }
};

const updateMetaStmt = db.prepare('UPDATE articles SET myvideo_url = ? WHERE slug = ?');

// Use SQL replace to find and replace the baked-in URLs in the content column
const updateContentStmt = db.prepare(`
    UPDATE articles 
    SET content = REPLACE(content, ?, ?) 
    WHERE category = '編輯精選'
`);

for (const [slug, data] of Object.entries(fixes)) {
    // 1. Update the Single Article Metadata
    const metaInfo = updateMetaStmt.run(data.newUrl, slug);
    if (metaInfo.changes > 0) {
        console.log(`✅ [Single] Updated metadata for ${slug}`);
    } else {
        console.log(`⚠️ [Single] Could not find ${slug}`);
    }

    // 2. Update the Content in Listicles
    const contentInfo = updateContentStmt.run(data.oldSearchUrl, data.newUrl);
    if (contentInfo.changes > 0) {
        console.log(`✅ [Content] Replaced embedded link in ${contentInfo.changes} listicle articles for ${slug}`);
    } else {
        console.log(`⚠️ [Content] No content matches found to replace for ${slug}`);
    }
}

console.log('\n🎉 Final link correction complete.');
