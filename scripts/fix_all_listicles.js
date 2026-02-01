const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🔧 Running Global Listicle Link Fixer...');

// 1. Load correct library
const lib = db.prepare("SELECT title, url FROM myvideo_library").all();
const libMap = new Map();
// Add manual mappings found in previous steps
const manualMappings = [
    { k: '影子籃球員', v: '黑子的籃球' },
    { k: '排球少年', v: '排球少年!! 第四季' }, // Map Library Title -> Article Usage
    { k: '藍色監獄', v: '藍色監獄 VS. 日本代表 U-20' },
    { k: '飆速宅男', v: '飆速宅男 第五季' },
    // "Official Library Title" : "What Article Might Call It" ? NO.
    // We map "Article Title Variation" -> "Official URL"
];

// Build Map: Clean Title -> URL
lib.forEach(item => {
    libMap.set(item.title, item.url);
    libMap.set(item.title.replace(/\s+/g, ''), item.url); // No spaces

    // Reverse manual mappings: If library has '影子籃球員', we also map '黑子的籃球' to its URL
    if (item.title === '影子籃球員') libMap.set('黑子的籃球', item.url);
    if (item.title === '排球少年') libMap.set('排球少年!! 第四季', item.url);
    if (item.title === '藍色監獄') libMap.set('藍色監獄 VS. 日本代表 U-20', item.url);
    if (item.title === '飆速宅男') libMap.set('飆速宅男 第五季', item.url);
    if (item.title === '進擊的巨人') libMap.set('進擊的巨人 The Final Season', item.url);
    if (item.title === '輝夜姬想讓人告白') libMap.set('輝夜姬想讓人告白？', item.url);
    if (item.title === '名湯「異世界溫泉」開拓記~30多歲溫泉狂熱者，轉生到悠閒的溫泉天國~(有修版)') {
        libMap.set('名湯「異世界溫泉」開拓記', item.url);
    }
    if (item.title === '轉生賢者的異世界生活～取得第二職業，成為世界最強～') {
        libMap.set('轉生賢者的異世界生活', item.url);
    }
    if (item.title === '轉生貴族的異世界冒險錄～不知自重的眾神使徒～') {
        libMap.set('轉生貴族的異世界冒險錄', item.url);
    }
    if (item.title === '咒術迴戰') {
        libMap.set('咒術迴戰 (第1季)', item.url);
        libMap.set('咒術迴戰 死滅迴游 前篇', item.url);
    }
    if (item.title === '公主殿下，「拷問」的時間到了') {
        libMap.set('公主殿下，拷問的時間到了', item.url); // Handle missing quotes
    }
    // New User provided links
    libMap.set('泛而不精的我被逐出了勇者隊伍', 'https://www.myvideo.net.tw/details/3/32390');
    libMap.set('Fate/strange Fake', 'https://www.myvideo.net.tw/details/3/29508');
    libMap.set('輝夜姬想讓人告白？特別篇「邁向大人的階梯」', 'https://www.myvideo.net.tw/details/3/32347');
    libMap.set('燃油車鬥魂 第三季', 'https://www.myvideo.net.tw/details/3/28879'); // Ensure mapped if title varies

    // Add generic season handling: "Title S2" -> "Title URL"
    // This is dangerous if S2 has a different URL, but user requested "MyVideo Main", 
    // and Import script only imported the main URLs usually? 
    // Actually our raw list has specific seasons.
    // If raw list has "Frieren S2", we map "Frieren S2" -> URL.
});

// 2. Get all Listicles (Both Picks and General)
const articles = db.prepare("SELECT * FROM articles WHERE category IN ('編輯精選', '綜合報導')").all();
console.log(`Found ${articles.length} listicles to check.`);

let totalFixedArticles = 0;
let totalFixedLinks = 0;

