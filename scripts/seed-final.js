/**
 * SEED FINAL - 50+ Articles for Launch
 * Categories: 分析、集數更新、綜合報導、編輯精選
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');

// ===== PART 1: Episode Updates (15 articles) =====
const episodes = [
    { slug: 'frieren-s2-ep1', title: '《葬送的芙莉蓮》第二季 EP1 心得', excerpt: '療癒神作回歸，北部高原篇正式開始。', image: '/images/anime/frieren-s2.jpg', category: '集數更新' },
    { slug: 'jjk-culling-ep1', title: '《咒術迴戰》死滅迴游篇 EP1 心得', excerpt: '最殘酷的生存遊戲，MAPPA火力全開。', image: '/images/anime/jjk-culling.jpg', category: '集數更新' },
    { slug: 'oshi-no-ko-s3-ep1', title: '《我推的孩子》第三季 EP1 心得', excerpt: '電影篇開幕，星野愛的真相即將揭曉。', image: '/images/anime/oshi-no-ko-s3.jpg', category: '集數更新' },
    { slug: 'fire-force-s3-ep1', title: '《炎炎消防隊》參之章 EP1 心得', excerpt: '最終章序幕，焰人之謎即將解開。', image: '/images/anime/fire-force-s3.jpg', category: '集數更新' },
    { slug: 'polar-opposites-ep1', title: '《相反的你和我》EP1 心得', excerpt: '本季最甜戀愛番，沒有狗血只有糖。', image: '/images/anime/polar-opposites.jpg', category: '集數更新' },
    { slug: 'torture-princess-s2-ep1', title: '《公主殿下，拷問的時間到了》S2 EP1 心得', excerpt: '美食拷問再開，公主依然秒投降。', image: '/images/anime/torture-princess.jpg', category: '集數更新' },
    { slug: 'medalist-ep1', title: '《金牌得主》EP1 心得', excerpt: '花式滑冰題材黑馬，兩個失敗者的相遇。', image: '/images/anime/medalist.jpg', category: '集數更新' },
    { slug: 'mf-ghost-s3-ep1', title: '《MF Ghost》第三季 EP1 心得', excerpt: '繼承頭文字D魂魄，真鶴賽道開戰。', image: '/images/anime/mf-ghost-s3.jpg', category: '集數更新' },
    { slug: 'vigilantes-s2-ep1', title: '《正義使者》第二季 EP1 心得', excerpt: '英雄學院外傳，街頭義警的掙扎。', image: '/images/anime/vigilantes.jpg', category: '集數更新' },
    { slug: 'sentenced-ep1', title: '《勇者刑處刑》EP1 心得', excerpt: '顛覆勇者設定，救世主成了罪人。', image: '/images/anime/sentenced.jpg', category: '集數更新' },
    { slug: 'darwin-ep1', title: '《達爾文事變》EP1 心得', excerpt: '人猿混種的校園生活，社會派黑馬。', image: '/images/anime/hidden-gems.jpg', category: '集數更新' },
    { slug: 'hells-paradise-s2-ep1', title: '《地獄樂》第二季 EP1 心得', excerpt: '極樂淨土再開，天仙篇正式開戰。', image: '/images/anime/dark-fantasy-rec.jpg', category: '集數更新' },
    { slug: 'jojo-sbr-ep1', title: '《JOJO的奇妙冒險 飆馬野郎》EP1 心得', excerpt: '史詩級跨洲大賽，第七部終於動畫化。', image: '/images/anime/fate-strange-fake.jpg', category: '集數更新' },
    { slug: 'nube-ep1', title: '《靈異教師神眉》後半季 EP1 心得', excerpt: '經典回歸，鬼手的秘密即將揭曉。', image: '/images/anime/seiyuu-rec.jpg', category: '集數更新' },
    { slug: 'hanakimi-ep1', title: '《花樣少年少女》EP1 心得', excerpt: '經典少女漫畫首度動畫化，女扮男裝進男校。', image: '/images/anime/game-rec.jpg', category: '集數更新' }
];

// ===== PART 2: Analysis Articles (15 articles) =====
const analysis = [
    { slug: 'frieren-time-analysis', title: '【深度解析】《芙莉蓮》為何讓我們為「時間」流淚？', excerpt: '探討這部作品獨特的敘事魅力與情感深度。', image: '/images/anime/frieren-s2.jpg', category: '分析' },
    { slug: 'jjk-rules-explained', title: '【規則解說】《咒術迴戰》死滅迴游完整規則拆解', excerpt: '看不懂死滅迴游？這篇幫你整理所有規則。', image: '/images/anime/jjk-culling.jpg', category: '分析' },
    { slug: 'oshi-no-ko-dark-idol', title: '【觀點】《我推的孩子》偶像產業的黑暗面', excerpt: '赤坂明如何用漫畫解剖演藝圈的殘酷。', image: '/images/anime/oshi-no-ko-s3.jpg', category: '分析' },
    { slug: 'darwin-society', title: '【社會議題】《達爾文事變》的歧視與恐怖主義', excerpt: '這部作品如何挑戰我們對「人權」的定義。', image: '/images/anime/hidden-gems.jpg', category: '分析' },
    { slug: 'medalist-dream', title: '【運動番推坑】《金牌得主》為何能打動人心', excerpt: '不只是花滑，更是關於夢想與救贖的故事。', image: '/images/anime/medalist.jpg', category: '分析' },
    { slug: 'fire-force-final', title: '【終章解析】《炎炎消防隊》世界觀與結局考察', excerpt: '焰人的真相、傳道者的目的完整整理。', image: '/images/anime/fire-force-s3.jpg', category: '分析' },
    { slug: 'jojo-sbr-guide', title: '【入門指南】第一次看《飆馬野郎》該知道的事', excerpt: '第七部獨立世界觀，不用補前作也能看。', image: '/images/anime/fate-strange-fake.jpg', category: '分析' },
    { slug: 'vigilantes-vs-mha', title: '【比較】《正義使者》與《英雄學院》本傳的差異', excerpt: '同一世界觀，截然不同的敘事風格。', image: '/images/anime/vigilantes.jpg', category: '分析' },
    { slug: 'dark-fantasy-trend', title: '【趨勢觀察】2026年黑暗奇幻動畫為何這麼多？', excerpt: '從《咒術》到《地獄樂》，黑暗系的崛起。', image: '/images/anime/dark-fantasy-rec.jpg', category: '分析' },
    { slug: 'romance-anime-2026', title: '【戀愛番分析】《相反的你和我》的甜蜜配方', excerpt: '為何這部戀愛番能讓人看得這麼舒服？', image: '/images/anime/polar-opposites.jpg', category: '分析' },
    { slug: 'comedy-healing', title: '【治癒系解析】《公主殿下》為何是最佳配飯番', excerpt: '無厘頭喜劇的療癒力量。', image: '/images/anime/torture-princess.jpg', category: '分析' },
    { slug: 'mappa-jjk-quality', title: '【製作分析】MAPPA 的《咒術迴戰》品質如何？', excerpt: '從澀谷事變到死滅迴游，作畫品質變化。', image: '/images/anime/jjk-culling.jpg', category: '分析' },
    { slug: 'madhouse-frieren', title: '【製作分析】Madhouse 如何打造《芙莉蓮》的美學', excerpt: '那些讓人驚嘆的畫面是怎麼做出來的。', image: '/images/anime/frieren-s2.jpg', category: '分析' },
    { slug: 'anime-movie-2026', title: '【劇場版整理】2026年值得期待的動畫電影', excerpt: '從鏈鋸人蕾塞篇到其他話題作品。', image: '/images/anime/movie-rec.jpg', category: '分析' },
    { slug: 'seiyuu-spotlight', title: '【聲優特輯】2026冬番的豪華聲優陣容', excerpt: '這季的卡司太豪華，來認識一下。', image: '/images/anime/seiyuu-rec.jpg', category: '分析' }
];

// ===== PART 3: Comprehensive Reports (10 articles) =====
const reports = [
    { slug: 'dark-fantasy-5', title: '【盤點】除了咒術迴戰，這5部黑暗奇幻也超硬派', excerpt: '喜歡虐心劇情？這幾部一樣讓你心臟痛。', image: '/images/anime/jjk-culling.jpg', category: '綜合報導' },
    { slug: 'healing-anime-5', title: '【治癒系】上班好累？5部讓你放鬆的配飯神番', excerpt: '社畜必備，看完心情超好。', image: '/images/anime/polar-opposites.jpg', category: '綜合報導' },
    { slug: 'action-anime-5', title: '【戰鬥番】2026冬季5部作畫最強的動作番', excerpt: '就是要看打架打得爽的。', image: '/images/anime/fire-force-s3.jpg', category: '綜合報導' },
    { slug: 'romance-anime-5', title: '【戀愛番】5部讓你甜到發胖的2026戀愛動畫', excerpt: '單身狗慎入，糖分超標。', image: '/images/anime/polar-opposites.jpg', category: '綜合報導' },
    { slug: 'sequel-anime-2026', title: '【續作特輯】2026年回歸的人氣續作一覽', excerpt: '這些你等很久的作品終於回來了。', image: '/images/anime/frieren-s2.jpg', category: '綜合報導' },
    { slug: 'new-anime-2026', title: '【新番推薦】2026年必追的原創新作', excerpt: '不是續作，但一樣精彩。', image: '/images/anime/hidden-gems.jpg', category: '綜合報導' },
    { slug: 'music-anime', title: '【主題曲特輯】2026冬番最好聽的OP/ED', excerpt: '這季的音樂太棒了，來聽聽看。', image: '/images/anime/music-rec.jpg', category: '綜合報導' },
    { slug: 'sakuga-anime', title: '【作畫廚必看】2026冬番的神作畫場面', excerpt: '這些場面讓你想慢速回放100次。', image: '/images/anime/sakuga-rec.jpg', category: '綜合報導' },
    { slug: 'game-anime-2026', title: '【遊戲改編】2026年的遊戲改編動畫盤點', excerpt: '原作玩家期待嗎？來看看改編成果。', image: '/images/anime/game-rec.jpg', category: '綜合報導' },
    { slug: 'underrated-2026', title: '【遺珠推薦】這5部2026冬番被嚴重低估', excerpt: '大家都在追霸權，這幾部被忽略了。', image: '/images/anime/hidden-gems.jpg', category: '綜合報導' }
];

// ===== PART 4: Editor's Picks - Comprehensive (10 articles, 3 with 15 anime each) =====
const editorPicks = [
    { slug: 'top-10-winter-2026', title: '【懶人包】2026冬季新番TOP 10必追清單', excerpt: '選擇困難症？看這篇就對了。', image: '/images/anime/frieren-s2.jpg', category: '編輯精選' },
    { slug: 'complete-guide-winter-2026', title: '【完整版】2026冬番60部全攻略：15部精選深度介紹', excerpt: '最完整的冬番指南，從霸權到黑馬一網打盡。', image: '/images/anime/top-10-winter.jpg', category: '編輯精選', isComprehensive: true },
    { slug: 'action-battle-15', title: '【戰鬥派】2026冬季15部最強戰鬥動畫完整推薦', excerpt: '熱血沸騰的戰鬥番精選，從咒術到JOJO。', image: '/images/anime/jjk-culling.jpg', category: '編輯精選', isComprehensive: true },
    { slug: 'healing-romance-15', title: '【療癒派】2026冬季15部治癒系動畫完整推薦', excerpt: '看完心情很好的作品精選，從芙莉蓮到戀愛番。', image: '/images/anime/polar-opposites.jpg', category: '編輯精選', isComprehensive: true },
    { slug: 'beginner-guide-2026', title: '【新手入門】第一次看動畫該從哪開始？', excerpt: '給剛入坑的朋友，這幾部最適合。', image: '/images/anime/frieren-s2.jpg', category: '編輯精選' },
    { slug: 'binge-worthy-2026', title: '【補番推薦】趁冬假一口氣看完的10部神作', excerpt: '放假就是要補番，這些不看會後悔。', image: '/images/anime/oshi-no-ko-s3.jpg', category: '編輯精選' },
    { slug: 'family-watch-2026', title: '【闔家觀賞】可以跟爸媽一起看的動畫推薦', excerpt: '不怕尷尬，全家都適合看。', image: '/images/anime/torture-princess.jpg', category: '編輯精選' },
    { slug: 'late-night-2026', title: '【深夜動畫】2026冬季深夜放送的成人向作品', excerpt: '給大人看的動畫，題材較成熟。', image: '/images/anime/dark-fantasy-rec.jpg', category: '編輯精選' },
    { slug: 'short-anime-2026', title: '【泡麵番】10分鐘內就能看完的短篇動畫', excerpt: '時間不多？這些短短甜甜剛剛好。', image: '/images/anime/torture-princess.jpg', category: '編輯精選' },
    { slug: 'most-anticipated-spring', title: '【預告】2026春番最期待的10部作品', excerpt: '冬番還沒追完，春番又來了。', image: '/images/anime/movie-rec.jpg', category: '編輯精選' }
];

// Content generator function
function generateContent(item) {
    // Base content that's more blogger-like
    const templates = {
        '集數更新': `寫在追番之前，先說說我對這部作品的期待。

${item.title.includes('芙莉蓮') ? '《葬送的芙莉蓮》第二季終於開播了。延續第一季的療癒氛圍，這次芙莉蓮一行人將踏上前往北部高原的旅程。' : ''}
${item.title.includes('咒術') ? '等了這麼久，死滅迴游終於來了。MAPPA這次的作畫品質控制得很好，開場就直接把氣氛拉滿。' : ''}
${item.title.includes('我推') ? '第三季進入電影篇，阿奎亞和露比將面對更複雜的局面。這一季的情感濃度肯定會是系列之最。' : ''}

![${item.title}](${item.image})

看完第一集的感想是，這一季應該會很精彩。製作組很明顯用了心，無論是作畫還是配樂都維持了應有的水準。

如果你還在猶豫要不要追這部，我的建議是：**先看三集再決定**。很多作品需要一點時間鋪陳，不能只看第一集就下定論。

下週繼續追，期待後續發展！`,

        '分析': `寫這篇文章的時候，我反覆思考了很久。${item.title}這個題目其實涵蓋了很多層面，想要講清楚並不容易。

## 為什麼要寫這篇

很多朋友問我關於這個話題的看法，所以決定整理成一篇文章。畢竟在社群上零散地回覆，不如系統性地寫下來。

![分析圖](${item.image})

## 核心觀點

從我的觀察來看，這部作品之所以能夠引起這麼多討論，主要有幾個原因。首先是題材本身就很有話題性，其次是製作組的用心，最後是剛好踩中了現在觀眾的喜好。

當然，每個人的看法不同，這只是我個人的分析。歡迎在評論區分享你的想法。

## 結語

總之，這是一部值得認真看待的作品。如果你還沒看過，推薦去試試。`,

        '綜合報導': `每次寫這種盤點文章，我都會花很多時間思考要選哪些作品。畢竟推薦這種事情很主觀，不可能滿足所有人。

${item.excerpt}

![推薦圖](${item.image})

## 我的選擇標準

首先，這些作品必須是我自己看過並且喜歡的。其次，要考慮不同觀眾的喜好，盡量涵蓋不同類型。最後，製作品質也是重要的考量。

以下是我精選的作品，排名不分先後。每一部都有它獨特的魅力，希望你能找到適合自己的。

### 入選作品簡介

由於篇幅有限，我只能簡單介紹每部作品。如果對特定作品有興趣，歡迎留言，我可以再寫專文。

喜歡這篇文章的話，記得分享給你的朋友！`,

        '編輯精選': `這篇是編輯部精心整理的推薦文章。我們花了很多時間討論、篩選，希望能給大家一份有參考價值的清單。

${item.excerpt}

![精選圖](${item.image})

## 編輯的話

選擇這些作品的原因很簡單：它們都是我們團隊成員真心喜歡、並且會推薦給身邊朋友的作品。

以下是完整的推薦清單，希望對你有幫助。

### 不藏私推薦

我們沒有收任何業配費（笑），純粹是因為這些作品真的很好看。如果你有不同的推薦，也歡迎在評論區分享。

祝大家追番愉快！`
    };

    // For comprehensive articles (15 anime), generate longer content
    if (item.isComprehensive) {
        return generateComprehensiveContent(item);
    }

    return templates[item.category] || templates['綜合報導'];
}

function generateComprehensiveContent(item) {
    return `每到新的一季，最讓人頭痛的就是「這麼多新番，到底該追哪些？」這個問題。

放心，這篇文章就是來幫你解決這個煩惱的。我們整理了 15 部本季最值得關注的作品，從製作班底到故事簡介，一篇看完就能決定你的追番清單。

![${item.title}](${item.image})

---

## 1. 《葬送的芙莉蓮》第二季｜2026年1月16日

延續第一季的療癒氛圍，芙莉蓮一行人踏上前往北部高原的旅程。這不僅是物理上的冒險，更是一場關於記憶與時間的哲學思辨。Madhouse的作畫品質依然頂尖，每一幀都可以當桌布。

## 2. 《咒術迴戰》死滅迴游篇｜2026年1月8日

MAPPA火力全開。死滅迴游是原作規模最大的篇章，虎杖、伏黑、乙骨等人將在這場以殺戮構成的生存遊戲中迎來終極考驗。規則複雜但精彩，戰鬥密度極高。

## 3. 《我推的孩子》第三季｜2026年冬季檔

進入原作人氣最高的「電影篇」。阿奎亞與露比將在演藝圈迎來更劇烈的變化，身分、野心與過去真相都將推向新的節點。預期是系列情感濃度最高的一季。

## 4. 《達爾文事變》｜2026年冬季檔

改編自梅澤旬的社會派漫畫。人猿混種「查理」進入普通高中，透過他的視角揭露人性、歧視與社會結構的問題。題材獨特，是本季最受期待的全新動改。

## 5. 《炎炎消防隊》參之章｜2026年1月9日

David Production的誠意之作。最終章揭開焰人之謎、傳道者計畫與人類進化的核心議題，戰鬥場面密度與戲劇張力全面提升。

## 6. 《地獄樂》第二季｜2026年1月11日

極樂淨土的混戰延續。畫眉丸與山田淺ェ門將面對更強大的天仙形態，暗黑奇幻的肉搏動作觀眾必看。

## 7. 《相反的你和我》｜2026年1月11日

阿賀澤紅茶的人氣戀愛漫畫改編。外向的美優與內向的谷，兩人個性天差地遠卻逐漸靠近。互補型戀愛的細膩描寫，是戀愛番裡的討論度保證。

## 8. 《公主殿下，拷問的時間到了》第二季｜2026年1月12日

美食拷問、幸福刑具再度登場。輕鬆搞笑的節奏延續，治癒系配飯神番回歸。

## 9. 《JOJO的奇妙冒險 飆馬野郎》｜2026年

1890年美國跨洲大賽「SBR」。五千萬美元的高額獎金吸引各路好手，這不只是比速度的競賽，更是關乎信念與命運的奇妙冒險。

## 10. 《正義使者》第二季｜2026年1月5日

《我的英雄學院》外傳作品。沒有英雄執照的義警們在都市暗處對抗犯罪，調性比本傳更街頭、更寫實。

## 11. 《金牌得主》｜2026年冬季

花式滑冰題材的運動番。失意青年與被放棄的天才少女組成拍檔，向著冰上舞台發起挑戰。情感表現極具張力。

## 12. 《MF Ghost》第三季｜2026年

繼承《頭文字D》魂魄。MFG賽事進入第三戰，技術型賽道的熱血競速延續。

## 13. 《靈異教師神眉》後半季｜2026年1月7日

經典回歸。揭示「鬼手」的秘密，背景設定更新為現代。

## 14. 《花樣少年少女》動畫版｜2026年1月4日

經典少女漫畫首度動畫化。女扮男裝進男校的爆笑校園劇展開。

## 15. 《火喰鳥 羽州破鳶組》｜2026年1月11日

以今村翔吾小說為基礎，江戶時代消防武士的熱血故事。聲優陣容豪華。

---

## 結語

以上就是我們精選的15部作品。從療癒奇幻到熱血戰鬥，從浪漫戀愛到社會議題，這一季的類型非常多元。

希望這篇文章能幫助你決定追番清單。如果有任何問題或想討論的，歡迎在評論區留言！

**祝大家追番愉快！**`;
}

async function seed() {
    console.log('🚀 Seeding database with 50+ articles...');
    const db = new Database(dbPath);

    db.exec('DROP TABLE IF EXISTS articles');
    db.exec(`
        CREATE TABLE articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE, title TEXT NOT NULL, excerpt TEXT,
            content TEXT NOT NULL, image_url TEXT, category TEXT,
            published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            myvideo_url TEXT, is_pinned INTEGER DEFAULT 0
        );
    `);

    const insert = db.prepare(`
        INSERT INTO articles (slug, title, excerpt, content, image_url, category, myvideo_url, is_pinned)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const allArticles = [...episodes, ...analysis, ...reports, ...editorPicks];

    for (const item of allArticles) {
        const content = generateContent(item);
        insert.run(item.slug, item.title, item.excerpt, content, item.image, item.category, 'https://www.myvideo.net.tw/main', 1);
    }

    console.log(`✅ Seeded ${allArticles.length} articles.`);
    console.log('   - 集數更新: ' + episodes.length);
    console.log('   - 分析: ' + analysis.length);
    console.log('   - 綜合報導: ' + reports.length);
    console.log('   - 編輯精選: ' + editorPicks.length);
}

seed();
