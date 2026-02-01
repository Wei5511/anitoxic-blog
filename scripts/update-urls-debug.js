/**
 * UPDATE URLs DEBUG - Strict Logic with Error Handling
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
    console.log('🔗 Running Final URL Fix (Debug Mode)...');
    try {
        const db = new Database(dbPath);

        // 1. Fix Listicles / Comprehensive Reports using EXEC
        console.log('Updating Listicles...');
        db.exec("UPDATE articles SET myvideo_url = 'https://www.myvideo.net.tw/cartoon/' WHERE category = '綜合報導'");
        db.exec("UPDATE articles SET myvideo_url = 'https://www.myvideo.net.tw/cartoon/' WHERE category = '編輯精選'");
        db.exec("UPDATE articles SET myvideo_url = 'https://www.myvideo.net.tw/cartoon/' WHERE slug LIKE '%picks%'");
        db.exec("UPDATE articles SET myvideo_url = 'https://www.myvideo.net.tw/cartoon/' WHERE slug LIKE '%top10%'");
        console.log('✅ Listicles Updated via EXEC');

        // 2. Fix Specific Anime
        console.log('Updating Singles...');
        const singleUpdate = db.prepare("UPDATE articles SET myvideo_url = ? WHERE slug LIKE ? AND category = '動畫介紹'");

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
        console.log(`✅ Updated ${singleCount} Single Anime URLs via PREPARE`);

    } catch (err) {
        console.error('❌ FATAL ERROR:', err);
    }
}

main();