for (const article of articles) {
    let content = article.content;
    let fixedCount = 0;

    // Strategy: Split by "## " headers
    const sections = content.split('## ');
    let newContent = sections[0];

    for (let i = 1; i < sections.length; i++) {
        const section = sections[i];
        const lines = section.split('\n');
        const titleLine = lines[0].trim();

        // Normalize title: Remove "1. ", "《", "》"
        // Also remove "｜Subtitle"
        let cleanTitle = titleLine
            .replace(/^\d+\.\s*/, '')
            .replace(/《/g, '')
            .replace(/》/g, '')
            .split('｜')[0]
            .trim();

        // Normalize "Re:" to "Re：" (MyVideo often uses full width)
        if (cleanTitle.startsWith('Re:')) {
            cleanTitle = cleanTitle.replace('Re:', 'Re：');
        }

        // Look up URL
        let correctUrl = libMap.get(cleanTitle);

        // Fuzzy fallback check
        if (!correctUrl) {
            // Try removing "Season 2", "S2", "(第N季)" etc
            const baseTitle = cleanTitle
                .replace(/[\(（]第\d+季[\)）]|第二季|第三季|S2|S3|Part\s*\d+|第.+季|參之章|貳之章|死滅迴游篇/g, '')
                .trim();
            correctUrl = libMap.get(baseTitle);
        }

        if (correctUrl) {
            // Check for existing link
            const linkRegex = /href="(https:\/\/www\.myvideo\.net\.tw\/details\/[^"]+)"/;
            const match = section.match(linkRegex);

            if (match) {
                const currentUrl = match[1];
                if (currentUrl !== correctUrl) {
                    console.log(`[Art:${article.id}] Fixing [${cleanTitle}]: ${currentUrl} -> ${correctUrl}`);
                    const newSection = section.replace(currentUrl, correctUrl);
                    newContent += '## ' + newSection;
                    fixedCount++;
                    totalFixedLinks++;
                    continue;
                }
            } else {
                console.log(`[Art:${article.id}] 🟢 Adding missing link for [${cleanTitle}]`);
                // Append button at the end of section (before next ## or end)
                // section variable contains everything after "## ".
                // We'll just append to it.
                const buttonHtml = `\n\n<a href="${correctUrl}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>\n\n---`;
                // Check if it already has "---", if so, insert before it? 
                // Simple append is safer than complex regex insertion for now.
                // But wait, the section string comes from split('## ').
                // It might already have content.
                // Make sure we don't double add if run multiple times.
                // The check `const match = section.match(linkRegex)` prevents double adding if we use the same format.

                // Remove existing trailing "---" if any, then add button and "---".
                let cleanSection = section.replace(/\n---\s*$/, '').trim();
                newContent += '## ' + cleanSection + buttonHtml + '\n\n';
                fixedCount++;
                totalFixedLinks++;
                continue;
            }
            // Add section if valid (link matches or we just keep it because title is valid)
            newContent += '## ' + section;
        } else {
            // TITLE NOT FOUND IN LIBRARY -> REMOVE SECTION
            // Only log missing titles that look like headers (not random lines)
            if (section.length > 50) {
                console.log(`[Art:${article.id}] 🗑️ REMOVING [${cleanTitle}] - Not in MyVideo library.`);
                fixedCount++; // Count removal as a fix/change
            } else {
                // Keep random short sections? No, if it was parsed as a section but failed title lookup, drop it?
                // Actually, be careful not to drop footer text if it starts with ##?
                // But split('## ') usually implies headers.
                // If it's the LAST section and just footer...
                // Usually Footers don't start with ## in this format.
            }
        }

        // Removed: newContent += '## ' + section; (moved inside if(correctUrl))
    }

    if (fixedCount > 0) {
        db.prepare("UPDATE articles SET content = ? WHERE id = ?").run(newContent, article.id);
        totalFixedArticles++;
    }
}

console.log(`✅ Completed. Fixed ${totalFixedLinks} links across ${totalFixedArticles} articles.`);
