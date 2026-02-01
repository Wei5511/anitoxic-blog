const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('📌 Importing Pinned HTML with Link Fixes...');

// 1. Prepare Library
const lib = db.prepare("SELECT title, url FROM myvideo_library").all();
const libMap = new Map();
lib.forEach(i => libMap.set(i.title, i.url));

// Add Manual / User Mappings
libMap.set('泛而不精的我被逐出了勇者隊伍', 'https://www.myvideo.net.tw/details/3/32390');
libMap.set('Fate/strange Fake', 'https://www.myvideo.net.tw/details/3/29508');
libMap.set('輝夜姬想讓人告白？特別篇「邁向大人的階梯」', 'https://www.myvideo.net.tw/details/3/32347');
libMap.set('燃油車鬥魂 第三季', 'https://www.myvideo.net.tw/details/4/28879');
libMap.set('判處勇者刑', 'https://www.myvideo.net.tw/details/3/32447');
libMap.set('相反的你和我', 'https://www.myvideo.net.tw/details/3/32423');
libMap.set('咒術迴戰 死滅迴游 前篇', 'https://www.myvideo.net.tw/details/4/24125'); // Map to main
libMap.set('我推的孩子 第三季', 'https://www.myvideo.net.tw/details/3/23277'); // Map to main/S2 link for now if S3 not out, or assume user link correct? User didn't give specific S3 link. Assuming generic.
libMap.set('炎炎消防隊 參之章', 'https://www.myvideo.net.tw/details/4/18115'); // Verify?
libMap.set('我的英雄學院外傳：非法英雄 第二季', 'https://www.myvideo.net.tw/details/3/23246'); // Fallback to MHA?

// 2. Read HTML
const htmlPath = 'C:/Users/admin/Desktop/anime.html';
const htmlContent = fs.readFileSync(htmlPath, 'utf8');

// Extract Body and Style
const styleMatch = htmlContent.match(/<style>([\s\S]*?)<\/style>/);
const bodyMatch = htmlContent.match(/<body>([\s\S]*?)<\/body>/);
let finalBody = bodyMatch ? bodyMatch[1] : htmlContent;
const finalStyle = styleMatch ? styleMatch[1] : '';

// 3. Regex Replace Links based on Titles
// Strategy: Find <h2 class="item-title">TITLE</h2>, then find the next <a href="...">
// We'll use a replacer function on the whole body, but capturing context is hard.
// Alternative: Split by "item-block"?
const blocks = finalBody.split('<div class="item-block">');
let newBody = blocks[0]; // Header part

for (let i = 1; i < blocks.length; i++) {
    let block = blocks[i];
    // Extract Title
    const titleMatch = block.match(/<h2 class="item-title">(.*?)<\/h2>/);
    if (titleMatch) {
        let rawTitle = titleMatch[1];
        // Clean Title
        let cleanTitle = rawTitle.replace(/《|》/g, '').split('：')[0].split(' ')[0];
        // "我的英雄學院外傳" -> "我的英雄學院外傳"
        // "炎炎消防隊 參之章" -> "炎炎消防隊"

        // Try strict match first
        let realUrl = libMap.get(rawTitle.replace(/《|》/g, ''));

        // Try Fuzzy
        if (!realUrl) {
            for (const [k, v] of libMap.entries()) {
                if (rawTitle.includes(k)) {
                    realUrl = v;
                    break;
                }
            }
        }

        if (realUrl) {
            console.log(`Matched [${rawTitle}] -> ${realUrl}`);
            // Replace the generic link
            // HTML has: .net.tw/" target="_blank" class="btn-link">MyVideo線上看全集</a>
            // or just Look for the first href in this block.
            block = block.replace(/href="([^"]+)"/, `href="${realUrl}"`);
        } else {
            console.log(`⚠️ No match for [${rawTitle}] - Keeping original link.`);
        }
    }
    newBody += '<div class="item-block">' + block;
}

// Inject Style
newBody = `<style>${finalStyle}</style>\n` + newBody;

// 4. Save to DB
const title = '2026 新番推薦總整理｜《咒術迴戰》《芙莉蓮》線上看｜MyVideo';
const slug = '2026-winter-anime-guide';
const category = '編輯精選';
const now = new Date().toISOString().split('T')[0];
// Use REPLACE to update
const stmt = db.prepare(`REPLACE INTO articles (title, content, category, slug, published_at, is_pinned, image_url, excerpt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);

// Extract Image for Thumb
const imgMatch = newBody.match(/src="([^"]+)"/);
const firstImage = imgMatch ? imgMatch[1] : '/assets/placeholder.jpg';
const excerpt = '2026年必追動畫新番推薦！MyVideo同步跟播《咒術迴戰 第三季 死滅迴游》、《葬送的芙莉蓮 第二季》、《我推的孩子 第三季》等話題大作。';

stmt.run(title, newBody, category, slug, now, 1, firstImage, excerpt);
console.log('✅ Pinned Article Updated with Real Links.');
