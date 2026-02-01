const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🔧 Restoring JJK to Article 878...');

const articleId = 878;
const article = db.prepare("SELECT content FROM articles WHERE id = ?").get(articleId);

if (!article) {
    console.error('Article not found');
    process.exit(1);
}

const jjkContent = `## 咒術迴戰 死滅迴游 前篇

在這個人的負面情緒會化為「咒靈」危害人間的世界，咒術師們挺身而戰。這部作品之所以能成為現象級大作，除了帥氣的人設與潮到出水的招式（領域展開！）外，更在於其對於戰鬥系統的設定。咒術戰不只是力量的互毆，更多時候是關於規則、情報與心理戰的博弈，特別是在「死滅迴游」篇章中表現得更為明顯。

MAPPA 的製作水準無須多言，特別是戰鬥場景的流暢度與運鏡，達到了劇場版等級。五條悟的無敵魅力、虎杖的純粹善良、以及宿儺的絕對邪惡，每一個角色都極具張力。故事中對於「正確的死亡」或是「身為強者的責任」等議題的探討，也讓這部熱血戰鬥番多了一份沈重的現實感。編輯推薦：這是一部將時尚感與殘酷與深刻結合的巔峰之作，是不可錯過的視覺盛宴。

<a href="https://www.myvideo.net.tw/details/4/24125" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>

---

`;

// Check if already exists
if (article.content.includes('咒術迴戰 死滅迴游 前篇')) {
    console.log('Already exists.');
} else {
    // Append to end (or try to insert?)
    // Appending is safest for now.
    const newContent = article.content + '\n' + jjkContent;
    db.prepare("UPDATE articles SET content = ? WHERE id = ?").run(newContent, articleId);
    console.log('✅ JJK Restored.');
}
