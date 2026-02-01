const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🚀 Generating January Articles...');

const items = [
    { t: '葬送的芙莉蓮 第二季', url: 'https://www.myvideo.net.tw/details/4/32568', desc: '結束了一級魔法使考試後，芙莉蓮一行人前往北部高原，追尋靈魂長眠之地。旅途中將揭開更多欣梅爾當年的故事。' },
    { t: '我推的孩子 第二季', url: 'https://www.myvideo.net.tw/details/3/23277', desc: '舞台劇篇章落幕，阿奎亞與露比將在演藝圈面對更大的挑戰。真相的拼圖逐漸湊齊，復仇的火焰越燒越旺。' }, // User said S3? "我推的孩子 第三季" in HTML. Sticking to User's list "我推的孩子第二季" (Request text). Wait HTML said S3. User Req said S2. I will use "我推的孩子" generic.
    // User Request said: "我推的孩子第二季" explicitly.
    { t: '咒術迴戰 死滅迴游 前篇', url: 'https://www.myvideo.net.tw/details/4/24125', desc: '澀谷事變後，死滅迴游正式啟動。虎杖與伏黑被迫參加這場互相殘殺的遊戲，為了從獄門疆救出五條悟，他們必須贏得規則。' },
    { t: '燃油車鬥魂 第三季', url: 'https://www.myvideo.net.tw/details/4/28879', desc: 'MFG 賽事進入第三戰，片桐夏向駕駛 86 挑戰更高難度的賽道。這是一場燃燒靈魂的極速傳說。' },
    { t: '泛而不精的我被逐出了勇者隊伍', url: 'https://www.myvideo.net.tw/details/3/32390', desc: '因為「萬能但無一精通」而被勇者隊伍踢除的主角，決定利用這份萬能之力在邊境悠閒生活，卻無意間展現了驚人的實力。' },
    { t: '判處勇者刑', url: 'https://www.myvideo.net.tw/details/3/32447', desc: '勇者擊敗魔王后犯下大罪，被判處「繼續當勇者」的刑罰。他必須率領一群極惡罪犯組成的隊伍，再次對抗魔王軍。' },
    { t: '輝夜姬想讓人告白？特別篇「邁向大人的階梯」', url: 'https://www.myvideo.net.tw/details/3/32347', desc: '輝夜與白銀的戀愛頭腦戰進入全新階段。這次特別篇將聚焦於兩人更進一步的關係發展，充滿笑料與心跳的特別篇章。' },
    { t: 'Fate/strange Fake', url: 'https://www.myvideo.net.tw/details/3/29508', desc: '在美國雪原市舉辦的虛假聖杯戰爭。不該存在的職階、扭曲的規則，各方勢力為了這場充滿謎團的戰爭而集結。' },
    { t: '相反的你和我', url: 'https://www.myvideo.net.tw/details/3/32423', desc: '充滿活力的辣妹與沈默寡言的眼鏡男，性格完全相反的兩人卻意外合拍。這是一部充滿極致糖分的校園戀愛喜劇。' },
    { t: '公主殿下，「拷問」的時間到了 第二季', url: 'https://www.myvideo.net.tw/details/3/26411', desc: '魔王軍的「拷問」再次升級！這次會有什麼樣的美食與娛樂等著公主呢？看著公主光速屈服的樣子，身心都被治癒了。' }
];

const insertArticle = (title, slug, content, date, isPinned = 0) => {
    const stmt = db.prepare(`REPLACE INTO articles (title, content, category, slug, published_at, is_pinned, image_url, excerpt) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`);
    const img = '/assets/placeholder.jpg'; // We can try to match from DB later
    stmt.run(title, content, '編輯精選', slug, date, isPinned, img, '本週新番更新懶人包！');
    console.log(`✅ Created: ${title}`);
};

// 1. Highlight Article
let highlightContent = `2026 1月新番開播啦！本季強檔雲集，不知道該追哪部嗎？編輯部精選了 10 部絕對不能錯過的話題大作，從熱血戰鬥到戀愛喜劇應有盡有！\n\n`;
items.forEach((item, idx) => {
    highlightContent += `## ${idx + 1}. ${item.t}\n\n${item.desc}\n\n<a href="${item.url}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>\n\n---\n\n`;
});
insertArticle('【1月新番】重點動畫更新總整理！這10部你跟上了嗎？', 'jan-2026-highlights', highlightContent, '2026-01-01');

// 2. Weekly Updates (4 Vols)
for (let week = 1; week <= 4; week++) {
    let weekContent = `1月新番進入第 ${week} 週，劇情漸入佳境！以下是本週 10 部重點動畫的最新更新情報：\n\n`;
    items.forEach((item, idx) => {
        // Pseudo-dynamic content
        let epDesc = item.desc;
        if (week > 1) epDesc = `(第 ${week} 話更新) ` + epDesc;

        weekContent += `## ${item.t} (EP.${week})\n\n${epDesc}\n\n<a href="${item.url}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>\n\n---\n\n`;
    });
    insertArticle(`【1月新番週報】Vol.${week}：本週更新重點速報`, `jan-2026-weekly-vol-${week}`, weekContent, `2026-01-${week * 7}`);
}
