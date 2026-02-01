const db = require('better-sqlite3')('anime.db');

// Helper to find image/link in DB
const findInDb = (keyword) => {
    // Try exact match first, then fuzzy
    const row = db.prepare("SELECT image_url, url FROM myvideo_library WHERE title LIKE ? AND image_url IS NOT NULL ORDER BY length(title) ASC LIMIT 1").get(`%${keyword}%`);
    return row || { image_url: null, url: null };
};

const articles = [
    {
        title: '【MyVideo 2026 新番特輯】1月動畫強力推薦總整理（上篇）',
        excerpt: '霸權續作回歸！這 10 部強檔沒看過，別說你懂 2026 動漫圈！',
        slug: 'jan-2026-editor-pick-part-1',
        items: [
            { t: 'Fate/strange Fake', img: 'http://googleusercontent.com/image_collection/image_retrieval/7612152438612294804_0', desc: '成田良悟執筆，舞台搬到美國西部。由於模仿聖杯戰爭的系統存在缺陷，召喚出了不該存在的職階與從者。「虛偽的聖杯戰爭」將帶來前所未有的戰力通膨與驚喜！' },
            { t: '葬送的芙莉蓮 第二季', img: 'http://googleusercontent.com/image_collection/image_retrieval/11926194420655923320_0', desc: '治癒與思索人生的神作。芙莉蓮與費倫、修塔爾克繼續朝著「了解人類」的旅程前進，這季將迎接更深刻的戰鬥與情感羈絆。' },
            { t: '【我推的孩子】第三季', img: 'http://googleusercontent.com/image_collection/image_retrieval/14069506980362238416_0', desc: '演藝圈的明爭暗鬥升級！B小町爆紅在即，阿奎亞與露比在復仇與成名的道路上越走越遠，真相即將揭曉。', k: '我推的孩子' },
            { t: '咒術迴戰 死滅迴游 前篇', img: null, desc: '澀谷事變後的絕望。羂索發動殘酷的生存遊戲，乙骨憂太正式以「處刑人」身分回歸。純愛戰神與虎杖的正面對決，一觸即發。', k: '咒術迴戰' },
            { t: '炎炎消防隊 參之章', img: 'http://googleusercontent.com/image_collection/image_retrieval/5105849262742436455_0', desc: '最終決戰開幕！森羅與特殊消防隊聯手阻止「大災害」，揭開這個世界的重大祕密。', k: '炎炎消防隊' },
            { t: '輝夜姬想讓人告白 邁向大人的階梯', img: 'http://googleusercontent.com/image_collection/image_retrieval/6815308949558520173_0', desc: '白銀邀請輝夜到新家獨處共進晚餐。傲嬌的天才們，這次是否能跨越那道牆？', k: '輝夜姬' },
            { t: '給不滅的你 第三季', img: null, desc: '不死來到和平的現代世界。在富足的現代，舊日的陰影再次逼近，這是一部跨越千年的生命贊歌。', k: '給不滅的你' },
            { t: 'MF Ghost 燃油車鬥魂 第三季', img: null, desc: '夏向在真鶴決賽前夕手肘受傷。面對諸星瀨名等強敵，他該如何守護 86 的精神？', k: '燃油車鬥魂' },
            { t: '魔都精兵的奴隸 第二季', img: null, desc: '組長全體集結！全新的威脅《八雷神》展開行動，優希與京香的戰鬥（與獎勵）將更加激烈。', k: '魔都精兵' },
            { t: '藍色管弦樂 第二季', img: null, desc: '青春的管弦樂再次奏響。青野一在音樂中尋找自我的救贖，描寫少年少女最細膩的音樂物語。', k: '藍色管弦樂' }
        ]
    },
    {
        title: '【MyVideo 2026 新番特輯】1月動畫強力推薦總整理（下篇）',
        excerpt: '黑馬新作大合輯！從療癒貓咪到重刑勇者，這 10 部非追不可！',
        slug: 'jan-2026-editor-pick-part-2',
        items: [
            { t: '異國日記', img: 'http://googleusercontent.com/image_collection/image_retrieval/17578712444925105828_0', desc: '性格古怪的小說家收留了失去雙親的外甥女。這是一部關於理解、哀悼與生活的細膩傑作，治癒系首選。' },
            { t: '東島丹三郎想成為假面騎士', img: 'http://googleusercontent.com/image_collection/image_retrieval/781370841441328713_0', desc: '40 歲大叔認真玩「假面騎士家家酒」。當惡勢力真的現身，大叔用靈魂展現何謂真正的正義！', k: '假面騎士' },
            { t: '相反的你和我', img: 'http://googleusercontent.com/image_collection/image_retrieval/12768117094904542995_0', desc: '活力少女與文靜少年的超純愛日常。沒有勾心鬥角，只有滿滿的戀愛糖分，看完讓你重拾初戀心情。' },
            { t: '判處勇者刑 懲罰勇者9004隊刑務紀錄', img: 'http://googleusercontent.com/image_collection/image_retrieval/1927102855858857857_0', desc: '重罪犯的最終懲罰——成為勇者！在最前線不斷死而復生與魔王戰鬥，這群罪人如何殺出一片天？', k: '判處勇者刑' },
            { t: '從前從前有隻貓！世界喵童話', img: 'http://googleusercontent.com/image_collection/image_retrieval/518739040224260198_0', desc: '當童話主角通通變成貓！超現實的療癒感，貓奴必收的精神糧食。', k: '有隻貓' },
            { t: '魔術師庫諾看得見一切', img: null, desc: '失明少年用水系魔術重現世界。他的想像力與天賦超越常人，展現魔術與色彩交織的奇幻旅程。', k: '魔術師庫諾' },
            { t: '轉生之後的我變成了龍蛋', img: null, desc: '轉生成一顆蛋！在魔獸森林中求生進化，看一顆蛋如何翻身成為世界最強的龍。', k: '龍蛋' },
            { t: 'GNOSIA', img: null, desc: '宇宙船上的終極人狼遊戲。在疑心暗鬼中選出嫌疑人，保護船員不被「GNOSIA」襲擊。', k: 'GNOSIA' },
            { t: '現在的是哪一個多聞！?', img: null, desc: '追星追到我推家打工，卻發現頂尖偶像私底下超級陰沉？偶像與粉絲之間的爆笑心動喜劇。', k: '多聞' },
            { t: '靠死亡遊戲混飯吃。', img: null, desc: '少女們以命相搏！這是一場與死亡為鄰的專業生存遊戲，贏家拿走獎金，輸家失去生命。', k: '死亡遊戲' }
        ]
    }
];

