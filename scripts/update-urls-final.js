/**
 * UPDATE URLs FINAL - Strict Logic (Simplified SQL)
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');

const videoMap = {
    'frieren': '32346',
    'jjk': '32428',
    'oshi-no-ko': '32450',
    'fire-force': '32380',
    'polar-opposites': '32400',
    'torture-princess': '32410',
    'medalist': '32420',
    'mf-ghost': '32430',
    'vigilantes': '32440',
    'sentenced': '32460',
    'darwin': '00000',
    'hells-paradise': '00000',
    'jojo-sbr': '00000',
    'nube': '00000',
    'hanakimi': '00000'
};

async function main() {
    console.log('🔗 Running Final URL Fix (Safe Mode)...');
    const db = new Database(dbPath);

    // 1. Fix Listicles / Comprehensive Reports
    // Do one by one to ensure no syntax errors
    const listUrl = 'https://www.myvideo.net.tw/cartoon/';

    let changes = 0;
    changes += db.prepare("UPDATE articles SET myvideo_url = ? WHERE category = '綜合報導'").run(listUrl).changes;
    changes += db.prepare("UPDATE articles SET myvideo_url = ? WHERE category = '編輯精選'").run(listUrl).changes;
    changes += db.prepare("UPDATE articles SET myvideo_url = ? WHERE slug LIKE '%picks%'").run(listUrl).changes;
    changes += db.prepare("UPDATE articles SET myvideo_url = ? WHERE slug LIKE '%top10%'").run(listUrl).changes;

    console.log(`✅ Updated ${changes} List/Comprehensive articles to Cartoon Homepage.`);

    // 2. Fix Specific Anime
    const singleUpdate = db.prepare('UPDATE articles SET myvideo_url = ? WHERE slug LIKE ? AND category = "動畫介紹"');

    let singleCount = 0;
    for (const [key, id] of Object.entries(videoMap)) {
        if (id !== '00000') {
            const url = `https://www.myvideo.net.tw/details/3/${id}`;
            const info = singleUpdate.run(url, `%${key}%`);
            singleCount += info.changes;
        } else {
            const searchUrl = `https://www.myvideo.net.tw/search?keyword=${key}`;
            const info = singleUpdate.run(searchUrl, `%${key}%`);
        }
    }
    console.log(`✅ Updated ${singleCount} Single Anime articles to Specific Details Pages.`);
}

main();
