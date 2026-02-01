const db = require('better-sqlite3')('anime.db');

const weeks = [
    '2026年1月【第一週】新番進度 (播出區間：1/1 – 1/7)',
    '2026年1月【第二週】新番進度 (播出區間：1/8 – 1/14)',
    '2026年1月【第三週】新番進度 (播出區間：1/15 – 1/21)',
    '2026年1月【第四週】新番進度 (播出區間：1/22 – 1/31)'
];

weeks.forEach(title => {
    const row = db.prepare("SELECT id, title, image_url, content FROM articles WHERE title = ?").get(title);
    if (!row) {
        console.log(`❌ Article not found: ${title}`);
        return;
    }
    console.log(`\n🔍 Article: ${row.title}`);
    console.log(`   Cover Image: ${row.image_url}`);

    // Check first 3 image tags in content
    const imgMatches = [...row.content.matchAll(/!\[.*?\]\((.*?)\)/g)];
    if (imgMatches.length > 0) {
        console.log(`   Content Images (${imgMatches.length}):`);
        imgMatches.slice(0, 3).forEach(m => console.log(`      - ${m[1]}`));
    } else {
        console.log(`   ⚠️ No images found in content!`);
    }
});

// Also check partial title matches in myvideo_library to see what we SHOULD have found
const keywords = ['芙莉蓮', '我推', '咒術', '燃油車'];
console.log('\n🔍 Library Check:');
keywords.forEach(k => {
    const rows = db.prepare(`SELECT title, image_url FROM myvideo_library WHERE title LIKE '%${k}%'`).all();
    rows.forEach(r => console.log(`   [${k}] Found: ${r.title} => ${r.image_url ? r.image_url.substring(0, 50) + '...' : 'NULL'}`));
});
