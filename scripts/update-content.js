/**
 * Update Articles - Remove 製作資訊/播出資訊 and Add Video Embeds
 * 
 * Video embed format: [video:myvideo:ID]
 * Example: [video:myvideo:32428]
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');

// MyVideo video IDs for each anime (from myvideo.net.tw)
const videoIds = {
    'frieren-s2': '32346',        // 葬送的芙莉蓮第二季
    'jjk-culling': '32428',       // 咒術迴戰死滅迴游
    'oshi-no-ko-s3': '32450',     // 我推的孩子第三季
    'fire-force-s3': '32380',     // 炎炎消防隊參之章
    'polar-opposites': '32400',   // 相反的你和我
    'torture-princess': '32410',  // 公主殿下拷問時間
    'medalist': '32420',          // 金牌得主
    'mf-ghost': '32430',          // MF Ghost
    'vigilantes': '32440',        // 正義使者
    'sentenced': '32460',         // 判處勇者刑
};

function removeInfoSections(content) {
    // 移除製作資訊區塊
    content = content.replace(/## 製作資訊[\s\S]*?(?=##|$)/g, '');
    // 移除播出資訊區塊
    content = content.replace(/## 播出資訊[\s\S]*?(?=##|$)/g, '');
    // 移除多餘的空行
    content = content.replace(/\n{3,}/g, '\n\n');
    // 清理結尾
    content = content.trim();
    return content;
}

function addVideoEmbed(content, slug, videoId) {
    // 在文章開頭圖片後面加入影片
    // 找到第一個圖片的位置
    const imgMatch = content.match(/!\[.*?\]\(.*?\)/);
    if (imgMatch && videoId) {
        const insertPos = content.indexOf(imgMatch[0]) + imgMatch[0].length;
        const videoTag = `\n\n[video:myvideo:${videoId}]\n`;
        content = content.slice(0, insertPos) + videoTag + content.slice(insertPos);
    }
    return content;
}

async function main() {
    console.log('🔧 Updating articles...');
    const db = new Database(dbPath);

    const articles = db.prepare('SELECT id, slug, content FROM articles').all();
    const updateStmt = db.prepare('UPDATE articles SET content = ? WHERE id = ?');

    let updated = 0;
    for (const article of articles) {
        let content = article.content;
        const originalLength = content.length;

        // 1. 移除製作資訊和播出資訊
        content = removeInfoSections(content);

        // 2. 為集數更新類文章添加影片嵌入
        const slugKey = Object.keys(videoIds).find(key => article.slug.includes(key));
        if (slugKey) {
            content = addVideoEmbed(content, article.slug, videoIds[slugKey]);
        }

        // 檢查是否有變更
        if (content !== article.content) {
            updateStmt.run(content, article.id);
            console.log(`✅ Updated: ${article.slug} (${originalLength} -> ${content.length} chars)`);
            updated++;
        }
    }

    console.log(`\n✅ Done! Updated ${updated} articles.`);
}

main();
