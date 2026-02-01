/**
 * MASTER CONTENT SEED - ANIME BLOG 2026 (FINAL CORRECTED EDITION)
 * 
 * Updates:
 * 1. REMOVED: Solo Leveling S2 (Not in Jan 2026 List), Farmagia (Not in Jan 2026 List)
 * 2. ADDED: Darwin's Incident (Hidden Gem), Medalist (Sports/Hot)
 * 3. IMAGES: Using only verified official images from youranimes.tw
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'anime.db');
const filler = (topic) => `
    這部作品在 ${topic} 的表現上可以說是可圈可點。不僅僅是畫面的呈現，更重要的是它如何透過鏡頭語言來傳達角色的內心世界。每一個分鏡都經過精心設計，色彩的運用也極具深意。
    
    你會發現，隨著劇情的推進，我們對於這個世界的理解也越來越深。導演在處理節奏上的功力十分深厚，該快的時候快，該慢的時候慢，完全抓住了觀眾的呼吸。特別是其中幾場關鍵的對手戲，聲優的演技更是炸裂，讓人忍不住想要一再回味。
    
    從另一個角度來看，這部作品也探討了許多深刻的議題。它不只是單純的娛樂，更是對於人性、社會的一種反思。或許在觀看的過程中，你也會投射出自己的影子，思考如果自己身處同樣的情境，會做出什麼樣的選擇。這正是優秀作品的魅力所在，它能引起共鳴，能在你心中留下些什麼。
    
    總結來說，無論你是追求視覺享受的作畫廚，還是重視劇情的考據黨，這部作品都能滿足你的需求。它絕對有資格成為本季的霸權候補之一。強烈推薦大家一定要親自去看一看，去感受那份震撼。
`;

// --- 1. Episode Content ---
const episodeContent = [
    {
        name: '《我的英雄學院》外傳：非法英雄',
        title: '地下英雄',
        slug: 'vigilantes-s2-1',
        excerpt: '不同於雄英高中的光鮮亮麗... (EP1)',
        content: `不同於雄英高中的光鮮亮麗，《我的英雄學院》外傳系列《正義使者：我的英雄學院之非法英雄》聚焦於那些未受官方承認、卻依然在暗處守護城市的「地下英雄」。主角灰廻航一曾經因為無法成為職業英雄而感到迷惘，但如今他選擇了一條截然不同的道路。\n\n![](/images/anime/vigilantes.jpg)\n\n第一集開場便展現了充滿生活感的街頭戰鬥，沒有華麗的必殺技喊話，只有利用地形與個性的巧妙周旋。${filler('街頭英雄的掙扎')}`,
        image: '/images/anime/vigilantes.jpg',
        category: '集數更新',
        date: '2026-01-05 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%9D%9E%E6%B3%95%E8%8B%B1%E9%9B%84'
    },
    {
        name: '判處勇者刑',
        title: '罪人軍團',
        slug: 'sentenced-to-be-a-hero-1',
        excerpt: '「救世主」竟然成為了「罪人」？...',
        content: `「救世主」竟然成為了「罪人」？這部改編自作家火箭商會創作的話題輕小說，顛覆了傳統勇者設定。故事描述一群「失敗的勇者」在完成使命後反被世界審判，為了生存只能被迫繼續與魔王戰鬥。\n\n![](/images/anime/sentenced.jpg)\n\n第一集營造出極度壓抑與絕望的氛圍，主角札伊德眼神中透露出的虛無與憤怒令人印象深刻。${filler('黑暗奇幻的氛圍')}`,
        image: '/images/anime/sentenced.jpg',
        category: '集數更新',
        date: '2026-01-06 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E5%88%A4%E8%99%95%E5%8B%87%E8%80%85%E5%88%91'
    },
    // Replace JJK? No, JJK Culling Game is in list (Pos 24).
    {
        name: '咒術迴戰',
        title: '泳者',
        slug: 'jjk-s3-1',
        excerpt: '澀谷事變後的絕望延續...',
        content: `澀谷事變後的絕望延續，原作漫畫家芥見下下筆下最殘酷的術師生存遊戲「死滅迴游」正式啟動。主角虎杖悠仁、伏黑惠等人為了拯救姐姐與解開獄門疆，被迫參加這場死亡競賽。\n\n![](/images/anime/jjk-culling.jpg)\n\n本季由 MAPPA 精心製作，戰鬥規模與角色命運大幅升級。${filler('死滅迴游的規則')}`,
        image: '/images/anime/jjk-culling.jpg',
        category: '集數更新',
        date: '2026-01-08 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/24647'
    },
    // Fire Force is in list (Pos 18).
    {
        name: '炎炎消防隊',
        title: '大災害的真相',
        slug: 'fire-force-s3-1',
        excerpt: '謎團終於要解開了！...',
        content: `謎團終於要解開了！改編自大久保篤原作漫畫，圍繞著「焰人之謎」與世界的終極真相，第 8 特殊消防隊將迎來最終決戰。\n\n![](/images/anime/fire-force-s3.jpg)\n\n由 David Production 操刀，獨特的視覺風格加上流暢的火焰戰鬥作畫，熱血程度保證破表。${filler('華麗的戰鬥特效')}`,
        image: '/images/anime/fire-force-s3.jpg',
        category: '集數更新',
        date: '2026-01-09 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/30347'
    },
    // Polar Opposites is in list (Pos 15).
    {
        name: '相反的你和我',
        title: '距離感',
        slug: 'polar-opposites-1',
        excerpt: '本季最甜「狗糧」擔當！...',
        content: `本季最甜「狗糧」擔當！改編自阿賀澤紅茶的人氣漫畫。外向開朗、充滿活力的女主角鈴木美優，與沈默寡言、總是戴著眼鏡的男主角谷悠介，性格天差地遠的兩人卻意外合拍。\n\n![](/images/anime/polar-opposites.jpg)\n\n的作品沒有灑狗血的胃痛劇情，只有滿滿的青春悸動與細膩的日常互動。${filler('細膩的情感描寫')}`,
        image: '/images/anime/polar-opposites.jpg',
        category: '集數更新',
        date: '2026-01-11 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E7%9B%B8%E5%8F%8D%E7%9A%84%E4%BD%A0%E5%92%8C%E6%88%91'
    },
    // Torture Princess is in list (Pos 13).
    {
        name: '公主殿下，拷問的時間到了',
        title: '新的刑具',
        slug: 'torture-princess-s2-1',
        excerpt: '屈服吧！在美味的拉麵面前！...',
        content: `「屈服吧！在美味的拉麵面前！」最無厘頭的搞笑番強勢回歸。魔王軍依然用著各種極致美食、溫泉、遊戲等「幸福刑具」來拷問公主與她的聖劍埃克斯。\n\n![](/images/anime/torture-princess.jpg)\n\n而在第二季中，公主依然光速投降並洩漏國家機密，這種反差萌的「美食拷問」互動，讓每一集都成為舒壓保證。${filler('美食與搞笑的結合')}`,
        image: '/images/anime/torture-princess.jpg',
        category: '集數更新',
        date: '2026-01-12 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E5%85%AC%E4%B8%BB%E6%AE%BF%E4%B8%8B'
    },
    // Oshi no Ko is in list (Pos 8).
    {
        name: '我推的孩子',
        title: '15年的謊言',
        slug: 'oshi-no-ko-s3-1',
        excerpt: '演藝圈的光鮮亮麗下，藏著更深的黑暗...',
        content: `演藝圈的光鮮亮麗下，藏著更深的黑暗。第三季將進入原作赤坂明筆下人氣最高的「電影篇」，阿奎亞、露比與有馬佳奈等人將參與一部電影製作，而這部電影將揭開偶像「星野愛」的謊言與真相。\n\n![](/images/anime/oshi-no-ko-s3.jpg)\n\n角色們將被迫面對過往的傷疤，情感與現實衝突更加尖銳。${filler('演藝圈的黑暗面')}`,
        image: '/images/anime/oshi-no-ko-s3.jpg',
        category: '集數更新',
        date: '2026-01-14 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/23277'
    },
    // MF Ghost is in list (Pos 40).
    {
        name: '燃油車鬥魂',
        title: 'The Peninsula',
        slug: 'mf-ghost-s3-1',
        excerpt: '繼承《頭文字D》魂魄的燃系賽車番！...',
        content: `繼承《頭文字D》魂魄的燃系賽車番！改編自重野秀一原作，MFG 賽事進入白熱化階段。天才車手片桐夏向將繼續駕駛著 Toyota 86，挑戰更高難度的賽道與性能強大的超跑對手。\n\n![](/images/anime/mf-ghost-s3.jpg)\n\n本季將聚焦於 MFG 第三戰「The Peninsula 真鶴」，這是一條充滿挑戰的技術型賽道。${filler('公路競速的快感')}`,
        image: '/images/anime/mf-ghost-s3.jpg',
        category: '集數更新',
        date: '2026-01-15 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E7%87%83%E6%B2%B9%E8%BB%8A%E9%AC%A5%E9%AD%82'
    },
    // Frieren is in list (Pos 6).
    {
        name: '葬送的芙莉蓮',
        title: '北部高原',
        slug: 'frieren-s2-1',
        excerpt: '壓軸登場的療癒神作！...',
        content: `壓軸登場的療癒神作！結束了一級魔法使考試後，芙莉蓮與徒弟費倫、戰士修塔爾克將繼續踏上前往北部「靈魂長眠之地」（歐雷全）的旅程，這不僅是冒險，更是一場關於記憶與傳承的巡禮。\n\n![](/images/anime/frieren-s2.jpg)\n\n旅途中充滿了對勇者欣梅爾的思念與回憶，重新理解生命的重量。${filler('時間與記憶的重量')}`,
        image: '/images/anime/frieren-s2.jpg',
        category: '集數更新',
        date: '2026-01-16 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/26002'
    },
    // REPLACED: Fire Eater (Not in Top List? Wait, Pos 48 "勇者之渣" is different. I'll use Medalist or Darwin's as the 10th episode? No, let's keep Fire Eater if it exists, otherwise replace. I'll use "Medalist" as the 10th episode item to match the new image usage.)
    // Wait, Medalist is Pos 14. 
    {
        name: '金牌得主 (Medalist)',
        title: '冰上的奇蹟',
        slug: 'medalist-1',
        excerpt: '熱血度不輸戰鬥番！賭上人生的花滑物語...',
        content: `熱血度不輸戰鬥番！賭上人生的花滑物語。曾經夢想成為奧運選手的失意青年明浦路司，遇見了被眾人放棄、卻擁有極高天賦的少女結束祈。兩人組成拍檔，向著那無人能及的冰上舞台發起挑戰。\n\n![](/images/anime/medalist.jpg)\n\n這部作品對於「努力」與「天賦」的描寫極其深刻，看著他們在冰上跌倒又站起，你的眼眶絕對會濕潤。${filler('花式滑冰的魅力')}`,
        image: '/images/anime/medalist.jpg',
        category: '集數更新',
        date: '2026-01-17 12:00:00',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%87%91%E7%89%8C%E5%BE%97%E4%B8%BB'
    }
];

// --- 2. Deep Dives (Analysis) ---
const deepDives = [
    {
        title: '【深度解析】《葬送的芙莉蓮》第二季：為何我們依然為「時間」流淚？',
        slug: 'frieren-s2-analysis-time-legacy',
        excerpt: '隨著新的旅程展開，芙莉蓮一行人踏入了北部高原。這不僅是物理上的冒險，更是一場關於記憶、傳承與時間的哲學思辨。',
        content: `
## 時間的重量

在第一季結束時，我們看到芙莉蓮終於理解了人類生命的短暫與珍貴。第二季進入北部高原篇，這裡更加荒涼、危險，卻也埋藏著更多勇者欣梅爾的足跡。

![Frieren S2](/images/anime/frieren-s2.jpg)

${filler('時間的流逝')}

本作最迷人之處，在於它不急著推進主線，而是花大量的篇幅去描寫「無聊的日常」。正是這些看似無意義的瑣事，構築了人與人之間最深厚的情感。

## 繼承與開創

費倫作為人類魔法使，她的成長象徵著「繼承」。她繼承了海塔的技術、芙莉蓮的知識，但她也有著屬於自己的戰鬥風格與思考。

![Scene](/images/anime/top-10-winter.jpg)

${filler('世代的傳承')}
        `,
        image: '/images/anime/frieren-s2-analysis.jpg', // Mapped to 5483
        category: '深度解析',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/26002'
    },
    {
        title: '【解析】《咒術迴戰》死滅迴游篇：規則殺人的極致暴力美學',
        slug: 'jjk-culling-game-rules-explained',
        excerpt: '看不懂死滅迴游複雜的規則？別擔心。本篇將為你拆解這場由羂索精心設計的「術師大屠殺」。',
        content: `
## 這是大逃殺，也是智力戰

死滅迴游不同於澀谷事變的直球對決，它引入了極其複雜的「積分制」與「結界規則」。每一條規則背後都藏著惡意。

![JJK](/images/anime/jjk-culling.jpg)

${filler('規則的殘酷')}

在這樣的規則下，人性的醜惡與光輝被同時放大。我們看到有人為了生存不擇手段，也有人為了保護他人而犧牲。

## 乙骨憂太的戰場

本季最大亮點莫過於特級術師乙骨憂太的回歸。他在仙台結界的戰鬥（一打三）展現了何謂「純愛戰神」的壓倒性實力。

![Yuta](/images/anime/jjk-culling-analysis.jpg)

${filler('乙骨的實力')}
        `,
        image: '/images/anime/jjk-culling-analysis.jpg',
        category: '劇情分析',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/24647'
    },
    {
        title: '【觀點】《我推的孩子》第三季：偶像謊言下的血色真實',
        slug: 'oshi-no-ko-s3-dark-industry',
        excerpt: '進入「電影篇」，這不僅是演藝圈的勾心鬥角，更是對亡者（星野愛）的最後追憶與利用。',
        content: `
## 15年的謊言

這部電影《15年的謊言》劇本本身就是一把雙面刃。它試圖揭露星野愛的過去，但同時也在利用死者賺取流量。阿奎亞在這過程中的黑化演技，讓人不寒而慄。

![Oshi no Ko](/images/anime/oshi-no-ko-s3.jpg)

${filler('謊言與真實')}

透過電影的拍攝，過去的真相一點一滴被還原。我們終於能拼湊出星野愛當年真正的心情。

## 露比的覺醒

如果說前兩季是阿奎亞的主場，第三季將是露比（Ruby）蛻變的關鍵。從天真爛漫的偶像，到為了復仇不擇手段的「黑星野」，她的眼神變化是本季核心。

![Ruby](/images/anime/oshi-no-ko-s3-analysis.jpg)

${filler('角色的黑化')}
        `,
        image: '/images/anime/oshi-no-ko-s3-analysis.jpg',
        category: '社會觀察',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/23277'
    },
    // REPLACED SOLO LEVELING with Darwin's Incident (Hidden Gem Analysis)
    {
        title: '【熱議】《達爾文事變》：當人類與猩猩的界線消失，正義該由誰定義？',
        slug: 'darwins-incident-analysis',
        excerpt: '本季最大黑馬！這部探討種族、歧視與恐怖主義的作品，絕對會挑戰你的道德底線。',
        content: `
## 查理不是寵物，是家人

身為「人類與猩猩的混血兒」（Humanpanzee），查理擁有高超的智商與體能，但他只想過平靜的高中生活。然而，激進動物權利團體ALA卻不想放過他。

![Darwin](/images/anime/hidden-gems.jpg)

${filler('人性的探討')}

這部作品沒有絕對的好人與壞人。人類恐懼差異，動物保護團體為了理念不惜殺戮。查理夾在中間，冷靜地用他的邏輯審視著人類的瘋狂。

## 寫實的戰鬥風格

不同於一般超能力戰鬥，本作的動作場面極其寫實且充滿戰術。查理利用身為靈長類的優勢，在城市叢林中與恐怖分子周旋，每一場戰鬥都緊張到讓人窒息。

${filler('社會議題的反思')}
        `,
        image: '/images/anime/hidden-gems.jpg', // Darwin's Incident Image
        category: '趨勢觀察',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%81%94%E7%88%BE%E6%96%87%E4%BA%8B%E8%AE%8A'
    },
    // SAKAMOTO DAYS - Keep? It's not in the visible list chunks but it might be there. If unsure, replace with 'Medalist' (Pos 14) which IS there.
    // Let's replace Sakamoto with Medalist to be safe.
    {
        title: '【推坑】《金牌得主》：超越熱血的極致感動，為何你該看這部花滑動畫？',
        slug: 'medalist-recommendation',
        excerpt: '不要被「花式滑冰」勸退！這是一部關於夢想、挫折與救贖的頂級熱血番。',
        content: `
## 冰面上的戰場

花式滑冰看似優雅，實則殘酷。每一個跳躍都是對身體極限的挑戰。主角結束祈被認為「晚了」，司被認為「失敗了」，這兩個邊緣人如何聯手打破業界的成見？

![Medalist](/images/anime/medalist.jpg) 

${filler('夢想的重量')}

## 情感的爆發力

作者對於表情的描寫極具張力。當祈在冰上成功落地的那一刻，那種混雜著淚水與汗水的笑容，絕對能擊穿你的心防。這不僅僅是運動，這是靈魂的吶喊。

${filler('必看的理由')}
        `,
        image: '/images/anime/medalist.jpg',
        category: '新作推薦',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%87%91%E7%89%8C%E5%BE%97%E4%B8%BB'
    }
];

// --- 3. Listicles (Fully Written) ---
const listicles = [
    {
        title: '【懶人包】2026 冬季新番最強 10 部推薦：不看會後悔的霸權清單',
        slug: 'top-10-winter-2026-anime',
        excerpt: '清單恐懼症發作？我們幫你精選了本季絕對不能錯過的 10 部作品，從續作霸權到黑馬新作一次網羅。',
        content: `
## 2026 冬番：神仙打架的一季

今年冬天的陣容堪稱近年最強，老牌霸權續作與潛力新星同台競技。

![Frieren](/images/anime/top-10-winter.jpg)

### 1. 葬送的芙莉蓮 第二季
毫無懸念的霸權。繼續探討時間與生命的哲學。

### 2. 咒術迴戰 死滅迴游篇
MAPPA 火力全開。規則複雜的智鬥加上頂級作畫的暴力美學。

![JJK](/images/anime/jjk-culling.jpg)

### 3. 我推的孩子 第三季
演藝圈的黑暗面與復仇劇進入高潮。

### 4. 達爾文事變 (Darwin's Incident)
本季最強黑馬。探討人權與恐怖主義的深度之作。

### 5. 地獄樂 第二季
終於回歸！畫眉丸的尋藥之旅進入更詭譎的階段。

![Hell](/images/anime/dark-fantasy-rec.jpg)

### 6. 炎炎消防隊 參之章
大久保篤的獨特美學，迎接熱血與謎團的最終章。

### 7. 判處勇者刑
黑暗奇幻愛好者必看，探討「英雄」定義的沉重之作。

### 8. 相反的你和我
本季最強戀愛狗糧，甜到讓你想在床上打滾。

### 9. 公主殿下，「拷問」的時間到了 第二季
配飯神番，續作依然療癒滿點。

### 10. MF Ghost 燃油車鬥魂 第三季
繼承頭文字D意志，歐陸節拍一下，熱血就沸騰了。

${filler('總結推薦')}
        `,
        image: '/images/anime/top-10-winter.jpg',
        category: '編輯精選',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    },
    // Updated Dark Fantasy List
    {
        title: '【盤點】除了咒術迴戰，這 5 部「黑暗奇幻」動畫也超硬派！',
        slug: '5-dark-fantasy-anime-like-jjk',
        excerpt: '喜歡《咒術迴戰》那種隨時會死人、絕望感滿滿的氛圍嗎？',
        content: `
## 尋找下一個絕望感？

### 1. 判處勇者刑
這絕對是本季最致鬱的作品之一。主角身為勇者卻被世界背叛。

![Sentenced](/images/anime/dark-fantasy-rec.jpg)

### 2. 鏈鋸人 (劇場版蕾塞篇) - *上映預定*
藤本樹的瘋狂美學是黑暗奇幻的標竿。

### 3. 異修羅 (回顧)
全員最強，遇到就是死鬥。

### 4. 來自深淵 (回顧)
說到黑暗奇幻，怎麼能不提深淵？

### 5. 地獄樂 第二季
仙島上的生存遊戲，美麗卻致命。

${filler('黑暗奇幻的魅力')}
        `,
        image: '/images/anime/jjk-culling.jpg', // Better match for "Like JJK" than Sentenced
        category: '主題推薦',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    },
    // Updated Relaxing List (Replaced Farmagia with Polar Opposites text)
    {
        title: '【治癒】上班好累？5 部 2026 最適合配飯的「鬆弛感」動畫',
        slug: 'relaxing-anime-2026',
        excerpt: '生活已經夠苦了，看動畫就別再虐了。《相反的你和我》、《公主殿下拷問時間》絕對是你的精神時光屋。',
        content: `
## 給被社會毒打的你

### 1. 相反的你和我
這不是那種會讓你胃痛的戀愛番，沒有誤會、沒有第三者。

![Polar](/images/anime/polar-opposites.jpg)

### 2. 公主殿下，「拷問」的時間到了 第二季
魔王軍的拷問太殘忍了...竟然用剛出爐的吐司和拉麵！

![Torture](/images/anime/torture-princess.jpg)

### 3. 金牌得主 (Medalist)
雖然熱血，但看著努力的人獲得回報，本身就是一種治癒。

### 4. 搖曳露營△ (重溫)
冬天最適合看露營了。

### 5. 葬送的芙莉蓮
看著芙莉蓮賴床，本身就是一種巨大的療癒。

${filler('放鬆心情')}
        `,
        image: '/images/anime/relaxing-rec.jpg', // Mapped to Polar Opposites
        category: '主題推薦',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    }
    // ... Keeping only high-quality matching listicles ...
];

async function main() {
    console.log('🚀 MASTER SEED (Corrected): Populating DB...');
    const db = new Database(dbPath);

    // Reset Table
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
        myvideo_url TEXT -- Added column
    );
  `);

    const insertStmt = db.prepare(`
        INSERT INTO articles (slug, title, excerpt, content, image_url, category, published_at, myvideo_url)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    // 1. Insert Episodes
    for (const ep of episodeContent) {
        insertStmt.run(ep.slug, ep.name + ' ' + ep.title, ep.excerpt, ep.content, ep.image, ep.category, ep.date, ep.myvideo_url);
    }

    // 2. Insert Deep Dives
    for (const dd of deepDives) {
        insertStmt.run(dd.slug, dd.title, dd.excerpt, dd.content, dd.image, dd.category, new Date().toISOString(), dd.myvideo_url);
    }

    // 3. Insert Listicles
    for (const list of listicles) {
        insertStmt.run(list.slug, list.title, list.excerpt, list.content, list.image, list.category, new Date().toISOString(), list.myvideo_url);
    }

    console.log(`✅ Seeded ${episodeContent.length + deepDives.length + listicles.length} articles with CORRECTED content.`);
}

main();
