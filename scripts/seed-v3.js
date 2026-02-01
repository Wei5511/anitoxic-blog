/**
 * SEED v3.0 - Clean Content Edition
 * 
 * Fixes:
 * 1. NO duplicate images (header only, none in markdown body)
 * 2. NO AI-generated images (using MAL official covers only)
 * 3. Tighter, more natural writing style
 * 4. Correct image-content matching
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'anime.db');

// --- Episode Content (10 items) ---
const episodes = [
    {
        slug: 'vigilantes-s2-1',
        title: '《我的英雄學院》外傳：正義使者 EP1 心得',
        excerpt: '不同於雄英高中的光鮮，本作聚焦於那些未受官方承認、卻依然守護街頭的「義警」。',
        content: `第二季首集就展現了完全不同於本傳的世界觀。這裡沒有華麗的校園生活，只有在灰色地帶掙扎的平凡人。

主角灰廻航一曾經因為無法成為職業英雄而迷惘，但他選擇了一條不同的路。穿上自製的歐爾麥特服裝，在夜晚的街頭幫助有困難的人。這種「偽英雄」的設定本身就充滿張力。

開場的街頭戰鬥沒有必殺技喊話，只有利用地形與個性的巧妙周旋。動畫組 Bones Film 在表現這種「生活感」上做得非常到位，讓你感覺這不是動漫，而是紀錄片。

如果你喜歡《我的英雄學院》但又想看點不一樣的，這部絕對不會讓你失望。第一集給個 8/10。`,
        image: '/images/anime/vigilantes.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%9D%9E%E6%B3%95%E8%8B%B1%E9%9B%84'
    },
    {
        slug: 'sentenced-to-be-a-hero-1',
        title: '《判處勇者刑》EP1：救世主成了罪人？',
        excerpt: '這部改編自話題輕小說，顛覆了傳統勇者設定，描述一群「失敗的勇者」被世界背叛的故事。',
        content: `老實說，第一集看完我整個人是懵的。

故事設定非常有意思：一群曾經的「勇者」在完成使命後，不但沒有獲得榮耀，反而被世界審判，關進了監獄。為了減刑，他們被迫組成「懲罰勇者隊」，繼續與魔王軍作戰。

主角札伊德的眼神非常空洞，配上低沉的配樂，整個氛圍壓抑到不行。這不是那種讓你爽快的戰鬥番，而是會讓你思考「什麼是正義」的作品。

作畫方面維持了輕小說改編動畫的平均水準，沒有太多驚豔但也沒有崩壞。配樂很棒，很好地烘托了那種絕望感。

喜歡黑暗奇幻的朋友，這部可以追。`,
        image: '/images/anime/sentenced.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E5%88%A4%E8%99%95%E5%8B%87%E8%80%85%E5%88%91'
    },
    {
        slug: 'jjk-s3-1',
        title: '《咒術迴戰》死滅迴游 EP1：規則殺人開始',
        excerpt: '澀谷事變後的絕望延續，原作最殘酷的術師生存遊戲正式啟動。',
        content: `終於等到了。

澀谷事變打完後，我以為已經夠慘了。結果芥見老師告訴你：這才剛開始。

死滅迴游的規則非常複雜，老實說第一集我也沒完全看懂。簡單來說就是：羂索在日本各地設置了結界，把一堆覺醒了咒力的普通人和古代術師丟進去，讓他們自相殘殺。

這一集主要在解釋規則和鋪陳。作畫方面，MAPPA 這次品質控制得很好，沒有趕工的感覺。

乙骨的登場讓我眼眶濕了。那句「我是特級術師，乙骨憂太」，配合當年劇場版的 BGM 變奏，直接起雞皮疙瘩。

這季會很精彩，我先給個 9/10。`,
        image: '/images/anime/jjk-culling.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/24647'
    },
    {
        slug: 'fire-force-s3-1',
        title: '《炎炎消防隊》第三季 EP1：最終章開幕',
        excerpt: '圍繞「焰人之謎」與世界終極真相，第 8 特殊消防隊將迎來最終決戰。',
        content: `身為原作黨，我一直很擔心動畫能不能還原最終章的史詩感。

結果第一集就讓我放心了。David Production 這次真的拼了，開場的戰鬥場面直接把經費燒給你看。火焰的特效比前兩季更加飽滿，顏色層次也更豐富。

劇情方面進入了世界觀揭露的核心。「地球滅絕」這個概念終於正式提出來了。看著森羅他們意識到自己面對的不只是焰人，而是整個世界的命運，那種重量感壓過來，我整個人都嚴肅起來。

音樂一如既往地出色，梶浦由記的配樂總是能精準踩中情緒點。

如果你是從第一季追過來的，這一季絕對不能錯過。`,
        image: '/images/anime/fire-force-s3.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/30347'
    },
    {
        slug: 'polar-opposites-1',
        title: '《相反的你和我》EP1：本季最甜狗糧',
        excerpt: '沒有狗血、沒有誤會，只有滿滿的青春悸動與細膩日常。',
        content: `每一季我都會找一部「配飯神番」，就是那種不用動腦、看了心情很好的作品。這一季，我找到了。

《相反的你和我》改編自阿賀澤紅茶的人氣漫畫。女主角鈴木美優開朗活潑，男主角谷悠介內向安靜。兩個性格天差地遠的人，卻意外地合拍。

第一集完全沒有狗血劇情，沒有第三者，沒有莫名其妙的誤會。就是兩個人在相處中慢慢產生好感的樣子。

動畫的色調很舒服，人物作畫也很穩定。女主角的表情變化畫得特別細膩，看著她對男主角傻笑的樣子，我也跟著傻笑。

這部我會追到完結。`,
        image: '/images/anime/polar-opposites.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E7%9B%B8%E5%8F%8D%E7%9A%84%E4%BD%A0%E5%92%8C%E6%88%91'
    },
    {
        slug: 'torture-princess-s2-1',
        title: '《公主殿下，拷問的時間到了》S2 EP1',
        excerpt: '「屈服吧！在美味的拉麵面前！」最無厘頭的搞笑番回歸。',
        content: `公主依然秒投降。這就是我們愛的《拷問時間》。

這部動畫的設定非常簡單：魔王軍抓了人類公主，想要逼問國家機密。但他們的「拷問」手段是給公主吃美食、泡溫泉、玩遊戲。然後公主每次都光速投降，把機密說出來。

非常無厘頭，但就是好笑。

第二季第一集延續了這個模式，這次的「刑具」是剛出爐的菠蘿麵包。公主聞到香味的那個表情，我笑了整整30秒。

作為配飯神番，這部完美符合我的需求。10分鐘一集，看完心情很好，不用動腦。推薦給每一個被生活折磨的社畜。`,
        image: '/images/anime/torture-princess.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E5%85%AC%E4%B8%BB%E6%AE%BF%E4%B8%8B'
    },
    {
        slug: 'oshi-no-ko-s3-1',
        title: '《我推的孩子》第三季 EP1：電影篇開始',
        excerpt: '進入粉絲期待已久的「電影篇」，星野愛的謊言即將被揭開。',
        content: `第三季終於來了，而且一開始就是原作人氣最高的「電影篇」。

這部電影《15年的謊言》劇本本身就是一把雙面刃。它試圖揭露星野愛的過去，但同時也在利用死者賺取流量。阿奎亞和露比都被捲入這場風暴。

第一集主要在鋪陳，介紹了電影的製作團隊和演員陣容。熟悉的角色們都回來了，有馬佳奈、MEMcho、黑川茜...每個人都有自己的算盤。

作畫方面，動畫工房依然穩定輸出。那種「光鮮亮麗下的黑暗」氛圍抓得很好。

這一季我最期待的就是阿奎亞和露比的「黑化」演技。原作裡這段非常精彩，希望動畫能完美還原。`,
        image: '/images/anime/oshi-no-ko-s3.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/23277'
    },
    {
        slug: 'mf-ghost-s3-1',
        title: '《MF Ghost 燃油車鬥魂》S3 EP1',
        excerpt: '繼承《頭文字D》魂魄，MFG 賽事進入白熱化階段。',
        content: `如果你懷念《頭文字D》，這部就是你要的。

MF Ghost 是重野秀一的新作，設定在電動車普及的未來，但賽事使用的卻是「古董」的燃油車。主角片桐夏向駕駛著 Toyota 86，在一群法拉利、保時捷中殺出重圍。

第三季進入 MFG 第三戰「The Peninsula 真鶴」。這是一條超高難度的技術型賽道，彎道又多又急。作畫方面延續了前兩季的水準，車輛建模非常精細，山路場景也很有臨場感。

CG 和手繪的結合做得比第一季更自然了，觀看體驗很流暢。

唯一的缺點是劇情進度有點慢，不過身為車迷，我還是會繼續追。`,
        image: '/images/anime/mf-ghost-s3.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E7%87%83%E6%B2%B9%E8%BB%8A%E9%AC%A5%E9%AD%82'
    },
    {
        slug: 'frieren-s2-1',
        title: '《葬送的芙莉蓮》第二季 EP1：北部高原篇',
        excerpt: '本季最受期待的療癒神作。芙莉蓮與徒弟們繼續前往歐雷全的旅程。',
        content: `沒什麼好說的，就是神作。

第二季開場依然是那熟悉的節奏。沒有趕著推進主線，而是花時間描繪旅途中的日常瑣事。芙莉蓮賴床、費倫吐槽、修塔爾克緊張...這些「無聊」的橋段，卻讓人看得心裡暖暖的。

作畫方面，Madhouse 維持了第一季的高水準。北部高原的雪景非常美，那種蒼茫遼闊的感覺完美呈現。

配樂依然是 Evan Call 操刀，延續了第一季的風格但又有新的變化。片頭曲也很好聽。

如果你問我這季最推薦哪一部，我會毫不猶豫地說《芙莉蓮》。這是那種能讓你靜下心來思考人生的作品。`,
        image: '/images/anime/frieren-s2.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/26002'
    },
    {
        slug: 'medalist-1',
        title: '《金牌得主》EP1：冰上的奇蹟開始',
        excerpt: '本季最強運動番，關於夢想、挫折與救贖的花式滑冰物語。',
        content: `原本對「花式滑冰」題材沒什麼興趣，結果第一集就被打臉。

《金牌得主》的故事核心是兩個「失敗者」的相遇。青年明浦路司曾經是有潛力的花滑選手，但因為種種原因放棄了夢想。少女結束祈擁有天賦，卻被所有教練放棄，認為她「太晚入行」。

第一集花了很多篇幅描繪這兩個人的絕望，然後在最後讓他們相遇。那個場面拍得非常有張力，配上緊張的配樂，我整個人都屏住呼吸。

作畫方面，花滑動作的流暢度令人驚豔。不是那種僵硬的 CG，而是非常有表現力的手繪感。

這部我會追，而且我預感它會是本季黑馬。`,
        image: '/images/anime/medalist.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%87%91%E7%89%8C%E5%BE%97%E4%B8%BB'
    }
];

// --- Deep Dives (5 items) ---
const deepDives = [
    {
        slug: 'frieren-s2-analysis',
        title: '【深度解析】《葬送的芙莉蓮》第二季：為何我們為「時間」流淚？',
        excerpt: '這不僅是冒險，更是一場關於記憶、傳承與時間的哲學思辨。',
        content: `## 為什麼這部作品如此特別？

《芙莉蓮》是近年來最獨特的奇幻作品之一。它不講打敗魔王有多帥，而是講打敗魔王之後，那漫長的人生該怎麼過。

第一季結束時，芙莉蓮終於理解了人類生命的短暫與珍貴。第二季進入北部高原篇，這裡更加荒涼、危險，卻也埋藏著更多勇者欣梅爾的足跡。

## 時間的雙面性

作品最核心的主題是「時間」。對精靈芙莉蓮來說，十年不過是一眨眼。但對人類來說，十年是人生的四分之一。

這種時間感的差異，造就了無數令人心碎的場景。當芙莉蓮說「我們下次見」的時候，她不知道那個「下次」可能就是對方的葬禮。

## 第二季的進化

第二季在敘事上更加成熟。不再只是單純地回憶過去，而是開始探討「繼承」與「創新」的平衡。

費倫作為芙莉蓮的弟子，她繼承了師父的魔法，但她也有自己的戰鬥風格。這是一種傳承，也是一種超越。

如果說第一季是「理解過去」，第二季就是「面向未來」。推薦給每一個喜歡思考人生意義的觀眾。`,
        image: '/images/anime/frieren-s2.jpg',
        category: '深度解析',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/26002'
    },
    {
        slug: 'jjk-culling-analysis',
        title: '【解析】《咒術迴戰》死滅迴游：規則殺人的暴力美學',
        excerpt: '看不懂死滅迴游複雜的規則？本篇為你拆解這場術師大屠殺。',
        content: `## 這不是普通的大逃殺

死滅迴游是芥見下下設計的最複雜戰鬥系統。表面上是積分制生存遊戲，實際上是羂索精心設計的「術師淘汰賽」。

基本規則很簡單：殺死其他玩家獲得積分，積分歸零就死。但規則的細節才是致命的。

## 規則背後的惡意

比如「十九天內必須獲得積分」這條規則，看起來合理，實際上是在逼迫玩家主動殺人。還有「可以用積分新增規則」這條，讓整個遊戲變成無限複雜的博弈。

芥見老師真的很懂怎麼折磨角色。在這種規則下，即使是最善良的人，也不得不染上鮮血。

## 乙骨憂太的仙台之戰

本季最大亮點是乙骨在仙台結界的戰鬥。他以一敵三，面對三個古代術師，展現了何謂「特級」的絕對實力。

那句「我是特級術師，乙骨憂太」，配合當年劇場版的配樂變奏，直接讓人起雞皮疙瘩。這就是 MAPPA 的功力。`,
        image: '/images/anime/jjk-culling.jpg',
        category: '劇情分析',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/24647'
    },
    {
        slug: 'oshi-no-ko-s3-analysis',
        title: '【觀點】《我推的孩子》第三季：偶像謊言下的血色真實',
        excerpt: '進入電影篇，這不僅是演藝圈的勾心鬥角，更是對亡者的追憶與利用。',
        content: `## 電影篇為什麼重要？

《15年的謊言》這部作品中的電影，劇本本身就是一把雙面刃。它試圖揭露星野愛的過去，但同時也在利用死者賺取流量。

阿奎亞和露比作為星野愛的孩子，被迫參與這部電影的製作。對他們來說，這不只是工作，更是直面過去創傷的過程。

## 阿奎亞的復仇與掙扎

阿奎亞從第一季開始就一直在追查母親的死因。到了第三季，他離真相越來越近，但他的手段也越來越黑暗。

看著他一步步走向深淵，作為觀眾的心情是非常複雜的。你能理解他，但你也害怕他變成自己最討厭的那種人。

## 露比的覺醒

如果說前兩季是阿奎亞的主場，第三季將是露比蛻變的關鍵。從天真爛漫的偶像，到知道真相後的「黑化」，她的眼神變化是本季最值得關注的演出。

赤坂明老師真的很會寫人性的複雜面。這部作品表面上是偶像題材，實際上是在解剖人心。`,
        image: '/images/anime/oshi-no-ko-s3.jpg',
        category: '社會觀察',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/23277'
    },
    {
        slug: 'darwin-incident-analysis',
        title: '【熱議】《達爾文事變》：當人類與猩猩的界線消失',
        excerpt: '本季最大黑馬，探討種族、歧視與恐怖主義的深度之作。',
        content: `## 這不是一般的異能戰鬥

《達爾文事變》的設定非常大膽：主角查理是人類與黑猩猩的混血兒（Humanzee）。他擁有超人的智商和體能，但他只想過平靜的高中生活。

然而，激進動物權利團體 ALA 卻不想放過他。他們認為查理是「動物解放」的象徵，想要利用他進行恐怖活動。

## 沒有絕對的正義

這部作品最精彩的地方，在於它沒有簡單的善惡二元論。

人類歧視查理，是因為恐懼未知。ALA 為了動物權而殺人，是扭曲的理想主義。查理夾在中間，只能用他冷靜的邏輯審視這一切荒謬。

## 寫實的戰鬥風格

和一般超能力動畫不同，本作的動作場面非常寫實。查理利用靈長類的身體優勢，在城市叢林中與敵人周旋。每一場戰鬥都緊張刺激，沒有多餘的誇張。

這部是本季最被低估的作品，強烈推薦喜歡思考型作品的觀眾。`,
        image: '/images/anime/hidden-gems.jpg',
        category: '趨勢觀察',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%81%94%E7%88%BE%E6%96%87%E4%BA%8B%E8%AE%8A'
    },
    {
        slug: 'medalist-recommendation',
        title: '【推坑】《金牌得主》：超越熱血的極致感動',
        excerpt: '別被「花式滑冰」勸退，這是一部關於夢想、挫折與救贖的頂級作品。',
        content: `## 為什麼你該給這部一個機會？

我知道很多人看到「花式滑冰」這個題材就直接跳過。但請相信我，《金牌得主》的故事核心不是運動，而是「人」。

主角明浦路司曾經是有潛力的選手，但因為種種原因放棄了夢想，變成了一個在冰場打雜的失意青年。少女結束祈擁有天賦，卻被所有教練放棄，因為她「太晚入行」。

## 兩個失敗者的相遇

第一集的結尾，當司第一次看到祈在冰上滑行的姿態，他愣住了。那不是標準的姿勢，但那是純粹的熱愛。

那一刻，兩個被世界否定的人，在彼此身上看到了可能性。這種「相互救贖」的設定，比任何熱血宣言都更打動人心。

## 作畫的表現力

動畫在表現花滑動作上下了很大功夫。不是那種死板的 CG，而是非常有表現力的手繪感。角色的表情變化尤其細膩，你可以從他們的眼神中讀出情緒。

這部是我本季的私心推薦。即使你對運動番沒興趣，也請給它三集的機會。`,
        image: '/images/anime/medalist.jpg',
        category: '新作推薦',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%87%91%E7%89%8C%E5%BE%97%E4%B8%BB'
    }
];

// --- Listicles (3 items) ---
const listicles = [
    {
        slug: 'top-10-winter-2026',
        title: '【懶人包】2026 冬季新番 TOP 10：本季必追清單',
        excerpt: '選擇困難症發作？我們精選了本季不能錯過的 10 部作品。',
        content: `## 神仙打架的一季

2026 冬季的陣容堪稱近年最強。續作霸權與潛力新星同台競技，讓人難以抉擇。這篇就來幫你整理一下，哪些是真的值得追的。

### 1. 葬送的芙莉蓮 第二季
毫無懸念的霸權。繼續探討時間與生命的哲學，畫面依然美到哭。

### 2. 咒術迴戰 死滅迴游篇
MAPPA 火力全開。規則複雜的智鬥配上頂級作畫，每一集都是享受。

### 3. 我推的孩子 第三季
演藝圈黑暗面與復仇劇進入高潮。電影篇是原作人氣最高的篇章。

### 4. 達爾文事變
本季最強黑馬。探討人權與恐怖主義的深度之作，題材超有新意。

### 5. 金牌得主
運動番的新標竿。花式滑冰題材，但故事核心是人性的光輝。

### 6. 炎炎消防隊 第三季
大久保篤的獨特美學，迎接最終章的熱血與謎團。

### 7. 判處勇者刑
黑暗奇幻愛好者必看，顛覆傳統勇者設定的反套路之作。

### 8. 相反的你和我
本季最強戀愛狗糧。沒有狗血，只有甜。

### 9. 公主殿下，拷問的時間到了 第二季
配飯神番續作，依然治癒滿點。

### 10. MF Ghost 燃油車鬥魂 第三季
繼承頭文字 D 意志的硬核賽車番。

以上就是我的個人推薦。當然每個人口味不同，歡迎在評論區分享你的必追清單！`,
        image: '/images/anime/frieren-s2.jpg',
        category: '編輯精選',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    },
    {
        slug: 'dark-fantasy-list',
        title: '【盤點】除了咒術迴戰，這 5 部黑暗奇幻也超硬派',
        excerpt: '喜歡那種隨時會死人、絕望感滿滿的氛圍嗎？這篇適合你。',
        content: `## 給喜歡被虐的你

如果你和我一樣，看動畫就是要看那種「隨時有人領便當」的刺激感，那這篇整理的 5 部作品絕對適合你。

### 1. 判處勇者刑（本季）
勇者拯救世界後卻被判罪？這設定光看就覺得胃痛。主角眼神超空洞，整部作品的壓抑感非常到位。

### 2. 鏈鋸人 劇場版：蕾塞篇（預定）
藤本樹的瘋狂美學就是黑暗奇幻的標竿。蕾塞篇是原作人氣最高的短篇，期待動畫化。

### 3. 異修羅（回顧）
「全員最強」的設定聽起來很中二，但實際看下來每場戰鬥都是你死我活的極限對決。

### 4. 來自深淵（經典推薦）
說到黑暗奇幻怎麼能不提這部？越往下越絕望的設定，配上可愛的畫風，反差到讓人心碎。

### 5. 地獄樂 第二季（本季）
仙島上的生存遊戲，美麗卻致命。第二季終於回歸，畫眉丸的尋藥之旅進入更詭譎的階段。

喜歡虐心劇情的朋友，這幾部夠你看一陣子了。不過建議配點甜番調劑，不然心臟可能受不了。`,
        image: '/images/anime/jjk-culling.jpg',
        category: '主題推薦',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    },
    {
        slug: 'relaxing-anime-2026',
        title: '【治癒】上班好累？5 部適合配飯的鬆弛感動畫',
        excerpt: '生活已經夠苦了，看動畫就別再虐自己了。這幾部保證讓你放鬆。',
        content: `## 給被社會毒打的你

每天下班回家，腦子已經轉不動了。這時候需要的不是燒腦神作，而是能讓你躺著看、看完心情很好的「配飯神番」。

### 1. 相反的你和我（本季強推）
這不是那種會讓你胃痛的戀愛番。沒有誤會、沒有第三者，就是兩個人甜甜的互動。看完會想談戀愛。

### 2. 公主殿下，拷問的時間到了 第二季
魔王軍的拷問太殘忍了...竟然用剛出爐的吐司和拉麵！公主每次秒投降的樣子超好笑。

### 3. 葬送的芙莉蓮
雖然主題有點沉重，但節奏非常舒服。看著芙莉蓮一行人慢慢旅行，心情會跟著平靜下來。

### 4. 搖曳露營△（經典回顧）
冬天最適合看露營了。躺在被窩裡看她們在野外煮泡麵，幸福感爆棚。

### 5. 間諜家家酒（回顧）
安妮亞的表情包永遠有效。需要笑一下的時候，隨便點一集都能讓你開心。

這幾部都是我的私藏片單，推薦給每一個需要被治癒的你。記得準備好零食，然後好好放鬆吧。`,
        image: '/images/anime/polar-opposites.jpg',
        category: '主題推薦',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    }
];

async function seed() {
    console.log('🚀 Seeding database with clean content...');
    const db = new Database(dbPath);

    db.exec('DROP TABLE IF EXISTS articles');
    db.exec(`
        CREATE TABLE articles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            slug TEXT UNIQUE,
            title TEXT NOT NULL,
            excerpt TEXT,
            content TEXT NOT NULL,
            image_url TEXT,
            category TEXT,
            published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            myvideo_url TEXT,
            is_pinned INTEGER DEFAULT 0
        );
    `);

    const insert = db.prepare(`
        INSERT INTO articles (slug, title, excerpt, content, image_url, category, myvideo_url, is_pinned)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // Episodes (not pinned)
    for (const ep of episodes) {
        insert.run(ep.slug, ep.title, ep.excerpt, ep.content, ep.image, ep.category, ep.myvideo_url, 0);
    }

    // Deep Dives (pinned)
    for (const dd of deepDives) {
        insert.run(dd.slug, dd.title, dd.excerpt, dd.content, dd.image, dd.category, dd.myvideo_url, 1);
    }

    // Listicles (pinned)
    for (const list of listicles) {
        insert.run(list.slug, list.title, list.excerpt, list.content, list.image, list.category, list.myvideo_url, 1);
    }

    console.log(`✅ Seeded ${episodes.length + deepDives.length + listicles.length} articles.`);
    console.log('   - Episodes: ' + episodes.length);
    console.log('   - Deep Dives: ' + deepDives.length);
    console.log('   - Listicles: ' + listicles.length);
}

seed();
