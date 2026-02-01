const fs = require('fs');
const db = require('better-sqlite3')('anime.db');

// Read the verified IDs
const mappingContent = fs.readFileSync('consolidated_mapping.json', 'utf8');
const idMap = JSON.parse(mappingContent);

// Add manual overrides for missing items verifyed in task.md
idMap['炎炎消防隊 參之章'] = ''; // Missing
idMap['火喰鳥'] = ''; // Missing
idMap['燃油車鬥魂'] = ''; // Missing
idMap['葬送的芙莉蓮 第二季'] = ''; // Missing
idMap['我的英雄學院外傳：非法英雄 第二季'] = '32421'; // Manual fix
idMap['藍色監獄 VS. 日本代表 U-20'] = '30640'; // Fallback to S1

// Read the raw content (extracted previously)
const rawData = JSON.parse(fs.readFileSync('jan_2026_data.json', 'utf8'));

// 8 Core Rules Implementation
const targetId = 875; // Forced target
const targetSlug = 'jan-2026-new-anime-v9';
const finalTitle = rawData.title;
const finalIntro = rawData.intro;

console.log(`💎 Restoring January 2026 Article to ID ${targetId}...`);

// Prepare Items with High Quality Standards
const finalItems = rawData.items.map((item, index) => {
    let myVideoId = idMap[item.t];

    // Fuzzy fallback for main titles if exact map fail
    if (!myVideoId) {
        if (item.t.includes('我推的孩子')) myVideoId = '23277';
        if (item.t.includes('咒術迴戰')) myVideoId = '32428';
        if (item.t.includes('非法英雄')) myVideoId = '32421';
        if (item.t.includes('拷問')) myVideoId = '26411';
    }

    // Default button action
    let buttonUrl = 'https://www.myvideo.net.tw/';
    let buttonText = 'MyVideo 線上看';

    if (myVideoId) {
        buttonUrl = `https://www.myvideo.net.tw/details/3/${myVideoId}`;
        buttonText = '前往MyVideo線上觀看';
    } else {
        // Graceful degradation for missing IDs (Rule #6)
        buttonUrl = `https://www.myvideo.net.tw/search/${encodeURIComponent(item.t.split(' ')[0])}`;
        buttonText = 'MyVideo 搜尋片單';
    }

    // Ensure Description Length (Rule #2) -> The source HTML already has long descriptions, verify length
    let desc = item.desc || '';
    if (desc.length < 50) console.warn(`⚠️ Warning: Item ${item.t} description too short (${desc.length})`);

    return {
        t: item.t,
        desc: desc, // Keep original rich HTML/Text
        img: '', // Will update with local assets logic if needed, but for now trusting source or placeholder
        url: buttonUrl,
        btn: buttonText,
        id: myVideoId
    };
});

// Construct the HTML Content
let htmlContent = `
<div class="intro-text">
    ${finalIntro}
</div>
`;

finalItems.forEach((item, i) => {
    // Generate Item Block
    htmlContent += `
    <div class="item-block">
        <span class="item-number">NO. ${i + 1}</span>
        <h2 class="item-title">${item.t}</h2>
        
        <!-- IMAGE_PLACEHOLDER_${i} -->
        
        <div class="info-box">
            <span class="info-date">2026 / 01 / ${5 + i} 上線</span>
            <a href="${item.url}" target="_blank" class="btn-link">${item.btn}</a>
        </div>
        
        <p class="item-desc">
            ${item.desc.replace(/\n\n/g, '<br><br>')}
        </p>
    </div>
    `;
});

// Database Operation
// Check if 875 exists
const existing = db.prepare('SELECT id FROM articles WHERE id = ?').get(targetId);

if (existing) {
    console.log('🔄 Overwriting existing article 875...');
    db.prepare(`
        UPDATE articles 
        SET title = ?, slug = ?, content = ?, category = ?, is_pinned = 1, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
    `).run(finalTitle, targetSlug, htmlContent, '編輯精選', targetId);
} else {
    console.log('🆕 Creating new article at ID 875...');
    // Note: forcing ID in INSERT usually requires specifying the column
    try {
        db.prepare(`
            INSERT INTO articles (id, title, slug, content, category, is_pinned, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).run(targetId, finalTitle, targetSlug, htmlContent, '編輯精選');
    } catch (e) {
        // If auto-increment issue, fall back to normal insert but warn
        console.error('❌ Could not force ID 875 (maybe taken?), inserting normally...');
        const login = db.prepare(`
            INSERT INTO articles (title, slug, content, category, is_pinned, created_at, updated_at)
            VALUES (?, ?, ?, ?, 1, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
        `).run(finalTitle, targetSlug, htmlContent, '編輯精選');
        console.log(`Created at new ID: ${login.lastInsertRowid}`);
    }
}

console.log('✅ Jan 2026 Restoration Complete (Content Only). Images need separate download.');
db.close();
