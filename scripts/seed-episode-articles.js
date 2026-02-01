/**
 * 2026 冬番集數文章種子腳本 v14 (Clean & Stable)
 * 
 * Update Log:
 * - Content: Cleaned Markdown (removed HTML tags), strict user source truth.
 * - Images: Reverted to LOCAL files (/images/anime/xxx.jpg) for stability.
 * - Links: Verified IDs where known, encoded Search URLs otherwise.
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'anime.db');

const animeContent = [
    {
        name: '《我的英雄學院》外傳：非法英雄',
        season: '第二季',
        studio: 'Bones',
        updateTime: '每週一 22:00',
        total_episodes: 25,
        tags: ['熱血', '戰鬥', '英雄', '漫改'],
        staff: ['原作：古橋秀之／別天荒人', '製作：Bones'],
        cast: ['灰廻航一：山下大輝'],
        myvideoUrl: 'https://www.myvideo.net.tw/search?keyword=%E9%9D%9E%E6%B3%95%E8%8B%B1%E9%9B%84',
        imageUrl: '/images/anime/vigilantes.jpg',
        credit: 'Bones',
        episodes: [
            {
                ep: 1,
                title: '地下英雄',
                airDate: '2026-01-05',
                synopsis: '不同於雄英高中的光鮮亮麗，《我的英雄學院》外傳系列《正義使者：我的英雄學院之非法英雄》聚焦於那些未受官方承認、卻依然在暗處守護城市的「地下英雄」。主角灰廻航一曾經因為無法成為職業英雄而感到迷惘，但如今他選擇了一條截然不同的道路。第一集開場便展現了充滿生活感的街頭戰鬥，沒有華麗的必殺技喊話，只有利用地形與個性的巧妙周旋。'
            }
        ]
    },
    {
        name: '判處勇者刑',
        season: '',
        studio: 'Studio KAI',
        updateTime: '每週二 23:30',
        tags: ['奇幻', '黑暗', '戰鬥'],
        staff: ['原作：火箭商會', '製作：Studio KAI'],
        cast: ['札伊德：梅原裕一郎'],
        myvideoUrl: 'https://www.myvideo.net.tw/search?keyword=%E5%88%A4%E8%99%95%E5%8B%87%E8%80%85%E5%88%91',
        imageUrl: '/images/anime/sentenced.jpg',
        credit: 'Studio KAI',
        episodes: [
            {
                ep: 1,
                title: '罪人軍團',
                airDate: '2026-01-06',
                synopsis: '「救世主」竟然成為了「罪人」？這部改編自作家火箭商會創作的話題輕小說，顛覆了傳統勇者設定。故事描述一群「失敗的勇者」在完成使命後反被世界審判，為了生存只能被迫繼續與魔王戰鬥。第一集營造出極度壓抑與絕望的氛圍，主角札伊德眼神中透露出的虛無與憤怒令人印象深刻。'
            }
        ]
    },
    {
        name: '咒術迴戰',
        season: '第三季 死滅迴游 前篇',
        studio: 'MAPPA',
        updateTime: '每週四 23:56',
        tags: ['戰鬥', '黑暗', '奇幻'],
        staff: ['原作：芥見下下', '製作：MAPPA'],
        cast: ['虎杖悠仁：榎木淳彌'],
        myvideoUrl: 'https://www.myvideo.net.tw/details/3/24647', // Direct ID
        imageUrl: '/images/anime/jjk-culling.jpg',
        credit: 'MAPPA',
        episodes: [
            {
                ep: 1,
                title: '泳者',
                airDate: '2026-01-08',
                synopsis: '澀谷事變後的絕望延續，原作漫畫家芥見下下筆下最殘酷的術師生存遊戲「死滅迴游」正式啟動。主角虎杖悠仁、伏黑惠等人為了拯救姐姐與解開獄門疆，被迫參加這場死亡競賽。本季由 MAPPA 精心製作，戰鬥規模與角色命運大幅升級。'
            }
        ]
    },
    {
        name: '炎炎消防隊',
        season: '參之章 第二季度',
        studio: 'David Production',
        updateTime: '每週五 01:00',
        tags: ['熱血', '戰鬥', '奇幻'],
        staff: ['原作：大久保篤', '製作：David Production'],
        cast: ['森羅日下部：梶原岳人'],
        myvideoUrl: 'https://www.myvideo.net.tw/details/3/30347', // Direct ID
        imageUrl: '/images/anime/fire-force-s3.jpg',
        credit: 'David Production',
        episodes: [
            {
                ep: 1,
                title: '大災害的真相',
                airDate: '2026-01-09',
                synopsis: '謎團終於要解開了！改編自大久保篤原作漫畫，圍繞著「焰人之謎」與世界的終極真相，第 8 特殊消防隊將迎來最終決戰。主角森羅日下部與弟弟象的關係、傳道者的真實目的都將一一揭曉。由 David Production 操刀，獨特的視覺風格加上流暢的火焰戰鬥作畫，熱血程度保證破表。'
            }
        ]
    },
    {
        name: '相反的你和我',
        season: '',
        studio: 'J.C.Staff',
        updateTime: '每週日 22:30',
        tags: ['戀愛', '校園', '喜劇'],
        staff: ['原作：阿賀澤紅茶', '製作：J.C.Staff'],
        cast: ['鈴木：篠原侑'],
        myvideoUrl: 'https://www.myvideo.net.tw/search?keyword=%E7%9B%B8%E5%8F%8D%E7%9A%84%E4%BD%A0%E5%92%8C%E6%88%91',
        imageUrl: '/images/anime/polar-opposites.jpg',
        credit: 'Shueisha',
        episodes: [
            {
                ep: 1,
                title: '距離感',
                airDate: '2026-01-11',
                synopsis: '本季最甜「狗糧」擔當！改編自阿賀澤紅茶的人氣漫畫。外向開朗、充滿活力的女主角鈴木美優，與沈默寡言、總是戴著眼鏡的男主角谷悠介，性格天差地遠的兩人卻意外合拍。的作品沒有灑狗血的胃痛劇情，只有滿滿的青春悸動與細膩的日常互動。'
            }
        ]
    },
    {
        name: '火喰鳥 羽州破鳶組',
        season: '',
        studio: 'Signal.MD',
        updateTime: '每週日 23:00',
        tags: ['時代', '職人', '熱血'],
        staff: ['原作：今村翔吾'],
        cast: ['松永源吾：小西克幸'],
        myvideoUrl: 'https://www.myvideo.net.tw/search?keyword=%E7%81%AB%E5%96%B0%E9%B3%A5',
        imageUrl: '/images/anime/fire-eater.jpg',
        credit: 'Signal.MD',
        episodes: [
            {
                ep: 1,
                title: '江戶之火',
                airDate: '2026-01-11',
                synopsis: '回到江戶時代，看一群被稱為「破鳶」的消防武士如何用肉身對抗祝融。本作改編自作家今村翔吾的小說，講述江戶時代最具實力的消防武士松永源吾率領「破鳶組」挺身對抗大火的故事。本作結合了嚴謹的歷史考據與熱血的動作場面，展現出日本傳統職人在火場上的帥氣與堅持。'
            }
        ]
    },
    {
        name: '公主殿下，「拷問」的時間到了',
        season: '第二季',
        studio: 'Pine Jam',
        updateTime: '每週一 00:00',
        tags: ['搞笑', '美食', '奇幻'],
        staff: ['原作：春原羅賓遜', '製作：Pine Jam'],
        cast: ['公主：白石晴香'],
        myvideoUrl: 'https://www.myvideo.net.tw/search?keyword=%E5%85%AC%E4%B8%BB%E6%AE%BF%E4%B8%8B',
        imageUrl: '/images/anime/torture-princess.jpg',
        credit: 'Pine Jam',
        episodes: [
            {
                ep: 1,
                title: '新的刑具',
                airDate: '2026-01-12',
                synopsis: '「屈服吧！在美味的拉麵面前！」最無厘頭的搞笑番強勢回歸。魔王軍依然用著各種極致美食、溫泉、遊戲等「幸福刑具」來拷問公主與她的聖劍埃克斯。而在第二季中，公主依然光速投降並洩漏國家機密，這種反差萌的「美食拷問」互動，讓每一集都成為舒壓保證。'
            }
        ]
    },
    {
        name: '【我推的孩子】',
        season: '第三季',
        studio: '動畫工房',
        updateTime: '每週三 23:00',
        tags: ['偶像', '懸疑', '職場'],
        staff: ['原作：赤坂明', '製作：動畫工房'],
        cast: ['阿奎亞：大塚剛央'],
        myvideoUrl: 'https://www.myvideo.net.tw/details/3/23277', // Direct ID
        imageUrl: '/images/anime/oshi-no-ko-s3.jpg',
        credit: 'Doga Kobo',
        episodes: [
            {
                ep: 1,
                title: '15年的謊言',
                airDate: '2026-01-14',
                synopsis: '演藝圈的光鮮亮麗下，藏著更深的黑暗。第三季將進入原作赤坂明筆下人氣最高的「電影篇」，阿奎亞、露比與有馬佳奈等人將參與一部電影製作，而這部電影將揭開偶像「星野愛」的謊言與真相。角色們將被迫面對過往的傷疤，情感與現實衝突更加尖銳。'
            }
        ]
    },
    {
        name: '燃油車鬥魂',
        season: '第三季',
        studio: 'Felix Film',
        updateTime: '每週四 22:30',
        tags: ['賽車', '熱血', '競技'],
        staff: ['原作：重野秀一', '製作：Felix Film'],
        cast: ['片桐夏向：內田雄馬'],
        myvideoUrl: 'https://www.myvideo.net.tw/search?keyword=%E7%87%83%E6%B2%B9%E8%BB%8A%E9%AC%A5%E9%AD%82',
        imageUrl: '/images/anime/mf-ghost-s3.jpg',
        credit: 'Felix Film',
        episodes: [
            {
                ep: 1,
                title: 'The Peninsula',
                airDate: '2026-01-15',
                synopsis: '繼承《頭文字D》魂魄的燃系賽車番！改編自重野秀一原作，MFG 賽事進入白熱化階段。天才車手片桐夏向將繼續駕駛著 Toyota 86，挑戰更高難度的賽道與性能強大的超跑對手。本季將聚焦於 MFG 第三戰「The Peninsula 真鶴」，這是一條充滿挑戰的技術型賽道。'
            }
        ]
    },
    {
        name: '葬送的芙莉蓮',
        season: '第二季',
        studio: 'Madhouse',
        updateTime: '每週五 23:00',
        tags: ['奇幻', '冒險', '治癒'],
        staff: ['原作：山田鐘人', '製作：Madhouse'],
        cast: ['芙莉蓮：種崎敦美'],
        myvideoUrl: 'https://www.myvideo.net.tw/details/3/26002', // Direct ID
        imageUrl: '/images/anime/frieren-s2.jpg',
        credit: 'Madhouse',
        episodes: [
            {
                ep: 1,
                title: '北部高原',
                airDate: '2026-01-16',
                synopsis: '壓軸登場的療癒神作！結束了一級魔法使考試後，芙莉蓮與徒弟費倫、戰士修塔爾克將繼續踏上前往北部「靈魂長眠之地」（歐雷全）的旅程，這不僅是冒險，更是一場關於記憶與傳承的巡禮。旅途中充滿了對勇者欣梅爾的思念與回憶，重新理解生命的重量。'
            }
        ]
    }
];

// Cleaned Pinned Content (Markdown Only, NO HTML)
const pinnedContent = `
2026 年絕對是動漫迷的幸福元年！隨著 **《咒術迴戰》** 正式進入最殘酷的「死滅迴游篇」、治癒神作 **《葬送的芙莉蓮》** 第二季展開北部高原之旅，以及話題大作 **《我推的孩子》** 第三季揭開演藝圈最深層的秘密，你的追番清單是否已經滿到溢出來了呢？無論你是熱血戰鬥派、深度劇情派，還是療癒日常派，本季新番陣容都堪稱近年最豪華。

為了讓大家不漏接任何一部話題大作，MyVideo 特別整理了本季同步跟播的 **10 部必看新番**。我們依照動畫上線時間排序，從硬派熱血動作到細膩校園戀愛應有盡有。趕快把這篇存起來，跟著進度追好追滿，享受最高畫質的觀影體驗！

---

## NO. 1《我的英雄學院》外傳：非法英雄 第二季

![My Hero Academia Vigilantes](/images/anime/vigilantes.jpg)

**2026 / 01 / 05 上線**

不同於雄英高中的光鮮亮麗，《我的英雄學院》外傳系列 **《正義使者：我的英雄學院之非法英雄》** 聚焦於那些未受官方承認、卻依然在暗處守護城市的「地下英雄」。主角群並沒有英雄執照，在法律邊緣遊走，卻擁有比誰都強烈的守護之心。

第二季將更深入描繪灰色地帶的正義抉擇，戰鬥風格更貼近街頭與現實。如果你喜歡原作者 **堀越耕平** 筆下的世界觀，但想看到更成熟、更貼近社會底層的視角，這部由 **古橋秀之** 編劇的作品絕對是硬派觀眾的首選。

---

## NO. 2《判處勇者刑》

![Sentenced to be a Hero](/images/anime/sentenced.jpg)

**2026 / 01 / 06 上線**

「救世主」竟然成為了「罪人」？這部改編自作家 **火箭商會** 創作的話題輕小說，顛覆了傳統勇者設定，曾獲得「這本輕小說真厲害！」殊榮。故事描述一群「失敗的勇者」在完成使命後反被世界審判，為了生存只能被迫繼續與魔王戰鬥。

劇情充滿道德掙扎與人性拷問，世界觀沈重且深刻，探討正義、犧牲與責任的模糊界線。強烈推薦給喜歡深度劇情與「反英雄」題材的觀眾，這將是 2026 年最震撼的暗黑系奇幻動畫。

---

## NO. 3《咒術迴戰》第三季：死滅迴游 前篇

![Jujutsu Kaisen](/images/anime/jjk-culling.jpg)

**2026 / 01 / 08 上線**

澀谷事變後的絕望延續，原作漫畫家 **芥見下下** 筆下最殘酷的術師生存遊戲「死滅迴游」正式啟動。主角 **虎杖悠仁**、**伏黑惠** 等人為了拯救姐姐與解開獄門疆，被迫參加這場死亡競賽。

本季由 **MAPPA** 精心製作，戰鬥規模與角色命運大幅升級。特級術師 **乙骨憂太** 的回歸、以及新角色如 **秤金次**、**鹿紫雲一** 的登場，將徹底改變咒術世界的勢力版圖。每一集都充滿高張力與震撼場面，絕對是年度霸權預定。

---

## NO. 4《炎炎消防隊 參之章》第二季度

![Fire Force](/images/anime/fire-force-s3.jpg)

**2026 / 01 / 09 上線**

謎團終於要解開了！改編自 **大久保篤** 原作漫畫，圍繞著「焰人之謎」與世界的終極真相，第 8 特殊消防隊將迎來最終決戰。主角 **森羅日下部** 與弟弟象的關係、傳道者的真實目的都將一一揭曉。

由 **David Production** 操刀，獨特的視覺風格加上流暢的火焰戰鬥作畫，熱血程度保證破表。本作將動作場面與宗教、科學設定巧妙結合，是喜歡高速戰鬥番與龐大世界觀推進的觀眾必追之作。

---

## NO. 5《相反的你和我》

![Polar Opposites](/images/anime/polar-opposites.jpg)

**2026 / 01 / 11 上線**

本季最甜「狗糧」擔當！改編自 **阿賀澤紅茶** 的人氣漫畫。外向開朗、充滿活力的女主角 **鈴木美優**，與沈默寡言、總是戴著眼鏡的男主角 **谷悠介**，性格天差地遠的兩人卻意外合拍。

作品沒有灑狗血的胃痛劇情，只有滿滿的青春悸動與細膩的日常互動。看著他們笨拙卻真誠的靠近彼此，描寫青春期最真實的情感距離，絕對是治癒身心、放鬆壓力的最佳選擇。

---

## NO. 6《火喰鳥 羽州破鳶組》

![Fire Eater](/images/anime/fire-eater.jpg)

**2026 / 01 / 11 上線**

回到江戶時代，看一群被稱為「破鳶」的消防武士如何用肉身對抗祝融。本作改編自作家 **今村翔吾** 的小說，講述江戶時代最具實力的消防武士 **松永源吾** 率領「破鳶組」挺身對抗大火的故事。

本作結合了嚴謹的歷史考據（如明和大火）與熱血的動作場面，展現出日本傳統職人在火場上的帥氣與堅持。不僅動作戲張力十足，角色間的羈絆與信念衝突也極具看點，推薦給喜歡時代劇與硬派熱血風格的觀眾。

---

## NO. 7《公主殿下，「拷問」的時間到了》第二季

![Torture Princess](/images/anime/torture-princess.jpg)

**2026 / 01 / 12 上線**

「屈服吧！在美味的拉麵面前！」最無厘頭的搞笑番強勢回歸。魔王軍依然用著各種極致美食、溫泉、遊戲等「幸福刑具」來拷問 **公主** 與她的聖劍 **埃克斯**。

而在第二季中，公主依然光速投降並洩漏國家機密（其實都是無關緊要的小事）。這種反差萌的「美食拷問」互動，讓每一集都成為舒壓保證，配飯看剛剛好，讓你從頭笑到尾。

---

## NO. 8《我推的孩子》第三季

![Oshi no Ko](/images/anime/oshi-no-ko-s3.jpg)

**2026 / 01 / 14 上線**

演藝圈的光鮮亮麗下，藏著更深的黑暗。第三季將進入原作 **赤坂明** 筆下人氣最高的「電影篇」，**阿奎亞**、**露比** 與 **有馬佳奈** 等人將參與一部電影製作，而這部電影將揭開偶像「星野愛」的謊言與真相。

角色們將被迫面對過往的傷疤，情感與現實衝突更加尖銳。由 **動畫工房** 製作，阿奎亞的復仇計畫將如何發展？露比在演藝圈的蛻變又是如何？劇情張力與人性刻畫全面升級，將是本季話題討論度最高的作品之一。

---

## NO. 9《燃油車鬥魂》第三季

![MF Ghost](/images/anime/mf-ghost-s3.jpg)

**2026 / 01 / 15 上線**

繼承《頭文字D》魂魄的燃系賽車番！改編自 **重野秀一** 原作，MFG 賽事進入白熱化階段。天才車手 **片桐夏向** 將繼續駕駛著 Toyota 86，挑戰更高難度的賽道與性能強大的超跑對手。

本季將聚焦於 MFG 第三戰「The Peninsula 真鶴」，這是一條充滿挑戰的技術型賽道。引擎聲浪、歐陸節拍（Eurobeat）與極速漂移的視覺快感，絕對能再次點燃你心中的賽車魂，見證技術與意志的極限對決。

---

## NO. 10《葬送的芙莉蓮》第二季

![Frieren](/images/anime/frieren-s2.jpg)

**2026 / 01 / 16 上線**

壓軸登場的療癒神作！結束了一級魔法使考試後，**芙莉蓮** 與徒弟 **費倫**、戰士 **修塔爾克** 將繼續踏上前往北部「靈魂長眠之地」（歐雷全）的旅程，這不僅是冒險，更是一場關於記憶與傳承的巡禮。

旅途中充滿了對勇者 **欣梅爾**的思念與回憶，重新理解生命的重量。由 **Madhouse** 製作的精美畫面，搭配細膩的情感堆疊，將再次溫暖所有觀眾的心，是 2026 年最具口碑潛力的動畫。
`;

async function main() {
    console.log('Seed v14: Clean Content & Stable Images');
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.exec('DROP TABLE IF EXISTS articles');
    db.exec(`
    CREATE TABLE articles (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE,
        title TEXT NOT NULL,
        excerpt TEXT,
        content TEXT NOT NULL,
        image_url TEXT,
        myvideo_url TEXT,
        category TEXT DEFAULT '2026 WINTER ANIME',
        is_pinned INTEGER DEFAULT 0,
        published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        name_jp TEXT, season TEXT, studio TEXT, update_time TEXT, total_episodes INTEGER,
        tags TEXT, staff TEXT, cast TEXT, credit TEXT
    );
  `);

    const insertStmt = db.prepare(`
    INSERT INTO articles (
        slug, title, excerpt, content, image_url, myvideo_url, category, is_pinned, published_at,
        name_jp, season, studio, update_time, total_episodes, tags, staff, cast, credit
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    // 1. Pinned Article
    insertStmt.run(
        '2026-winter-must-watch',
        '2026 必追動畫清單！《咒術迴戰》、《芙莉蓮》、《我推》續作強勢回歸 MyVideo 跟播懶人包',
        '2026 年絕對是動漫迷的幸福元年！隨著《咒術迴戰》正式進入最殘酷的「死滅迴游篇」、治癒神作《葬送的芙莉蓮》第二季展開北部高原之旅，以及話題大作《我推的孩子》第三季揭開演藝圈最深層的秘密，你的追番清單是否已經滿到溢出來了呢？',
        pinnedContent,
        '/images/anime/frieren-s2.jpg',
        'https://www.myvideo.net.tw/search?keyword=2026%E5%86%AC%E7%95%AA',
        '2026 WINTER ANIME',
        1,
        '2025-12-15 10:00:00',
        null, null, null, null, null, null, null, null, null
    );

    // 2. Episodes
    const allEpisodes = [];
    for (const anime of animeContent) {
        for (const ep of anime.episodes) {
            allEpisodes.push({ anime, episode: ep });
        }
    }
    allEpisodes.sort((a, b) => new Date(a.episode.airDate) - new Date(b.episode.airDate));

    for (const item of allEpisodes) {
        const { anime, episode } = item;
        const fullName = anime.season ? `${anime.name} ${anime.season}` : anime.name;
        const title = `${fullName} 第${episode.ep}集`;
        const slug = `${anime.name}-${anime.season || ''}-${episode.ep}`.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9\u4e00-\u9fa5\-]/g, '').toLowerCase();

        try {
            insertStmt.run(
                slug, title, episode.synopsis.substring(0, 100) + '...', episode.synopsis,
                anime.imageUrl, anime.myvideoUrl, '集數更新', 0,
                episode.airDate + ' 12:00:00',
                anime.name_jp, anime.season, anime.studio, anime.updateTime, anime.total_episodes,
                JSON.stringify(anime.tags), JSON.stringify(anime.staff), JSON.stringify(anime.cast), anime.credit
            );
            console.log(`✅ ${title}`);
        } catch (e) {
            console.error(`❌ ${title}: ${e.message}`);
        }
    }
    db.close();
}
main().catch(console.error);
