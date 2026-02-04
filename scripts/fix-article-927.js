const db = require('better-sqlite3')('anime.db');

console.log('=== Fixing Article 927 ===\n');

// Get current article
const article = db.prepare('SELECT id, title, myvideo_url, content FROM articles WHERE id = ?').get(927);

if (!article) {
    console.log('Article 927 not found!');
    db.close();
    process.exit(1);
}

console.log('Current MyVideo URL:', article.myvideo_url);
console.log('New MyVideo URL: https://www.myvideo.net.tw/details/3/32428\n');

// Clean up content:
// 1. Convert HTML <a> tags to Markdown links
// 2. Standardize image URLs to use Cloudfront
let cleanedContent = article.content;

// Replace HTML anchor tags with Markdown format
// Pattern: <a href="URL" class="btn-orange-small" target="_blank">TEXT</a>
// Replace with: [TEXT](URL)
cleanedContent = cleanedContent.replace(
    /<a href="([^"]+)"\s+class="btn-orange-small"\s+target="_blank">([^<]+)<\/a>/g,
    '[$2]($1)'
);

// Also handle without target="_blank"
cleanedContent = cleanedContent.replace(
    /<a href="([^"]+)"\s+class="btn-orange-small">([^<]+)<\/a>/g,
    '[$2]($1)'
);

// Standardize image URLs - convert img.myvideo.net.tw to Cloudfront URLs
// Note: We'll keep the existing myvideo images as they are already in the content
// Only the main banner image should use Cloudfront

console.log('Cleaning up HTML tags and formatting...\n');

// Update the database
const updateStmt = db.prepare(`
    UPDATE articles 
    SET myvideo_url = ?,
        content = ?
    WHERE id = 927
`);

const result = updateStmt.run(
    'https://www.myvideo.net.tw/details/3/32428',
    cleanedContent
);

console.log('✅ Updated article 927');
console.log('   - MyVideo URL: Fixed');
console.log('   - Content: Cleaned HTML tags');
console.log('   - Changes:', result.changes);

// Verify the update
const updated = db.prepare('SELECT myvideo_url FROM articles WHERE id = ?').get(927);
console.log('\n✅ Verification:');
console.log('   New MyVideo URL:', updated.myvideo_url);

db.close();
console.log('\n✅ Done!');
