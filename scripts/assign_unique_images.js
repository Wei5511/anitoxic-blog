const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🖼️ Assigning Unique Images to Jan Articles...');

// 1. Extract Images from anime.html (Source of truth)
const htmlPath = 'C:/Users/admin/Desktop/anime.html';
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Map Title -> Image
const imageMap = {};
const regex = /<h2 class="item-title">(.*?)<\/h2>[\s\S]*?<img src="([^"]+)"/g;
let match;
while ((match = regex.exec(htmlContent)) !== null) {
    let title = match[1].replace(/《|》/g, '').split('：')[0].split(' ')[0];
    let img = match[2];
    imageMap[title] = img;
    // Normalized keys
    if (title.includes('咒術')) imageMap['咒術迴戰'] = img;
    if (title.includes('芙莉蓮')) imageMap['葬送的芙莉蓮'] = img;
    if (title.includes('我推')) imageMap['我推的孩子'] = img;
    if (title.includes('燃油車')) imageMap['燃油車鬥魂'] = img;
    if (title.includes('判處')) imageMap['判處勇者刑'] = img;
    if (title.includes('相反')) imageMap['相反的你和我'] = img;
    if (title.includes('公主')) imageMap['公主殿下'] = img;
    if (title.includes('非法')) imageMap['非法英雄'] = img;
}

// 2. Define Assignments
// We have 5 articles to update (slugs).
const assignments = [
    { slug: 'jan-2026-highlights', key: '葬送的芙莉蓮' }, // Highlight = Frieren
    { slug: 'jan-2026-weekly-vol-1', key: '我推的孩子' },
    { slug: 'jan-2026-weekly-vol-2', key: '咒術迴戰' },
    { slug: 'jan-2026-weekly-vol-3', key: '燃油車鬥魂' },
    { slug: 'jan-2026-weekly-vol-4', key: '判處勇者刑' }
];

// 3. Update DB
const stmt = db.prepare('UPDATE articles SET image_url = ? WHERE slug = ?');

assignments.forEach(assign => {
    const imgUrl = imageMap[assign.key];
    if (imgUrl) {
        console.log(`Setting [${assign.slug}] -> Image of [${assign.key}]`);
        stmt.run(imgUrl, assign.slug);
    } else {
        console.log(`⚠️ Missing image for [${assign.key}], skipping assignment for [${assign.slug}].`);
    }
});
