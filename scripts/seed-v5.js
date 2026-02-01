/**
 * SEED v5.0 - Final Corrected Edition
 * 
 * Fixes:
 * 1. Correct anime images (not manga covers, not Korean versions)
 * 2. Episode titles without invented subtitles
 * 3. Proper categories: 分析、集數更新、綜合報導、編輯精選
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'anime.db');

// --- Episode Content (10 items) - No invented subtitles ---
const episodes = [
    {
        slug: 'vigilantes-s2-1',
        title: '《正義使者：我的英雄學院外傳》第二季 EP1 心得',
        excerpt: '不同於雄英高中的光鮮亮麗，本作聚焦於那些未受官方承認的「義警」。',
        content: `昨晚熬夜看完第一集，不得不說這部外傳的氛圍和本傳完全不一樣。

## 關於這部作品

《正義使者》（Vigilantes）是《我的英雄學院》的官方外傳，聚焦於那些沒有英雄執照、卻依然想要幫助他人的「義警」。主角灰廻航一不是天才，也沒有強大的個性，他只是一個普通的大學生，穿著自製的歐爾麥特服裝在街頭巡邏。

![正義使者第二季](/images/anime/vigilantes.jpg)

這個設定本身就超有意思。在這個世界觀裡，沒有執照的英雄活動是違法的，但航一還是選擇這麼做。為什麼？第一集花了很多篇幅在探討這個問題。

## 作畫與氛圍

Bones Film 這次的作畫風格比較偏寫實，少了本傳那種華麗的必殺技演出，但街頭戰鬥的臨場感非常強。配樂方面延續了本傳的風格，但整體更加低調。

第一集我給 **8/10**，期待後續發展！`,
        image: '/images/anime/vigilantes.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E6%AD%A3%E7%BE%A9%E4%BD%BF%E8%80%85'
    },
    {
        slug: 'sentenced-to-be-a-hero-1',
        title: '《勇者刑處刑》EP1 心得',
        excerpt: '這部改編自話題輕小說，顛覆了傳統勇者設定。',
        content: `這部動畫的設定真的太有意思了，讓我一口氣看完還意猶未盡。

## 顛覆你對「勇者」的認知

傳統的勇者故事：勇者打敗魔王 → 拯救世界 → 獲得榮耀。但這部作品告訴你：勇者打敗魔王 → 被世界審判 → 關進監獄。是不是很扯？

![勇者刑處刑](/images/anime/sentenced.jpg)

主角札伊德曾經是拯救世界的英雄，但在完成使命後，他被扣上了莫須有的罪名，和一群「失敗的勇者」一起被關進了監獄。為了減刑，他們被迫組成「懲罰勇者隊」，繼續與魔王軍作戰。

## 壓抑的氛圍

第一集的氛圍非常壓抑。札伊德的眼神超級空洞，你可以感受到他對世界的絕望。配樂也很沉重，沒有一般異世界番那種輕快感。

第一集給 **7.5/10**，後續潛力很大。`,
        image: '/images/anime/sentenced.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E5%8B%87%E8%80%85%E5%88%91'
    },
    {
        slug: 'jjk-s3-1',
        title: '《咒術迴戰》死滅迴游篇 EP1 心得',
        excerpt: '澀谷事變後的絕望延續，死滅迴游篇終於來了。',
        content: `等了這麼久，死滅迴游終於開播了！作為原作黨，我真的超級興奮。

## 這一季的重要性

澀谷事變結束後，咒術界已經是一片廢墟。五條悟被封印、夏油傀儡暴走、無數術師犧牲。但這還不是最糟的——羂索啟動了「死滅迴游」，一場強制參加的術師生存遊戲。

![咒術迴戰死滅迴游](/images/anime/jjk-culling.jpg)

簡單解釋一下規則：羂索在日本各地設置了結界（殖民地），把一堆覺醒了咒力的普通人和古代術師丟進去。殺死對手獲得積分，19天內積分歸零就會死。

## MAPPA 的表現

作畫品質這次控制得很好，沒有趕工的感覺。戰鬥場面依然是 MAPPA 家的招牌——流暢、帥氣、暴力美學拉滿。

第一集給 **9/10**，這一季一定要追！`,
        image: '/images/anime/jjk-culling.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/24647'
    },
    {
        slug: 'fire-force-s3-1',
        title: '《炎炎消防隊》第三季 EP1 心得',
        excerpt: '謎團終於要解開了！第 8 特殊消防隊迎來最終決戰。',
        content: `身為從第一季就追過來的老粉，看到最終章開播真的很感動。

## 三年的等待

《炎炎消防隊》是大久保篤的代表作之一，從 2019 年第一季到現在，終於進入最終章。這一季將揭開所有謎團：焰人的真相、傳道者的目的、以及這個世界的終極秘密。

![炎炎消防隊第三季](/images/anime/fire-force-s3.jpg)

第一集開場就直接把氣氛拉滿。「地球滅絕」這個概念正式提出，森羅他們終於意識到自己面對的不只是焰人，而是整個世界的存亡。

## David Production 的誠意

作畫比前兩季更精緻了。火焰特效的層次更豐富，戰鬥場面的運鏡也更有張力。

第一集給 **8.5/10**，值得追！`,
        image: '/images/anime/fire-force-s3.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/30347'
    },
    {
        slug: 'polar-opposites-1',
        title: '《相反的你和我》EP1 心得',
        excerpt: '沒有狗血、沒有誤會，只有滿滿的青春悸動。',
        content: `每一季我都會找一部「配飯神番」，就是那種不用動腦、看了心情很好的作品。這一季，找到了！

## 簡單卻不平凡的設定

女主角鈴木美優：開朗活潑、充滿活力、人緣超好。
男主角谷悠介：內向安靜、總是戴著眼鏡、存在感很低。

這兩個性格天差地遠的人，因為座位相鄰而開始互動。沒有什麼命中注定、沒有什麼狗血轉折，就是兩個人在相處中慢慢產生好感。

![相反的你和我](/images/anime/polar-opposites.jpg)

聽起來很普通對吧？但就是這種「普通」最治癒。

## 女主角太可愛了

美優的表情變化畫得超細膩。那種對男主角傻笑的樣子，每一個畫面都讓人心動。

第一集給 **8/10**，推薦給所有需要被甜到的人！`,
        image: '/images/anime/polar-opposites.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E7%9B%B8%E5%8F%8D%E7%9A%84%E4%BD%A0%E5%92%8C%E6%88%91'
    },
    {
        slug: 'torture-princess-s2-1',
        title: '《公主殿下，拷問的時間到了》第二季 EP1 心得',
        excerpt: '「屈服吧！在美味的拉麵面前！」最無厘頭的搞笑番回歸。',
        content: `公主依然秒投降。這就對了。

## 10 分鐘的快樂

這部動畫的設定超級無厘頭：魔王軍抓了人類公主，想要逼問國家機密。聽起來很嚴肅對吧？但他們的「拷問」手段是——給公主吃美食、泡溫泉、玩遊戲。

然後公主每次都光速投降，把機密說出來。

![公主殿下拷問時間](/images/anime/torture-princess.jpg)

第二季第一集延續了這個歡樂模式。這次的「刑具」是剛出爐的菠蘿麵包。公主聞到香味的時候，那個表情我真的笑了好久。

推薦給每一個被生活折磨的社畜。

第一集給 **8/10**，期待更多「殘忍」的美食拷問！`,
        image: '/images/anime/torture-princess.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E5%85%AC%E4%B8%BB%E6%AE%BF%E4%B8%8B'
    },
    {
        slug: 'oshi-no-ko-s3-1',
        title: '《我推的孩子》第三季 EP1 心得',
        excerpt: '進入粉絲期待已久的「電影篇」，星野愛的謊言即將被揭開。',
        content: `等了好久的第三季終於開播了。電影篇是原作人氣最高的篇章，期待值滿滿！

## 這一季的核心劇情

第三季進入「電影篇」。劇中的電影《15年的謊言》將揭露星野愛（阿奎亞和露比的母親）的過去。這不僅是一部電影，更是阿奎亞和露比直面過去創傷的過程。

![我推的孩子第三季](/images/anime/oshi-no-ko-s3.jpg)

第一集主要在鋪陳電影的製作背景，介紹了參與的演員和導演。熟悉的角色們都回來了：有馬佳奈、MEMcho、黑川茜...

## 氛圍把握得很好

動畫工房延續了前兩季的高水準。表面上光鮮亮麗的演藝圈場景，底下卻透著一股不安的氣息。

第一集給 **8.5/10**，這一季必追！`,
        image: '/images/anime/oshi-no-ko-s3.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/23277'
    },
    {
        slug: 'mf-ghost-s3-1',
        title: '《MF Ghost 燃油車鬥魂》第三季 EP1 心得',
        excerpt: '繼承《頭文字D》魂魄，MFG 賽事進入白熱化階段。',
        content: `如果你懷念《頭文字D》的熱血，這部就是你要的。

## 設定簡介

MF Ghost 是《頭文字D》作者重野秀一的新作。故事設定在電動車普及的未來，但賽事「MFG」使用的卻是「古董」的燃油車。

![MF Ghost 燃油車鬥魂](/images/anime/mf-ghost-s3.jpg)

主角片桐夏向駕駛著 Toyota 86，在一群法拉利、保時捷、藍寶堅尼中殺出重圍。第三季進入 MFG 第三戰「The Peninsula 真鶴」，這是一條技術型賽道，彎道又多又急。

## 作畫表現

CG 和手繪的結合比第一季更自然了。車輛建模非常精細，你可以認出每一台車的型號。

背景音樂用了很多歐陸節拍風格的電子樂，配上高速過彎的畫面，熱血度直接拉滿。

第一集給 **7.5/10**，繼續追！`,
        image: '/images/anime/mf-ghost-s3.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E7%87%83%E6%B2%B9%E8%BB%8A%E9%AC%A5%E9%AD%82'
    },
    {
        slug: 'frieren-s2-1',
        title: '《葬送的芙莉蓮》第二季 EP1 心得',
        excerpt: '本季最受期待的療癒神作。旅程繼續，時間依然流逝。',
        content: `沒什麼好說的，就是神作。第二季開播，我又可以每週被治癒一次了。

## 延續第一季的質感

第二季開場依然是那熟悉的節奏。沒有趕著推進主線，而是花時間描繪旅途中的日常瑣事。芙莉蓮賴床、費倫吐槽、修塔爾克緊張...這些「無聊」的橋段，卻讓人看得心裡暖暖的。

![葬送的芙莉蓮第二季](/images/anime/frieren-s2.jpg)

北部高原的雪景非常美。Madhouse 的作畫依然是業界頂尖水準，每一個畫面都可以截圖當桌布。

## 本季必追

如果你問我這季最推薦哪一部，我會毫不猶豫地說《芙莉蓮》。這是那種能讓你靜下心來思考人生的作品。

第一集給 **9.5/10**，神作就是神作。`,
        image: '/images/anime/frieren-s2.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/26002'
    },
    {
        slug: 'medalist-1',
        title: '《金牌得主》EP1 心得',
        excerpt: '本季最強運動番。這不只是花式滑冰，這是關於人生的故事。',
        content: `原本對「花式滑冰」題材沒什麼興趣，結果第一集就被打臉。這部太好看了。

## 兩個失敗者的相遇

故事的核心是兩個「被世界放棄的人」的相遇。

青年明浦路司曾經是有潛力的花滑選手，但因為種種原因放棄了夢想，現在只是一個在冰場打雜的失意青年。少女結束祈擁有驚人的天賦，卻被所有教練放棄，因為她「太晚入行」。

![金牌得主](/images/anime/medalist.jpg)

第一集花了很多篇幅描繪這兩個人的絕望，然後在結尾讓他們相遇。當司第一次看到祈在冰上滑行的姿態，他愣住了。那不是標準的姿勢，但那是純粹的熱愛。

那一刻，兩個被世界否定的人，在彼此身上看到了可能性。我整個人直接被擊中。

第一集給 **9/10**，本季最大驚喜！`,
        image: '/images/anime/medalist.jpg',
        category: '集數更新',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%87%91%E7%89%8C%E5%BE%97%E4%B8%BB'
    }
];

// --- Deep Dives (Analysis) - Category: 分析 ---
const deepDives = [
    {
        slug: 'frieren-s2-analysis',
        title: '【深度解析】《葬送的芙莉蓮》第二季：為何我們為「時間」流淚？',
        excerpt: '這不僅是冒險，更是一場關於記憶、傳承與時間的哲學思辨。',
        content: `寫這篇文章的時候，我剛看完第二季的最新一集，眼眶還是紅的。《芙莉蓮》到底有什麼魔力，能讓這麼多人為一部「節奏很慢」的作品流淚？

## 為什麼這部作品如此特別

大部分奇幻作品講的是「打敗魔王」的過程，《芙莉蓮》講的是「打敗魔王之後」的人生。勇者一行人已經完成了使命，然後呢？對於活了千年的精靈芙莉蓮來說，那場持續十年的冒險，不過是漫長人生中的一小段。

但就是這「一小段」，成為了她生命中最珍貴的回憶。

![葬送的芙莉蓮第二季](/images/anime/frieren-s2.jpg)

## 時間的雙面性

作品最核心的主題是「時間」。對精靈來說，十年是一眨眼。對人類來說，十年是人生的四分之一。

這種時間感的差異，造就了無數令人心碎的場景。當芙莉蓮淡淡地說「我們下次見」的時候，她不知道那個「下次」可能就是對方的葬禮。

推薦給每一個喜歡思考人生意義的觀眾。這是 2026 年的必看神作。`,
        image: '/images/anime/frieren-s2.jpg',
        category: '分析',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/26002'
    },
    {
        slug: 'jjk-culling-analysis',
        title: '【解析】《咒術迴戰》死滅迴游：看懂規則殺人的暴力美學',
        excerpt: '看不懂死滅迴游複雜的規則？本篇為你完整拆解。',
        content: `身邊很多朋友跟我說「死滅迴游的規則太複雜了，看不懂」。所以這篇就來幫大家整理一下。

## 基本規則解析

死滅迴游是羂索設計的「術師大逃殺」。基本框架如下：

- 日本各地設置了多個「殖民地」（結界）
- 玩家必須在殖民地內戰鬥獲得積分
- 殺死其他玩家獲得對方的積分
- 19 天內積分歸零就會死亡
- 可以用積分新增新規則

![咒術迴戰死滅迴游](/images/anime/jjk-culling.jpg)

聽起來很簡單對吧？但魔鬼藏在細節裡。

## 乙骨憂太的仙台之戰

本季最大亮點是乙骨在仙台殖民地的戰鬥。他以一敵三，面對三個千年前的古代術師，展現了何謂「特級」的絕對實力。

這一季值得追。如果你能接受複雜的規則和大量的角色死亡，會給你前所未有的觀看體驗。`,
        image: '/images/anime/jjk-culling.jpg',
        category: '分析',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/24647'
    },
    {
        slug: 'oshi-no-ko-s3-analysis',
        title: '【觀點】《我推的孩子》第三季：偶像謊言下的血色真實',
        excerpt: '進入電影篇，這不僅是演藝圈的勾心鬥角，更是對亡者的追憶與利用。',
        content: `《我推的孩子》第三季終於進入粉絲期待已久的「電影篇」。這個篇章在原作中評價極高，它直接觸碰了這部作品最核心的主題：**利用死者的價值，是正義還是罪惡？**

## 《15年的謊言》這部電影

在劇中，導演和編劇決定拍攝一部關於「星野愛」的電影。這位已故的傳奇偶像，她的人生故事會被搬上大銀幕。

對阿奎亞和露比來說，這是直面母親過去、直面自己創傷的過程。

![我推的孩子第三季](/images/anime/oshi-no-ko-s3.jpg)

## 阿奎亞的黑化

阿奎亞從第一季開始就一直在追查母親的死因。到了第三季，他離真相越來越近，但他的手段也越來越黑暗。

赤坂明老師真的很會寫人性的複雜面。這部作品表面上是偶像題材，實際上是在解剖人心。

強烈推薦每一個喜歡心理描寫的觀眾收看。`,
        image: '/images/anime/oshi-no-ko-s3.jpg',
        category: '分析',
        myvideo_url: 'https://www.myvideo.net.tw/details/3/23277'
    },
    {
        slug: 'darwin-incident-analysis',
        title: '【熱議】《達爾文事變》：當人類與動物的界線消失',
        excerpt: '本季最大黑馬。探討種族、歧視與恐怖主義的深度之作。',
        content: `如果你問我這一季最被低估的作品是什麼，我會毫不猶豫地說《達爾文事變》。

## 主角不是人類

主角查理是「Humanzee」——人類與黑猩猩的混血兒。他擁有超人的智商和體能，外表介於人類和猩猩之間。在這個世界裡，他是唯一的存在。

![達爾文事變](/images/anime/hidden-gems.jpg)

查理只想過平靜的高中生活。但激進的動物權利團體 ALA 不想放過他。

## 沒有絕對的正義

這部作品最精彩的地方，在於它沒有簡單的善惡二元論。

人類歧視查理，是因為恐懼未知。ALA 為了動物權利而殺人，他們的目標是「正義」的，但手段是殘忍的。

查理夾在中間，只能用他冷靜的邏輯審視這一切荒謬。

強烈推薦給喜歡思考型作品的觀眾。這部是本季最大的驚喜。`,
        image: '/images/anime/hidden-gems.jpg',
        category: '分析',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%81%94%E7%88%BE%E6%96%87%E4%BA%8B%E8%AE%8A'
    },
    {
        slug: 'medalist-recommendation',
        title: '【推坑】《金牌得主》：超越熱血的極致感動',
        excerpt: '別被「花式滑冰」勸退，這是一部關於夢想與救贖的頂級作品。',
        content: `我知道很多人看到「花式滑冰」這個題材就直接跳過。但看完之後，我只想說：**請給這部作品一個機會**。

## 這不是運動番，這是人生

明浦路司曾經是有潛力的花滑選手，但因為某些原因，他的選手生涯結束了。現在的他只是一個在冰場打雜的失意青年。結束祈同樣是被放棄的人。

![金牌得主](/images/anime/medalist.jpg)

但就是這兩個被世界否定的人，選擇攜手向前。

## 那個相遇的場景

第一集的結尾，當司第一次看到祈在冰上滑行時，他愣住了。

那不是標準的姿勢，但那是**純粹的熱愛**。

我承認，我在那個場景哭了。

請給《金牌得主》三集的機會。這部是我本季最私心推薦的作品。`,
        image: '/images/anime/medalist.jpg',
        category: '分析',
        myvideo_url: 'https://www.myvideo.net.tw/search?keyword=%E9%87%91%E7%89%8C%E5%BE%97%E4%B8%BB'
    }
];

// --- Listicles - Category: 編輯精選 / 綜合報導 ---
const listicles = [
    {
        slug: 'top-10-winter-2026',
        title: '【懶人包】2026 冬季新番 TOP 10：本季必追清單',
        excerpt: '選擇困難症發作？我們精選了本季不能錯過的 10 部作品。',
        content: `每到換季就是選擇困難症發作的時候。新番這麼多，到底該追哪些？這篇就來幫你做個整理。

## 2026 冬番總評

這一季的陣容堪稱近年最強。續作霸權回歸、話題新作登場、黑馬作品冒頭...

![2026冬番推薦](/images/anime/frieren-s2.jpg)

### 第 1 名：葬送的芙莉蓮 第二季
毫無懸念的本季霸權。

### 第 2 名：咒術迴戰 死滅迴游篇
MAPPA 火力全開。

### 第 3 名：我推的孩子 第三季
電影篇終於來了！

### 第 4 名：達爾文事變
本季最大黑馬。

### 第 5 名：金牌得主
運動番的新標竿。

### 第 6 名：炎炎消防隊 第三季
最終章開幕。

### 第 7 名：勇者刑處刑
黑暗奇幻愛好者必看。

### 第 8 名：相反的你和我
本季最強戀愛狗糧。

### 第 9 名：公主殿下，拷問的時間到了 第二季
配飯神番續作。

### 第 10 名：MF Ghost 燃油車鬥魂 第三季
繼承《頭文字 D》意志。

以上就是我的個人推薦。歡迎在評論區分享你的必追清單！`,
        image: '/images/anime/frieren-s2.jpg',
        category: '編輯精選',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    },
    {
        slug: 'dark-fantasy-list',
        title: '【盤點】喜歡咒術迴戰？這 5 部黑暗奇幻也超硬派',
        excerpt: '追完咒術還不夠虐？這幾部同樣讓你看得心臟痛。',
        content: `如果你和我一樣，看動畫就是要看那種「隨時有人領便當」的刺激感，那這篇文章就是為你寫的。

## 什麼是「黑暗奇幻」？

簡單定義：世界觀殘酷、角色隨時會死、沒有絕對的正義。

![黑暗奇幻推薦](/images/anime/jjk-culling.jpg)

### 1. 勇者刑處刑（2026 冬季）
勇者拯救世界後卻被判罪？

### 2. 鏈鋸人 劇場版：蕾塞篇（預定）
藤本樹的瘋狂美學。

### 3. 異修羅（回顧）
「全員最強」的極限對決。

### 4. 來自深淵（經典推薦）
越往下越絕望的設定。

### 5. 地獄樂 第二季（2026 冬季）
仙島上的生存遊戲。

喜歡虐心劇情的朋友，這幾部夠你看一陣子了。`,
        image: '/images/anime/jjk-culling.jpg',
        category: '綜合報導',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    },
    {
        slug: 'relaxing-anime-2026',
        title: '【治癒系】上班好累？5 部讓你放鬆的配飯神番',
        excerpt: '生活已經夠苦了，看動畫就別再虐自己了。',
        content: `每天下班回家，腦子已經轉不動了。這時候需要的是能讓你躺著看、看完心情很好的「配飯神番」。

## 什麼是配飯神番？

定義很簡單：不用動腦、劇情輕鬆、看完會笑。

![治癒系動畫推薦](/images/anime/polar-opposites.jpg)

### 1. 相反的你和我（本季強推）
沒有誤會、沒有第三者，就是兩個人甜甜的互動。

### 2. 公主殿下，拷問的時間到了 第二季
公主每次秒投降的樣子超好笑。

### 3. 葬送的芙莉蓮
節奏非常舒服，心情會跟著平靜下來。

### 4. 搖曳露營△（經典回顧）
冬天最適合看露營了。

### 5. 間諜家家酒（回顧）
安妮亞的表情包永遠有效。

推薦給每一個需要被治癒的你。`,
        image: '/images/anime/polar-opposites.jpg',
        category: '綜合報導',
        myvideo_url: 'https://www.myvideo.net.tw/main'
    }
];

async function seed() {
    console.log('🚀 Seeding database with v5 content...');
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

    // All articles use pinned layout (centered, no sidebar)
    for (const ep of episodes) {
        insert.run(ep.slug, ep.title, ep.excerpt, ep.content, ep.image, ep.category, ep.myvideo_url, 1);
    }
    for (const dd of deepDives) {
        insert.run(dd.slug, dd.title, dd.excerpt, dd.content, dd.image, dd.category, dd.myvideo_url, 1);
    }
    for (const list of listicles) {
        insert.run(list.slug, list.title, list.excerpt, list.content, list.image, list.category, list.myvideo_url, 1);
    }

    console.log(`✅ Seeded ${episodes.length + deepDives.length + listicles.length} articles.`);
    console.log('   Categories: 分析、集數更新、綜合報導、編輯精選');
}

seed();