// Generate and Insert
articles.forEach(art => {
    let content = `## **${art.excerpt}**\n\n---\n\n`;
    let coverImg = null;

    art.items.forEach((item, index) => {
        const keyword = item.k || item.t.split(' ')[0];
        const dbData = findInDb(keyword);

        let img = item.img;
        if (!img) {
            img = dbData.image_url;
            if (img) console.log(`   [Fill Image] ${item.t} => ${img.substring(0, 30)}...`);
            else console.log(`   [Missing Image] ${item.t}`);
        }

        let link = dbData.url || 'https://www.myvideo.net.tw/';
        if (!coverImg && img) coverImg = img;

        // Use placeholder if still no image
        const displayImg = img || '/assets/placeholder.jpg';

        content += `### ${index + 1}. 《${item.t}》\n\n`;
        content += `![${item.t} 劇照](${displayImg})\n\n`;
        content += `**劇情簡介：** ${item.desc}\n\n`;
        content += `<p align="center">👉 <a href="${link}" target="_blank">立即觀看 (MyVideo)</a></p>\n\n`;
        // content += `---\n\n`; // User format doesn't show dividers between items explicitly, but implied by headers? 
        // User example: ### 1. ... \n Image \n Desc \n Button \n\n ### 2.
        // It's cleaner without extra dividers if using H3.
    });

    const stmt = db.prepare(`REPLACE INTO articles (title, content, category, slug, published_at, is_pinned, image_url, excerpt) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 0, ?, ?)`);
    stmt.run(art.title, content, '編輯精選', art.slug, coverImg || '/assets/placeholder.jpg', art.excerpt);
    console.log(`✅ Created ${art.title}`);
});
