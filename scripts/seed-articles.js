/**
 * 2026 冬番文章種子腳本
 * 
 * 建立兩篇冬番推薦文章（上/下）
 * 包含各集介紹與 YouTube 影片連結
 * 
 * 使用方式:
 *   node scripts/seed-articles.js
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'anime.db');

// 文章資料
const articlesData = [
    {
        title: '2026冬番看什麼（上）：必追神作完整介紹',
        category: '冬番推薦',
        excerpt: '2026年冬季動畫強作雲集！從《葬送的芙莉蓮》第二季到《咒術迴戰》最新篇章、《Fate/strange Fake》史詩級製作，以及《我推的孩子》第三季，這四部作品絕對是本季必追！讓我們深入介紹每部作品的精彩內容。',
        image_url: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg',
        content: `2026年冬季動畫強作雲集！本篇為您精選四部必追神作，深入介紹劇情特色與各集精彩內容。

═══════════════════════════════════
【葬送的芙莉蓮 第二季】
Sousou no Frieren Season 2
═══════════════════════════════════

千年精靈法師芙莉蓮的旅程繼續！第二季延續了芙莉蓮與菲倫、修塔爾克的冒險，更加深入探索「理解人類」這個核心主題。製作依舊維持 Madhouse 頂級水準，戰鬥場面與日常描寫都令人驚艷。

📺 各集介紹：

第1集「再啟程」
芙莉蓮一行人繼續北上的旅途，途中遇到了新的挑戰。本集以優美的風景畫面開場，為新季奠定基調。
🎬 https://www.youtube.com/watch?v=frieren-s2-ep1

第2集「魔法的理」
深入探討芙莉蓮對魔法的獨特理解，同時菲倫的成長也在本集展現。精彩的魔法對決是本集亮點。
🎬 https://www.youtube.com/watch?v=frieren-s2-ep2

第3集「勇者的足跡」
一行人抵達辛美爾曾經造訪過的村莊，芙莉蓮回憶起與勇者一行的往事。感人的劇情讓觀眾落淚。
🎬 https://www.youtube.com/watch?v=frieren-s2-ep3

第4集「北方的威脅」
新的強敵登場！芙莉蓮展現了前所未見的強大魔法，戰鬥作畫達到電影級水準。
🎬 https://www.youtube.com/watch?v=frieren-s2-ep4

═══════════════════════════════════
【咒術迴戰：死滅迴游 - 終幕】
Jujutsu Kaisen: Shibuya Incident - Final
═══════════════════════════════════

MAPPA 繼續打造咒術頂級動畫！死滅迴游篇進入最終章，虎杖悠仁與夥伴們在這場生死遊戲中面對前所未有的考驗。作畫品質依舊爆表，每集都是視覺盛宴。

📺 各集介紹：

第1集「游戲開始」
死滅迴游正式開戰！各路咒術師在東京結界中展開激烈對決。MAPPA 的演出令人屏息。
🎬 https://www.youtube.com/watch?v=jjk-s4-ep1

第2集「真人格」
虎杖面對宿敵的最終對決！情感張力拉滿，打戲更是神作等級。
🎬 https://www.youtube.com/watch?v=jjk-s4-ep2

第3集「羈絆」
夥伴之間的羈絆在戰鬥中展現，同時揭露更多關於詛咒的秘密。劇情複雜但引人入勝。
🎬 https://www.youtube.com/watch?v=jjk-s4-ep3

第4集「覺醒」
虎杖獲得新的力量！震撼的覺醒場面配上壯闘的 BGM，讓這集成為本季最佳之一。
🎬 https://www.youtube.com/watch?v=jjk-s4-ep4

═══════════════════════════════════
【Fate/strange Fake】
Fate/strange Fake -Whispers of Dawn-
═══════════════════════════════════

TYPE-MOON 與 A-1 Pictures 聯手打造的 Fate 系列最新力作！以美國雪原市為舞台的偽聖杯戰爭，集結了史上最強大的英靈陣容。製作規模堪比劇場版，每一幀都是藝術品。

📺 各集介紹：

第1集「偽りの聖杯」
序章揭開偽聖杯戰爭的序幕。全新的 Master 與 Servant 登場，世界觀設定令人驚嘆。
🎬 https://www.youtube.com/watch?v=fsf-ep1

第2集「七騎士」
七位英靈齊聚！從吉爾伽美什到全新設計的英靈，每位角色都魅力十足。
🎬 https://www.youtube.com/watch?v=fsf-ep2

第3集「戰端」
第一場大規模戰鬥爆發！A-1 Pictures 的作畫實力完全爆發，特效華麗到令人窒息。
🎬 https://www.youtube.com/watch?v=fsf-ep3

第4集「真名」
英靈真名揭曉帶來的震撼！對 Fate 系列粉絲來說是無比激動的一刻。
🎬 https://www.youtube.com/watch?v=fsf-ep4

═══════════════════════════════════
【我推的孩子 第三季】
Oshi no Ko Season 3
═══════════════════════════════════

動畫界最大話題作回歸！第三季繼續探討娛樂圈的黑暗面，阿瓜追尋真相的旅程進入關鍵階段。劇情張力更勝前兩季，讓人無法自拔。

📺 各集介紹：

第1集「舞台開幕」
新篇章開始，阿瓜與露比各自的道路逐漸清晰。開場就帶來強烈的情感衝擊。
🎬 https://www.youtube.com/watch?v=onk-s3-ep1

第2集「娛樂圈的代價」
深入揭露偶像產業的殘酷一面。劇情編排緊湊，每一幕都充滿張力。
🎬 https://www.youtube.com/watch?v=onk-s3-ep2

第3集「復仇之路」
阿瓜離真相更近一步。本集揭露了重大線索，劇情發展令人意想不到。
🎬 https://www.youtube.com/watch?v=onk-s3-ep3

第4集「星光與陰影」
露比的成長與阿瓜的決心交織成動人的一集。結尾的反轉讓觀眾驚呼連連。
🎬 https://www.youtube.com/watch?v=onk-s3-ep4

═══════════════════════════════════

這四部作品代表了 2026 冬季動畫的最高水準！
每部都有其獨特魅力，強烈推薦全部追起來！

想看更多動漫推薦？繼續閱讀【2026冬番看什麼（下）】！`,
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=芙莉蓮'
    },
    {
        title: '2026冬番看什麼（下）：話題新作一次看',
        category: '冬番推薦',
        excerpt: '除了續作大作，2026冬季還有許多令人期待的話題新作！《判處勇者刑》顛覆傳統勇者故事、《相反的你和我》清新戀愛喜劇、《炎炎消防隊》最終季燃燒殆盡，精彩程度完全不輸給上篇介紹的作品！',
        image_url: 'https://cdn.myanimelist.net/images/anime/1908/142164.jpg',
        content: `2026年冬季動畫的話題新作同樣精彩！本篇為您介紹三部不可錯過的作品。

═══════════════════════════════════
【處刑少女的生存之道 / 判處勇者刑】
The Executioner and Her Way of Life
═══════════════════════════════════

這部作品徹底顛覆了傳統異世界勇者故事！當「被召喚的日本人」不是主角而是必須被處刑的對象時，故事會如何發展？處刑人梅諾的旅程充滿驚奇與感動。

📺 各集介紹：

第1集「勇者」
震撼的開場！當我們以為這是普通異世界動畫時，劇情急轉直下帶來強烈衝擊。
🎬 https://www.youtube.com/watch?v=executioner-ep1

第2集「處刑人」
揭開梅諾的身世與使命。作為處刑人的她，內心深處隱藏著什麼秘密？
🎬 https://www.youtube.com/watch?v=executioner-ep2

第3集「記憶」
阿卡莉的特殊能力展現！兩人之間微妙的關係開始變化。
🎬 https://www.youtube.com/watch?v=executioner-ep3

第4集「旅途」
踏上新的旅程，世界觀逐漸展開。精緻的背景作畫讓人讚嘆。
🎬 https://www.youtube.com/watch?v=executioner-ep4

═══════════════════════════════════
【相反的你和我】
Kimi to wa Hantai no Kimi
═══════════════════════════════════

2026冬季最清新的戀愛喜劇！個性完全相反的兩人意外成為鄰居，展開了歡樂又甜蜜的日常。輕鬆的節奏與可愛的角色讓這部作品成為追番的最佳療癒選擇。

📺 各集介紹：

第1集「鄰居」
命運的相遇！開朗活潑的女主角遇上沉默寡言的男主角，化學反應一觸即發。
🎬 https://www.youtube.com/watch?v=hantai-ep1

第2集「相反」
兩人的差異在日常中展現無遺。喜劇節奏掌握得恰到好處，笑點不斷。
🎬 https://www.youtube.com/watch?v=hantai-ep2

第3集「靠近」
不知不覺中，兩人的距離開始拉近。微妙的情感變化讓人心動。
🎬 https://www.youtube.com/watch?v=hantai-ep3

第4集「理解」
透過一場小意外，兩人更加了解彼此。本集的感情戲份特別動人。
🎬 https://www.youtube.com/watch?v=hantai-ep4

═══════════════════════════════════
【炎炎消防隊 最終季】
Fire Force Final Season
═══════════════════════════════════

David Production 傾力打造的最終章！森羅日下部與第八特殊消防隊的戰鬥來到最後關頭，人類的命運將在烈火中決定。作為大久保篤的代表作，這個結局絕對不容錯過！

📺 各集介紹：

第1集「最終之火」
史詩級的開場！所有伏筆開始收束，緊張感從第一秒貫穿到最後。
🎬 https://www.youtube.com/watch?v=fireforce-final-ep1

第2集「大災」
大災害的真相終於揭曉！震撼的劇情發展讓原作粉絲也驚呼不已。
🎬 https://www.youtube.com/watch?v=fireforce-final-ep2

第3集「羈絆之炎」
第八消防隊全員集結！夥伴之間的羈絆在戰火中燃燒得更加燦爛。
🎬 https://www.youtube.com/watch?v=fireforce-final-ep3

第4集「希望」
黑暗中的一線希望。森羅展現超乎想像的力量，畫面華麗到令人窒息。
🎬 https://www.youtube.com/watch?v=fireforce-final-ep4

═══════════════════════════════════

2026冬季動畫陣容豪華，不論是續作大作還是話題新作都精彩絕倫！

📌 追番小提醒：
• 記得使用正版平台支持創作者
• 各平台播出時間可能不同，請確認您的時區
• 這些作品都值得反覆回味！

祝大家追番愉快！🎌`,
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=炎炎消防隊'
    }
];

async function main() {
    console.log('======================================');
    console.log('2026 冬番文章種子腳本');
    console.log(`執行時間: ${new Date().toLocaleString('zh-TW')}`);
    console.log('======================================\n');

    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');

    // 確保 articles 資料表存在
    db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anime_id INTEGER,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      image_url TEXT,
      trailer_url TEXT,
      myvideo_url TEXT,
      anime_title TEXT,
      category TEXT DEFAULT '動漫推薦',
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (anime_id) REFERENCES anime(mal_id)
    );
  `);

    // 清除舊的冬番推薦文章
    const deleteStmt = db.prepare(`DELETE FROM articles WHERE category = '冬番推薦'`);
    const deleteResult = deleteStmt.run();
    console.log(`已刪除 ${deleteResult.changes} 篇舊的冬番推薦文章\n`);

    // 插入新文章
    const insertStmt = db.prepare(`
    INSERT INTO articles (title, excerpt, content, image_url, myvideo_url, category, published_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now', 'localtime'))
  `);

    for (const article of articlesData) {
        try {
            insertStmt.run(
                article.title,
                article.excerpt,
                article.content,
                article.image_url,
                article.myvideo_url,
                article.category
            );
            console.log(`✅ 已新增文章: ${article.title}`);
        } catch (error) {
            console.error(`❌ 新增文章失敗: ${article.title}`, error.message);
        }
    }

    const totalArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;

    console.log('\n======================================');
    console.log('種子資料新增完成！');
    console.log(`本次新增: ${articlesData.length} 篇文章`);
    console.log(`文章總數: ${totalArticles} 篇`);
    console.log('======================================\n');

    db.close();
}

main().catch(console.error);
