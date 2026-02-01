const fs = require('fs');
const cheerio = require('cheerio');
const db = require('better-sqlite3')('anime.db');

// Read HTML
let html;
try {
    html = fs.readFileSync('jan_2026_latest.html', 'utf-8');
} catch (e) {
    console.error("HTML file not found!");
    process.exit(1);
}

const $ = cheerio.load(html);
const articles = $('article');
console.log(`Found ${articles.length} anime entries.`);

// Prepared Statement
const updateStmt = db.prepare(`
    UPDATE anime 
    SET 
        source = ?,
        youtube_id = ?,
        streaming = ?,
        staff = ?,
        cast = ?,
        updated_at = CURRENT_TIMESTAMP
    WHERE title = ?
`);

let updatedCount = 0;

articles.each((i, el) => {
    const $el = $(el);
    const title = $el.find('h3 a').text().trim();
    if (!title) return;

    // 1. Source Type
    let source = "Unknown";
    // Look in "作品元素" list
    // The section header contains "作品元素"
    // We just search all li's inside this article.
    $el.find('li').each((j, li) => {
        const text = $(li).text().trim();
        if (text.includes('漫畫改編')) source = 'Manga';
        else if (text.includes('小說改編')) source = 'Light Novel';
        else if (text.includes('原創')) source = 'Original';
        else if (text.includes('遊戲改編')) source = 'Game';
    });

    // 2. YouTube ID
    // Look for valid youtube image/link. 
    // Found pattern: src="https://i.ytimg.com/vi_webp/RH-FcW94z00/mqdefault.webp"
    // Also look for explicit links if any.
    let youtube_id = null;
    const ytImg = $el.find('img[src*="i.ytimg.com"]').first().attr('src');
    if (ytImg) {
        // extract ID from /vi/ID/ or /vi_webp/ID/
        const match = ytImg.match(/\/vi(?:_webp)?\/([^\/]+)\//);
        if (match) youtube_id = match[1];
    }

    // 3. Streaming Providers
    // Section "台灣播出資訊"
    const streaming = [];
    $el.find('a').each((j, a) => {
        const href = $(a).attr('href');
        const text = $(a).text().trim();
        // Heuristic: check if parent or nearby header indicates streaming
        // Or check known providers in text
        const knownProviders = ['巴哈姆特', 'Netflix', 'Disney+', 'KKTV', 'Hami Video', '中華電信', 'friDay', 'MyVideo', 'LINE TV', 'CATCHPLAY', '愛奇藝', 'Muse', 'Ani-One', 'YouTube'];

        // Check if this link is likely a streaming link
        // In the HTML, they are in a list under "更新時間與觀看平台" but that's hard to target via text traversal easily without IDs.
        // However, the links themselves are usually external or specific.
        // Let's filter by checking if text matches known list
        if (knownProviders.some(p => text.includes(p))) {
            streaming.push({ name: text, url: href });
        }
    });

    // 4. Staff
    // Header "製作陣容"
    // Structure: ul -> li -> div(Name) + div(Role)
    const staff = [];
    // Find the header first, then the next ul
    $el.find('h4').each((j, h4) => {
        if ($(h4).text().includes('製作陣容')) {
            const list = $(h4).next('ul');
            list.find('li').each((k, li) => {
                const name = $(li).find('div').first().text().trim();
                const role = $(li).find('div').last().text().trim();
                if (name && role) staff.push({ name, role });
            });
        }
    });

    // 5. Cast
    // Header "演出聲優"
    const cast = [];
    $el.find('h4').each((j, h4) => {
        if ($(h4).text().includes('演出聲優')) {
            const list = $(h4).next('ul');
            list.find('li').each((k, li) => {
                // Text is like "CV: 演員名 角色名" or "CV: 演員名" then div "角色名"
                // From HTML read: div first "CV: 種﨑敦美", div second "フリーレン"
                let actor = $(li).find('div').first().text().trim().replace('CV:', '').trim();
                let character = $(li).find('div').last().text().trim();
                if (actor) cast.push({ name: actor, character });
            });
        }
    });

    // Update DB
    try {
        const res = updateStmt.run(
            source,
            youtube_id,
            JSON.stringify(streaming),
            JSON.stringify(staff),
            JSON.stringify(cast),
            title
        );
        if (res.changes > 0) updatedCount++;
        else console.log(`Skipped (not found): ${title}`);
    } catch (e) {
        console.error(`Error updating ${title}:`, e.message);
    }
});

console.log(`✅ Detailed info updated for ${updatedCount} animes.`);
