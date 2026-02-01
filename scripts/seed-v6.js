/**
 * SEED v6.0 - News Reporter Style
 * 
 * Changes:
 * - Removed 分析 category completely
 * - Episode articles = factual content introduction only
 * - No personal opinions (我覺得/我以為/我認為)
 * - News reporter writing style
 * 
 * Image logic: youranimes.tw og:image (do not change)
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');

// ===== EPISODE UPDATES (15 articles) - News Style =====
const episodes = [
    {
        slug: 'frieren-s2-ep1',
        title: '《葬送的芙莉蓮》第二季開播｜北部高原篇正式展開',
        excerpt: '療癒系奇幻冒險續作，芙莉蓮一行人將前往勇者辛美爾長眠之地。',
        image: '/images/anime/frieren-s2.jpg',
        category: '集數更新',
        content: `《葬送的芙莉蓮》第二季於 2026 年 1 月 16 日正式開播，延續第一季劇情，進入「北部旅程篇」。

![葬送的芙莉蓮第二季](/images/anime/frieren-s2.jpg)

## 劇情簡介

繼「一級魔法使考試篇」後，芙莉蓮、費倫、修塔爾克三人將踏上前往北部高原的旅程，目的地是勇者辛美爾長眠的「魂靈沉眠之地」。第二季預計改編漫畫第 61 至 119 話內容。

## 製作資訊

動畫由 Madhouse 製作，導演為北川朋哉，系列構成由鈴木智尋擔任。片頭曲為 Mrs. GREEN APPLE 演唱的「lulu.」，片尾曲為 milet 演唱的「The Story of Us」。

## 播出資訊

日本時間每週五 23:00 播出，台灣地區可透過巴哈姆特動畫瘋、Netflix、Disney+、MyVideo 等平台收看。`
    },
    {
        slug: 'jjk-culling-ep1',
        title: '《咒術迴戰》死滅迴游篇開播｜MAPPA 製作最大規模篇章',
        excerpt: '澀谷事變後的生存遊戲正式展開，虎杖、乙骨等人被捲入其中。',
        image: '/images/anime/jjk-culling.jpg',
        category: '集數更新',
        content: `《咒術迴戰》第三季「死滅迴游篇」於 2026 年 1 月 8 日開播，這是原作中規模最大的戰鬥篇章之一。

![咒術迴戰死滅迴游](/images/anime/jjk-culling.jpg)

## 劇情簡介

澀谷事變後，羂索啟動了「死滅迴游」——一場強制術師參加的生存遊戲。日本各地設置了結界（殖民地），參加者必須透過殺死其他玩家來獲得積分，19 天內積分歸零者將會死亡。虎杖悠仁、伏黑惠、乙骨憂太等人被捲入這場遊戲。

## 製作資訊

動畫由 MAPPA 製作，延續前兩季水準。本季將完整呈現「完美準備篇」至「迴游初期」的劇情。

## 播出資訊

台灣地區可透過 MyVideo、巴哈姆特動畫瘋等平台收看。`
    },
    {
        slug: 'oshi-no-ko-s3-ep1',
        title: '《我推的孩子》第三季開播｜進入原作人氣最高「電影篇」',
        excerpt: '阿奎亞與露比將參與以母親星野愛為題材的電影製作。',
        image: '/images/anime/oshi-no-ko-s3.jpg',
        category: '集數更新',
        content: `《我推的孩子》第三季於 2026 年冬季檔開播，正式進入原作人氣最高的「電影篇」。

![我推的孩子第三季](/images/anime/oshi-no-ko-s3.jpg)

## 劇情簡介

第三季的核心劇情圍繞著電影《15年的謊言》的製作。這部電影將描述已故傳奇偶像星野愛的人生故事，而阿奎亞與露比將直接參與這部電影的製作過程，直面母親的過去與自己的創傷。

## 製作資訊

動畫由動畫工房製作，延續前兩季的高水準表現。本季預期將是系列情感濃度最高的一段。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'fire-force-s3-ep1',
        title: '《炎炎消防隊》參之章開播｜最終章揭開焰人之謎',
        excerpt: '大久保篤原作動畫進入最終章，將揭露焰人真相與傳道者計畫。',
        image: '/images/anime/fire-force-s3.jpg',
        category: '集數更新',
        content: `《炎炎消防隊》參之章第二季度於 2026 年 1 月 9 日開播，劇情正式進入最終章。

![炎炎消防隊參之章](/images/anime/fire-force-s3.jpg)

## 劇情簡介

本季將圍繞焰人之謎、傳道者計畫、人類進化與最終決戰等核心議題展開。第 8 特殊消防隊成員將面臨前所未有的挑戰，關於這個世界的真相也將逐步揭曉。

## 製作資訊

動畫由 David Production 製作，戰鬥場面密度與戲劇張力全面提升。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'polar-opposites-ep1',
        title: '《相反的你和我》開播｜互補型戀愛新作登場',
        excerpt: '阿賀澤紅茶人氣漫畫改編，描述兩個性格相異的高中生之間的戀愛故事。',
        image: '/images/anime/polar-opposites.jpg',
        category: '集數更新',
        content: `《相反的你和我》於 2026 年 1 月 11 日開播，改編自阿賀澤紅茶的人氣戀愛漫畫。

![相反的你和我](/images/anime/polar-opposites.jpg)

## 劇情簡介

故事描述外向卻容易在意他人眼光的女主角「美優」，與冷靜寡言但實際上非常溫柔的男主角「谷」，兩人個性天差地遠，卻因為座位相鄰而在校園生活中逐漸靠近。本作以細膩的情緒刻畫與「互補型戀愛」設定獲得大量粉絲支持。

## 製作資訊

動畫完整呈現原作的甜蜜氛圍。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'torture-princess-s2-ep1',
        title: '《公主殿下，拷問的時間到了》第二季開播｜搞笑日常再開',
        excerpt: '魔王軍的「美食拷問」持續進行，公主依然無法抵抗美食誘惑。',
        image: '/images/anime/torture-princess.jpg',
        category: '集數更新',
        content: `《公主殿下，拷問的時間到了》第二季於 2026 年 1 月 12 日開播，延續第一季的輕鬆搞笑風格。

![公主殿下拷問時間](/images/anime/torture-princess.jpg)

## 劇情簡介

故事設定在魔王軍抓住人類公主後，試圖透過「拷問」逼問國家機密的情境。然而魔王軍的拷問手段卻是——提供美食、泡溫泉、玩遊戲等放鬆活動。公主每次都無法抵抗這些誘惑而說出機密。第二季延續同樣的歡樂模式。

## 製作資訊

本作屬於輕鬆的治癒系喜劇，節奏明快，每集約 10 分鐘左右。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'medalist-ep1',
        title: '《金牌得主》開播｜花式滑冰題材運動動畫',
        excerpt: '失意青年與有天賦的少女，兩人攜手向花式滑冰世界發起挑戰。',
        image: '/images/anime/medalist.jpg',
        category: '集數更新',
        content: `《金牌得主》第二季於 2026 年 1 月開播，繼續描述花式滑冰的熱血故事。

![金牌得主](/images/anime/medalist.jpg)

## 劇情簡介

主角明浦路司曾是有潛力的花式滑冰選手，因故放棄夢想成為冰場工作人員。少女結束祈擁有驚人天賦，卻因「太晚入行」被所有教練放棄。兩人相遇後決定攜手合作，向花式滑冰的頂點發起挑戰。

## 製作資訊

動畫細膩呈現花式滑冰的技術動作與情感表現。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'mf-ghost-s3-ep1',
        title: '《MF Ghost 燃油車鬥魂》第三季開播｜真鶴賽道激戰',
        excerpt: '繼承《頭文字D》精神的賽車動畫，MFG 賽事進入第三戰。',
        image: '/images/anime/mf-ghost-s3.jpg',
        category: '集數更新',
        content: `《MF Ghost 燃油車鬥魂》第三季於 2026 年 1 月開播，MFG 賽事進入「The Peninsula 真鶴」賽道。

![MF Ghost 燃油車鬥魂](/images/anime/mf-ghost-s3.jpg)

## 劇情簡介

《MF Ghost》是《頭文字D》作者重野秀一的新作。故事設定在電動車普及的未來，但賽事「MFG」使用的是「古董」的燃油車。主角片桐夏向駕駛 Toyota 86，與各國超級跑車展開競速。第三季進入技術型賽道真鶴，彎道多且急。

## 製作資訊

動畫結合 CG 與手繪，車輛建模精細。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'vigilantes-s2-ep1',
        title: '《正義使者》第二季開播｜英雄學院外傳作品',
        excerpt: '《我的英雄學院》外傳動畫，聚焦於未持有英雄執照的「義警」。',
        image: '/images/anime/vigilantes.jpg',
        category: '集數更新',
        content: `《正義使者：我的英雄學院之非法英雄》第二季於 2026 年 1 月 5 日開播。

![正義使者第二季](/images/anime/vigilantes.jpg)

## 劇情簡介

本作是《我的英雄學院》的官方外傳，聚焦於那些沒有英雄執照、卻依然在街頭行俠仗義的「義警」。主角灰廻航一雖然沒有強大的個性，卻穿著自製的歐爾麥特裝，在都市暗處對抗犯罪。第二季將進一步挖掘主要角色的成長，並補完與本傳相關的重要事件。

## 製作資訊

與本傳相比，本作調性更街頭、更寫實。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'sentenced-ep1',
        title: '《判處勇者刑》開播｜顛覆傳統勇者設定',
        excerpt: '拯救世界的勇者反被定罪入獄，被迫組成「懲罰勇者隊」繼續作戰。',
        image: '/images/anime/sentenced.jpg',
        category: '集數更新',
        content: `《判處勇者刑 懲罰勇者9004隊刑務紀錄》於 2026 年 1 月開播，改編自同名輕小說。

![判處勇者刑](/images/anime/sentenced.jpg)

## 劇情簡介

傳統的勇者故事中，勇者打敗魔王後通常會獲得榮耀。但本作的設定是：主角札伊德曾是拯救世界的英雄，卻在完成使命後被扣上罪名入獄。為了減刑，他與其他「失敗的勇者」被迫組成「懲罰勇者隊」，繼續與魔王軍作戰。

## 製作資訊

本作屬於黑暗奇幻類型，設定新穎。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'darwin-ep1',
        title: '《達爾文事變》開播｜社會派動畫話題作',
        excerpt: '人猿混種少年進入高中，以獨特視角探討歧視與恐怖主義議題。',
        image: '/images/anime/hidden-gems.jpg',
        category: '集數更新',
        content: `《達爾文事變》於 2026 年冬季檔開播，改編自梅澤旬備受矚目的社會派漫畫。

![達爾文事變](/images/anime/hidden-gems.jpg)

## 劇情簡介

故事主角查理是「Humanzee」——人類與黑猩猩的混血兒，擁有超人的智商和體能。他進入普通高中試圖過正常生活，與同學露西建立友情。但激進的動物權利團體 ALA 盯上了他，試圖利用他達成目的。本作透過查理的視角，探討人性、歧視、恐懼與社會結構等議題。

## 製作資訊

本作兼具懸疑與議題深度，是 2026 年最受期待的全新動改之一。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'hells-paradise-s2-ep1',
        title: '《地獄樂》第二季開播｜極樂淨土之戰延續',
        excerpt: '死刑犯忍者畫眉丸與山田淺ェ門一族，面對更強大的天仙形態。',
        image: '/images/anime/dark-fantasy-rec.jpg',
        category: '集數更新',
        content: `《地獄樂》第二季於 2026 年 1 月 11 日開播，進入「天仙篇」。

![地獄樂第二季](/images/anime/dark-fantasy-rec.jpg)

## 劇情簡介

承接第一季在「極樂淨土」島嶼上的混戰，第二季將進一步深入島嶼核心。死刑犯忍者畫眉丸與山田淺ェ門一族將面對更強大的天仙形態，並揭開整個島嶼的真相。戰鬥密度與畫風都將大幅提升。

## 製作資訊

本作屬於暗黑奇幻、肉搏動作類型。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'jojo-sbr-ep1',
        title: '《飆馬野郎 JOJO的奇妙冒險》開播｜史詩跨洲大賽',
        excerpt: '1890年美國，6000公里的馬匹競賽，JOJO系列第七部終於動畫化。',
        image: '/images/anime/fate-strange-fake.jpg',
        category: '集數更新',
        content: `《飆馬野郎 JOJO的奇妙冒險 1st STAGE》於 2026 年開播，JOJO 系列第七部終於動畫化。

![飆馬野郎 JOJO](/images/anime/fate-strange-fake.jpg)

## 劇情簡介

故事背景設定在 1890 年的美國。一場史無前例的跨洲大賽「SBR」正在舉行，全程長達 6000 公里，是人類首次以騎乘馬匹橫越北美大陸的極限挑戰。五千萬美元的高額獎金吸引來自世界各地的頂尖好手、亡命之徒與冒險家參賽。這不只是比速度的競賽，更是關乎信念、命運與生存的奇妙冒險。

## 製作資訊

本作是獨立世界觀，不需要觀看前作也能理解劇情。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'nube-ep1',
        title: '《靈異教師神眉》後半季開播｜經典作品新動畫',
        excerpt: '揭示「鬼手」的秘密，背景設定更新為現代。',
        image: '/images/anime/seiyuu-rec.jpg',
        category: '集數更新',
        content: `《靈異教師神眉》新作動畫第二季度於 2026 年 1 月 7 日開播。

![靈異教師神眉](/images/anime/seiyuu-rec.jpg)

## 劇情簡介

《靈異教師神眉》是 90 年代的經典妖怪作品，這次的新作動畫將揭示主角神眉老師「鬼手」的秘密，並將背景設定更新為現代。第一季已於 2025 年 7 月開始播放，本季為後半部分。

## 製作資訊

新作動畫同時推出《靈異教師神眉PLUS》新漫畫與各種周邊商品。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    },
    {
        slug: 'hanakimi-ep1',
        title: '《花樣少年少女》開播｜經典少女漫畫首度動畫化',
        excerpt: '中條比紗央里經典作品，女主角女扮男裝進入男校的校園喜劇。',
        image: '/images/anime/game-rec.jpg',
        category: '集數更新',
        content: `《花樣少年少女》於 2026 年 1 月 4 日開播，中條比紗央里經典少女漫畫首度動畫化。

![花樣少年少女](/images/anime/game-rec.jpg)

## 劇情簡介

女主角瑞稀為了接近憧憬的跳高選手佐野泉，女扮男裝進入男校就讀。她意外成為佐野的室友，並在校園內展開多角關係、友情與爆笑事件。本作是少女漫畫史上的經典之一，曾多次被改編為真人版電視劇。

## 製作資訊

動畫完整呈現原作的校園青春氛圍。

## 播出資訊

台灣地區可透過各大串流平台收看。`
    }
];

// ===== COMPREHENSIVE REPORTS (10 articles) =====
const reports = [
    {
        slug: 'dark-fantasy-5',
        title: '【2026冬番盤點】5部黑暗奇幻動畫推薦',
        excerpt: '殘酷世界觀與角色死亡，本季黑暗系作品一覽。',
        image: '/images/anime/jjk-culling.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，黑暗奇幻類型作品數量眾多。以下為本季值得關注的 5 部黑暗系作品。

![黑暗奇幻推薦](/images/anime/jjk-culling.jpg)

## 1. 《咒術迴戰》死滅迴游篇
澀谷事變後的生存遊戲，以殺戮獲取積分的殘酷規則。

## 2. 《判處勇者刑》
拯救世界的勇者反被定罪，設定顛覆傳統。

## 3. 《地獄樂》第二季
極樂淨土的生存戰，暗黑奇幻的肉搏動作。

## 4. 《達爾文事變》
人猿混種少年的社會議題探討，具懸疑深度。

## 5. 《黃金神威》最終章
北海道秘寶爭奪戰的最終篇章。

以上作品皆具有殘酷的世界觀設定，適合喜歡緊張刺激劇情的觀眾。`
    },
    {
        slug: 'healing-anime-5',
        title: '【2026冬番盤點】5部治癒系動畫推薦',
        excerpt: '輕鬆愉快的觀影體驗，適合放鬆心情的作品一覽。',
        image: '/images/anime/polar-opposites.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，治癒系作品同樣豐富。以下為本季值得關注的 5 部治癒系作品。

![治癒系推薦](/images/anime/polar-opposites.jpg)

## 1. 《葬送的芙莉蓮》第二季
療癒系奇幻冒險，節奏舒適。

## 2. 《相反的你和我》
互補型戀愛故事，甜蜜日常。

## 3. 《公主殿下，拷問的時間到了》第二季
搞笑美食番，輕鬆歡樂。

## 4. 《透明男子與人類女孩》
溫馨戀愛喜劇，設定有趣。

## 5. 《吉伊卡哇》
可愛角色的日常生活。

以上作品節奏輕鬆，適合日常觀看。`
    },
    {
        slug: 'action-anime-5',
        title: '【2026冬番盤點】5部最強戰鬥動畫推薦',
        excerpt: '作畫精緻、戰鬥場面密集的動作番一覽。',
        image: '/images/anime/fire-force-s3.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，動作戰鬥類型作品眾多。以下為本季戰鬥場面最精彩的 5 部作品。

![戰鬥動畫推薦](/images/anime/fire-force-s3.jpg)

## 1. 《咒術迴戰》死滅迴游篇
MAPPA 製作，戰鬥密度極高。

## 2. 《炎炎消防隊》參之章
最終章戰鬥規模提升。

## 3. 《地獄樂》第二季
肉搏動作風格。

## 4. 《飆馬野郎 JOJO的奇妙冒險》
替身能力與策略對決。

## 5. 《不死不運》Winter篇
能力系戰鬥番。

以上作品皆具有高水準的動作演出。`
    },
    {
        slug: 'romance-anime-5',
        title: '【2026冬番盤點】5部戀愛動畫推薦',
        excerpt: '甜蜜戀愛故事，本季戀愛番一覽。',
        image: '/images/anime/polar-opposites.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，戀愛類型作品豐富。以下為本季值得關注的 5 部戀愛作品。

![戀愛動畫推薦](/images/anime/polar-opposites.jpg)

## 1. 《相反的你和我》
互補型戀愛，人氣漫畫改編。

## 2. 《輝夜姬想讓人告白 邁向大人的階梯》
人氣作品新篇章。

## 3. 《午夜的傾心旋律》
音樂與戀愛的結合。

## 4. 《我們不可能成為戀人！》續篇
人氣輕小說改編續作。

## 5. 《終究，與你相戀》第二季
純愛故事延續。

以上作品皆為甜蜜戀愛題材。`
    },
    {
        slug: 'sequel-anime-2026',
        title: '【2026冬番盤點】人氣續作回歸一覽',
        excerpt: '本季回歸的人氣作品續作整理。',
        image: '/images/anime/frieren-s2.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，多部人氣作品推出續作。以下為本季回歸的主要續作。

![續作一覽](/images/anime/frieren-s2.jpg)

## 主要續作清單

- 《葬送的芙莉蓮》第二季
- 《咒術迴戰》第三季
- 《我推的孩子》第三季
- 《炎炎消防隊》參之章
- 《地獄樂》第二季
- 《公主殿下，拷問的時間到了》第二季
- 《MF Ghost》第三季
- 《正義使者》第二季
- 《金牌得主》第二季
- 《黃金神威》最終章

以上皆為前作播出後獲得好評的作品續作。`
    },
    {
        slug: 'new-anime-2026',
        title: '【2026冬番盤點】話題新作首播一覽',
        excerpt: '本季首次動畫化的話題新作整理。',
        image: '/images/anime/hidden-gems.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，多部漫畫與輕小說首次動畫化。以下為本季的話題新作。

![新作一覽](/images/anime/hidden-gems.jpg)

## 主要新作清單

- 《達爾文事變》：社會派話題漫畫改編
- 《判處勇者刑》：顛覆勇者設定的奇幻作品
- 《相反的你和我》：人氣戀愛漫畫改編
- 《花樣少年少女》：經典少女漫畫首度動畫化
- 《飆馬野郎》：JOJO系列第七部動畫化

以上皆為原作具有高人氣的作品。`
    },
    {
        slug: 'music-anime',
        title: '【2026冬番盤點】值得關注的主題曲整理',
        excerpt: '本季動畫 OP/ED 主題曲歌手與歌曲資訊。',
        image: '/images/anime/music-rec.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫主題曲陣容豪華。以下為部分值得關注的主題曲資訊。

![主題曲整理](/images/anime/music-rec.jpg)

## 部分主題曲清單

- 《葬送的芙莉蓮》OP：Mrs. GREEN APPLE「lulu.」
- 《葬送的芙莉蓮》ED：milet「The Story of Us」
- 《咒術迴戰》：待公布
- 《我推的孩子》：待公布

更多主題曲資訊將持續更新。`
    },
    {
        slug: 'sakuga-anime',
        title: '【2026冬番盤點】作畫最值得期待的作品',
        excerpt: '本季製作公司與動畫師陣容強大的作品整理。',
        image: '/images/anime/sakuga-rec.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，多部作品由知名製作公司製作。以下為作畫品質值得期待的作品。

![作畫推薦](/images/anime/sakuga-rec.jpg)

## 製作公司與代表作

- **MAPPA**：《咒術迴戰》死滅迴游篇
- **Madhouse**：《葬送的芙莉蓮》第二季
- **David Production**：《炎炎消防隊》參之章
- **動畫工房**：《我推的孩子》第三季

以上製作公司皆有高水準的作畫表現。`
    },
    {
        slug: 'game-anime-2026',
        title: '【2026冬番盤點】遊戲改編動畫一覽',
        excerpt: '本季遊戲改編動畫作品整理。',
        image: '/images/anime/game-rec.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫中，部分作品改編自遊戲。以下為遊戲改編動畫作品。

![遊戲改編](/images/anime/game-rec.jpg)

## 遊戲改編作品

- 《Fate/strange Fake》
- 《GNOSIA》
- 《天穗之咲稻姬》

更多遊戲改編作品將持續更新。`
    },
    {
        slug: 'underrated-2026',
        title: '【2026冬番盤點】容易被忽略的潛力作品',
        excerpt: '話題度較低但品質不俗的作品整理。',
        image: '/images/anime/hidden-gems.jpg',
        category: '綜合報導',
        content: `2026 冬季動畫數量眾多，部分作品雖然話題度較低，但製作品質不俗。以下為值得關注的潛力作品。

![潛力作品](/images/anime/hidden-gems.jpg)

## 推薦作品

- 《達爾文事變》：社會議題深度探討
- 《異國日記》：成熟的家庭題材
- 《TRIGUN STARGAZE》：經典作品新篇章
- 《優雅貴族的休假指南》：輕鬆異世界作品

以上作品雖話題度較低，但各有特色。`
    }
];

// ===== EDITOR'S PICKS (10 articles) =====
const editorPicks = [
    {
        slug: 'top-10-winter-2026',
        title: '【冬番總整理】2026 冬季動畫 TOP 10 必看作品',
        excerpt: '本季最受關注的 10 部動畫作品一覽。',
        image: '/images/anime/frieren-s2.jpg',
        category: '編輯精選',
        content: `2026 冬季動畫陣容堪稱近年最強，以下為本季最受關注的 10 部作品。

![2026冬番TOP10](/images/anime/frieren-s2.jpg)

## TOP 10 清單

1. **《葬送的芙莉蓮》第二季** - 療癒系奇幻冒險續作
2. **《咒術迴戰》死滅迴游篇** - MAPPA 製作的大規模戰鬥篇章
3. **《我推的孩子》第三季** - 進入人氣最高的電影篇
4. **《達爾文事變》** - 社會派話題新作
5. **《炎炎消防隊》參之章** - 最終章開幕
6. **《地獄樂》第二季** - 暗黑奇幻續作
7. **《相反的你和我》** - 甜蜜戀愛新作
8. **《判處勇者刑》** - 顛覆設定的奇幻作品
9. **《飆馬野郎 JOJO的奇妙冒險》** - 系列第七部動畫化
10. **《公主殿下，拷問的時間到了》第二季** - 搞笑日常續作

以上為編輯部精選的本季重點作品。`
    },
    {
        slug: 'complete-guide-winter-2026',
        title: '【完整攻略】2026 冬番 15 部精選作品完整介紹',
        excerpt: '最完整的冬番指南，主要作品詳細資訊一次掌握。',
        image: '/images/anime/frieren-s2.jpg',
        category: '編輯精選',
        content: `2026 冬季動畫共有超過 70 部作品，以下為 15 部精選作品的完整介紹。

---

## 1. 《葬送的芙莉蓮》第二季｜2026年1月16日

延續第一季療癒氛圍，芙莉蓮一行人踏上前往北部高原的旅程。目的地是勇者辛美爾長眠的「魂靈沉眠之地」。第二季預計改編漫畫第 61 至 119 話。由 Madhouse 製作。

## 2. 《咒術迴戰》死滅迴游篇｜2026年1月8日

由 MAPPA 製作。死滅迴游是原作規模最大的篇章，虎杖、伏黑、乙骨等人將在這場以殺戮構成的生存遊戲中迎來終極考驗。

## 3. 《我推的孩子》第三季｜2026年冬季檔

進入原作人氣最高的「電影篇」。阿奎亞與露比將參與以母親星野愛為題材的電影製作，直面過去的創傷。由動畫工房製作。

## 4. 《達爾文事變》｜2026年冬季檔

改編自梅澤旬的社會派漫畫。人猿混種「查理」進入普通高中，透過他的視角揭露人性、歧視與社會結構的問題。

## 5. 《炎炎消防隊》參之章｜2026年1月9日

David Production 製作。最終章揭開焰人之謎、傳道者計畫與人類進化的核心議題，戰鬥場面密度全面提升。

## 6. 《地獄樂》第二季｜2026年1月11日

極樂淨土的混戰延續。畫眉丸與山田淺ェ門將面對更強大的天仙形態，進入「天仙篇」。

## 7. 《相反的你和我》｜2026年1月11日

阿賀澤紅茶的人氣戀愛漫畫改編。外向的美優與內向的谷，兩人個性天差地遠卻逐漸靠近。互補型戀愛的細膩描寫。

## 8. 《公主殿下，拷問的時間到了》第二季｜2026年1月12日

美食拷問、幸福刑具再度登場。輕鬆搞笑的節奏延續，治癒系喜劇回歸。

## 9. 《飆馬野郎 JOJO的奇妙冒險》｜2026年

1890年美國跨洲大賽「SBR」。6000公里的馬匹競賽，JOJO系列第七部動畫化。獨立世界觀，不需觀看前作。

## 10. 《正義使者》第二季｜2026年1月5日

《我的英雄學院》外傳作品。沒有英雄執照的義警們在都市暗處對抗犯罪，調性比本傳更街頭、更寫實。

## 11. 《金牌得主》｜2026年冬季

花式滑冰題材運動番。失意青年與被放棄的天才少女組成拍檔，向著冰上舞台發起挑戰。

## 12. 《MF Ghost》第三季｜2026年

繼承《頭文字D》精神。MFG賽事進入第三戰，技術型賽道的熱血競速。

## 13. 《靈異教師神眉》後半季｜2026年1月7日

經典回歸。揭示「鬼手」的秘密，背景設定更新為現代。

## 14. 《花樣少年少女》動畫版｜2026年1月4日

經典少女漫畫首度動畫化。女扮男裝進男校的爆笑校園劇。

## 15. 《判處勇者刑》｜2026年1月

拯救世界的勇者反被定罪，被迫組成「懲罰勇者隊」繼續作戰。設定顛覆傳統。

---

以上為 2026 冬番精選作品完整介紹。`
    },
    {
        slug: 'action-battle-15',
        title: '【戰鬥派攻略】2026 冬季 15 部戰鬥動畫完整介紹',
        excerpt: '熱血戰鬥番精選，從咒術迴戰到 JOJO 完整收錄。',
        image: '/images/anime/jjk-culling.jpg',
        category: '編輯精選',
        content: `2026 冬季動畫中，戰鬥類型作品眾多。以下為 15 部戰鬥動畫的完整介紹。

---

## 1. 《咒術迴戰》死滅迴游篇
澀谷事變後的生存遊戲正式展開。MAPPA 製作，戰鬥密度極高。

## 2. 《炎炎消防隊》參之章
最終章開幕，戰鬥規模全面提升。David Production 製作。

## 3. 《地獄樂》第二季
天仙篇開戰，暗黑奇幻的肉搏動作。

## 4. 《飆馬野郎 JOJO的奇妙冒險》
替身能力與策略對決，系列第七部動畫化。

## 5. 《不死不運》Winter篇
能力系戰鬥番續作。

## 6. 《黃金神威》最終章
北海道秘寶爭奪戰最終篇章。

## 7. 《正義使者》第二季
英雄學院外傳，街頭戰鬥風格。

## 8. 《判處勇者刑》
黑暗奇幻戰鬥設定。

## 9. 《Fate/strange Fake》
Fate 系列新作，聖杯戰爭題材。

## 10. 《刃牙道：無敵武士》
格鬥漫畫改編。

## 11. 《達爾文事變》
動作與社會議題結合。

## 12. 《青之壬生浪》芹澤暗殺篇
歷史題材動作作品。

## 13. 《大江戶烈火殺手》
江戶時代消防武士故事。

## 14. 《TRIGUN STARGAZE》
經典作品新篇章。

## 15. 《鎧真傳》
機甲動作作品。

---

以上為本季戰鬥動畫完整介紹。`
    },
    {
        slug: 'healing-romance-15',
        title: '【療癒派攻略】2026 冬季 15 部治癒系動畫完整介紹',
        excerpt: '治癒系作品精選，從芙莉蓮到戀愛番完整收錄。',
        image: '/images/anime/polar-opposites.jpg',
        category: '編輯精選',
        content: `2026 冬季動畫中，治癒系與戀愛類型作品豐富。以下為 15 部作品的完整介紹。

---

## 1. 《葬送的芙莉蓮》第二季
療癒系奇幻冒險，節奏舒適。Madhouse 製作。

## 2. 《相反的你和我》
互補型戀愛故事，甜蜜日常。

## 3. 《公主殿下，拷問的時間到了》第二季
搞笑美食番，輕鬆歡樂。

## 4. 《輝夜姬想讓人告白 邁向大人的階梯》
人氣戀愛喜劇新篇章。

## 5. 《午夜的傾心旋律》
音樂與戀愛的結合。

## 6. 《我們不可能成為戀人！》續篇
人氣輕小說改編續作。

## 7. 《終究，與你相戀》第二季
純愛故事延續。

## 8. 《透明男子與人類女孩》
溫馨戀愛喜劇，設定有趣。

## 9. 《異國日記》
成熟的家庭題材作品。

## 10. 《優雅貴族的休假指南》
輕鬆異世界日常。

## 11. 《吉伊卡哇》
可愛角色日常生活。

## 12. 《魔王的女兒太溫柔了》
溫馨親子喜劇。

## 13. 《蘑菇魔女》
治癒系奇幻作品。

## 14. 《打工仔的拷問日常》
職場喜劇。

## 15. 《青梅竹馬的戀愛喜劇無法成立》
青梅竹馬戀愛題材。

---

以上為本季治癒系動畫完整介紹。`
    },
    {
        slug: 'beginner-guide-2026',
        title: '【新手入門】動畫入門推薦作品',
        excerpt: '適合初次接觸日本動畫的觀眾觀看的作品。',
        image: '/images/anime/frieren-s2.jpg',
        category: '編輯精選',
        content: `對於初次接觸日本動畫的觀眾，以下為適合入門的作品推薦。

![入門推薦](/images/anime/frieren-s2.jpg)

## 推薦作品

- 《葬送的芙莉蓮》：療癒系奇幻，節奏舒適
- 《相反的你和我》：甜蜜戀愛故事
- 《公主殿下，拷問的時間到了》：輕鬆喜劇

以上作品劇情不複雜，適合入門觀眾。`
    },
    {
        slug: 'binge-worthy-2026',
        title: '【補番推薦】一口氣看完的動畫作品',
        excerpt: '適合連續觀看的動畫作品推薦。',
        image: '/images/anime/oshi-no-ko-s3.jpg',
        category: '編輯精選',
        content: `以下為適合連續觀看、一口氣追完的動畫作品。

![補番推薦](/images/anime/oshi-no-ko-s3.jpg)

## 推薦作品

- 《咒術迴戰》系列
- 《我推的孩子》系列
- 《地獄樂》系列

以上作品劇情緊湊，適合連續觀看。`
    },
    {
        slug: 'family-watch-2026',
        title: '【闔家觀賞】適合全家觀看的動畫',
        excerpt: '內容適合各年齡層觀眾的作品推薦。',
        image: '/images/anime/torture-princess.jpg',
        category: '編輯精選',
        content: `以下為內容適合全家觀看的動畫作品。

![闔家觀賞](/images/anime/torture-princess.jpg)

## 推薦作品

- 《公主殿下，拷問的時間到了》
- 《吉伊卡哇》
- 《名偵探柯南》系列

以上作品內容適合各年齡層。`
    },
    {
        slug: 'late-night-2026',
        title: '【深夜動畫】成熟題材作品一覽',
        excerpt: '題材較為成熟的深夜放送動畫作品。',
        image: '/images/anime/dark-fantasy-rec.jpg',
        category: '編輯精選',
        content: `以下為題材較為成熟的深夜動畫作品。

![深夜動畫](/images/anime/dark-fantasy-rec.jpg)

## 主要作品

- 《咒術迴戰》死滅迴游篇
- 《地獄樂》第二季
- 《達爾文事變》

以上作品題材較為成熟，適合成人觀眾。`
    },
    {
        slug: 'short-anime-2026',
        title: '【泡麵番】短篇動畫推薦',
        excerpt: '每集約 10 分鐘的短篇動畫作品。',
        image: '/images/anime/torture-princess.jpg',
        category: '編輯精選',
        content: `以下為每集時長較短的動畫作品，適合利用零碎時間觀看。

![短篇動畫](/images/anime/torture-princess.jpg)

## 推薦作品

- 《公主殿下，拷問的時間到了》
- 《吉伊卡哇》
- 《Mofusand貓福珊迪》

以上作品每集約 10 分鐘左右。`
    },
    {
        slug: 'most-anticipated-spring',
        title: '【預告】2026 春番值得期待的作品',
        excerpt: '2026 年春季動畫預告資訊整理。',
        image: '/images/anime/movie-rec.jpg',
        category: '編輯精選',
        content: `2026 年春季動畫已有部分作品公開資訊。以下為目前已知的期待作品。

![春番預告](/images/anime/movie-rec.jpg)

## 目前已公開作品

詳細資訊將持續更新。`
    }
];

async function seed() {
    console.log('🚀 Seeding database with v6 news-style content...');
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

    // No 分析 category
    const allArticles = [...episodes, ...reports, ...editorPicks];

    for (const item of allArticles) {
        insert.run(item.slug, item.title, item.excerpt, item.content, item.image, item.category, 'https://www.myvideo.net.tw/main', 1);
    }

    console.log(`✅ Seeded ${allArticles.length} articles.`);
    console.log('   - 集數更新: ' + episodes.length);
    console.log('   - 綜合報導: ' + reports.length);
    console.log('   - 編輯精選: ' + editorPicks.length);
    console.log('   - 分析: 0 (已刪除)');
}

seed();
