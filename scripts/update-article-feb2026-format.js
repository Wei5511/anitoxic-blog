const db = require('better-sqlite3')('anime.db');

// Map titles to DB IDs and Images
const data = [
    { title: '葬送的芙莉蓮 第二季', id: 202601002, image: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5660/jH8fWyVuPX.jpg', emoji: '🛡️', link: 'https://www.myvideo.net.tw/details/3/32346' }, // Known link from ref
    { title: '咒術迴戰 第三季', id: 56641, image: 'https://cdn.myanimelist.net/images/anime/1066/122176l.jpg', emoji: '⚔️', link: 'https://www.myvideo.net.tw/details/3/32428' }, // Known link from ref
    { title: '【我推的孩子】第三季', id: 202601001, image: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5243/164722l.jpg', emoji: '🌟', link: 'https://www.myvideo.net.tw/details/3/23277' }, // Known link from ref
    { title: '貴族轉生', id: 202601026, image: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5488/eB84c6GkRO.jpg', emoji: '👶', link: 'https://www.myvideo.net.tw/details/3/32399' }, // Known from ref
    { title: '泛而不精的我被逐出勇者隊伍', id: 202601025, image: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5736/BrTMiecbYc.jpg', emoji: '⚔️', link: 'https://www.myvideo.net.tw/details/3/32390' }, // Known from ref
    { title: '判處勇者刑', id: 32447, image: 'https://cdn.myanimelist.net/images/anime/1969/116702l.jpg', emoji: '⚖️', link: 'https://www.myvideo.net.tw/search/判處勇者刑' },
    { title: '相反的你和我', id: 10460, image: 'https://cdn.myanimelist.net/images/anime/4/34949l.jpg', emoji: '❤️', link: 'https://www.myvideo.net.tw/search/相反的你和我' },
    { title: 'Fate/strange Fake', id: 202307015, image: 'https://p2.bahamut.com.tw/B/ACG/c/43/0000133843.JPG?v=4', emoji: '🏆', link: 'https://www.myvideo.net.tw/search/Fate' },
    { title: '安逸領主的愉快領地防衛', id: 202601035, image: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5828/owrCYWSeY5.jpg', emoji: '🧱', link: 'https://www.myvideo.net.tw/search/安逸領主' },
    { title: '燃油車鬥魂 第三季', id: 202310019, image: 'https://image.tmdb.org/t/p/w500/imfBdKnxBHG62LPCoIzI4clHQ6q.jpg', emoji: '🚗', link: 'https://www.myvideo.net.tw/search/燃油車鬥魂' }
];

const content = `本季的冬番激戰區已經進入中場階段。原本以為只是單純的強作續篇對決，沒想到好幾部新作黑馬的劇情張力完全不輸給續作大廠。編輯部特別整理了目前 MyVideo 站內討論度最高的 10 部作品，帶你快速掌握接下來的劇情看點。


## 🛡️ 1. 葬送的芙莉蓮 第二季

![葬送的芙莉蓮 第二季](${data[0].image})

**目前進度：北方諸國旅途篇**

### 【本季看點解析】
如果說第一季是在回憶勇者欣梅爾的溫柔，那第二季就是直面魔族殘酷的現實。隨著一級魔法使考試篇結束，芙莉蓮一行人繼續向北前進，旅途中不僅有溫馨的日常，更有許多令人深思的短篇故事。Madhouse 的製作水準依然維持在頂峰，連背景中的風聲、水流聲都充滿細節，彷彿能透過螢幕感受到那個世界的溫度。

### 【2 月劇情預測：黃金鄉的序章】
接下來最讓人期待的，就是有機會觸及原作中評價極高的黃金鄉篇。劇情將逐步揭開七崩賢中最強大的馬哈特的神秘面紗。不同於單純的武力對決，接下來的篇章將深入探討人類與魔族之間無法跨越的隔閡，文戲將會非常沈重且精彩。

<a href="${data[0].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## ⚔️ 2. 咒術迴戰 第三季

![咒術迴戰 第三季](${data[1].image})

**目前進度：死滅迴游篇 (前段)**

### 【本季看點解析】
澀谷事變後的日本已陷入混亂，而最殘酷的死滅迴游遊戲正式展開。這一季的焦點從虎杖轉移到了特級術師乙骨憂太身上。動畫一開場就展現了 MAPPA 對於動作場景的極致追求，乙骨那種壓倒性的咒力與冷酷的戰鬥風格，被還原得淋漓盡致。本季氣氛營造非常成功，那種隨時會喪命的壓迫感透過配樂與光影完美傳達。

### 【2 月劇情預測：乙骨憂太的仙台結界無雙】
虎杖那邊的劇情暫告一段落，鏡頭即將轉向大家最愛的純愛戰神。他在仙台結界將面臨多方擁有古代術式強者的圍攻，原作名場面三方領域展開有望在本月或下個月登場！這絕對是視覺享受的巔峰，請抓穩扶手，接下來的戰鬥規模會一集比一集更誇張。

<a href="${data[1].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## 🌟 3. 【我推的孩子】第三季

![【我推的孩子】第三季](${data[2].image})

**目前進度：電影篇 (15年的謊言)**

### 【本季看點解析】
這不只是偶像番，這是披著華麗外衣的復仇劇。第三季劇情進入核心，阿奎亞為了找出殺害母親愛（Ai）的真兇，利用電影拍攝逐步逼近真相。這一季對於演藝圈的潛規則、童星的悲歌以及媒體操作有著更赤裸的描寫。每一個角色的笑容背後，都藏著無法言說的秘密，特別是對於演員心理狀態的刻畫，讓人看了不寒而慄。

### 【2 月劇情預測：謊言與真相的正面對決】
電影《15年的謊言》正式開拍，這不僅僅是演戲，更是阿奎亞對生父的公開處刑。接下來的看點在於露比如何詮釋母親星野愛，以及阿奎亞在飾演父親時的心理崩潰邊緣。這一段的劇情張力極強，將會揭開演藝圈最黑暗的一面，也是原作中情感爆發最強烈的一段。

<a href="${data[2].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## 👶 4. 貴族轉生

![貴族轉生](${data[3].image})

**目前進度：帝國建立與後宮擴充**

### 【本季看點解析】
如果你覺得生活太累，想看主角一路贏到底，選這部就對了！主角轉生為皇帝的第十三子，一出生等級就是無限大，還擁有可以借用部下能力的作弊技能。這部作品完全不跟你演什麼修煉變強，主角從第 1 集開始就是世界最強，不管遇到什麼強敵都是一招秒殺，看他如何用那犯規的能力，收服各種強大的美少女與猛將，建立自己的最強軍團。

### 【2 月劇情預測：壓倒性的力量展示】
身為本季最舒壓的龍傲天，主角諾亞接下來將面臨兄弟姊妹的皇位爭奪戰。不用擔心，我們只想看他如何用能力降維打擊對手。期待看到更多強力部下加入他的麾下，繼續擴張他的後宮與軍團，是本季最適合配飯的無腦爽番。

<a href="${data[3].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## ⚔️ 5. 泛而不精的我被逐出勇者隊伍

![泛而不精的我被逐出勇者隊伍](${data[4].image})

**目前進度：賦予術士的逆襲**

### 【本季看點解析】
既然你們覺得我樣樣通樣樣鬆，那我就樣樣都練到最強！這部絕對是本季最解氣的退隊流作品！主角歐倫因為什麼技能都會一點、但什麼都不精通，被勇者隊伍嫌棄並踢出。但他沒有因此消沉，反而利用自己過去身為劍士的經驗，轉職成為賦予術士，結果發現自己能打能補還能強化，根本是全能外掛！

### 【2 月劇情預測：前隊友的悔恨】
這類作品最讓人期待的，當然就是主角展現實力讓前隊友後悔的橋段。隨著歐倫在新隊伍中大放異彩，展現出一人抵一軍的誇張輔助能力，鏡頭將會切換回原本踢掉他的勇者隊伍，看著他們陷入苦戰並開始後悔。這種沒了你我們什麼都不是的劇情，絕對是二月最舒壓的時刻。

<a href="${data[4].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## ⚖️ 6. 判處勇者刑

![判處勇者刑](${data[5].image})

**目前進度：罪人勇者的絕望戰鬥**

### 【本季看點解析】
這部作品的世界觀設定非常黑暗且獨特。所謂的勇者並非榮耀的稱號，而是給予重罪犯的最嚴厲刑罰。主角薩維得身為前勇者隊伍的隊長，因殺害女神而被判刑，必須不斷地與魔王軍戰鬥，即便死亡也會被強制復活繼續受苦。這種充滿絕望與瘋狂的戰鬥美學，搭配獨特的畫風，給人一種強烈的視覺衝擊。

### 【2 月劇情預測：懲罰的真相與女神的真面目】
接下來劇情將深入揭露當初主角為何要殺害女神的真相。隨著戰鬥升級，我們將看到更多關於這個扭曲世界的設定。女神那看似天真實則冷酷的一面將逐漸顯露，觀眾將會發現這個世界觀比想像中更絕望，主角該如何在這個無限輪迴的地獄中尋找一絲救贖？

<a href="${data[5].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## ❤️ 7. 相反的你和我

![相反的你和我](${data[6].image})

**目前進度：校園戀愛升溫中**

### 【本季看點解析】
在一堆打打殺殺的新番中，這部絕對是唯一的淨土。故事講述充滿活力的辣妹鈴木，竟然喜歡上了總是沉默寡言、存在感極低的谷同學。兩人雖然性格天差地遠，但互動卻意外地合拍且甜蜜。作者對於青春期的悸動與人際關係的描寫非常細膩，沒有灑狗血的誤會，只有滿滿的糖分與正能量。

### 【2 月劇情預測：這兩人什麼時候才要結婚？】
接下來的看點在於兩人關係的進一步突破（希望能有牽手以上的進展！），以及周遭朋友們的神助攻。特別是鈴木那群看起來很現充的朋友，意外地都很支持這段戀情。這是每週看完黑暗系動畫後，回復心靈值必備的聖品，看完保證讓你想談戀愛。

<a href="${data[6].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## 🏆 8. Fate/strange Fake

![Fate/strange Fake](${data[7].image})

**目前進度：偽・聖杯戰爭開打**

### 【本季看點解析】
位於美國雪原市的這場虛偽聖杯戰爭，規模遠超冬木市。不同於以往的 Fate 系列，這次的職階與召喚規則都被扭曲，出現了許多規格外的英靈。A-1 Pictures 在這部的光影特效上下足了功夫，每一場戰鬥的運鏡都充滿電影感，特別是那些寶具釋放的瞬間，經費燃燒的程度讓人嘆為觀止。

### 【2 月劇情預測：金閃閃 vs 恩奇都】
接下來最大的看點絕對是英雄王吉爾伽美什與他的摯友恩奇都的重逢與對決。這兩位神話級角色的碰撞，絕對會炸裂螢幕。除了這對摯友組，其他御主與從者之間的智鬥與博弈也將進入白熱化階段，多方混戰一觸即發。

<a href="${data[7].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## 🧱 9. 安逸領主的愉快領地防衛

![安逸領主的愉快領地防衛](${data[8].image})

**目前進度：邊境村落建設**

### 【本季看點解析】
原本被認為是廢柴的生產系魔術，在主角范恩手上變成了最強的建築外掛。故事雖然是常見的領地建設流，但主角那種我只是想過安逸生活，為什麼大家都來煩我的性格非常討喜。看著他一邊抱怨一邊把貧瘠的村落蓋成銅牆鐵壁的要塞都市，這種反差萌非常有趣。

### 【2 月劇情預測：要塞都市成形】
隨著領地逐漸繁榮，自然會引來鄰國或魔物的覬覦。接下來可能會有大規模的進攻事件，這正是主角展示他那些超誇張防禦工事的好機會。看主角如何用那些本應用於生產的魔術，輕鬆擊退大軍並教他們做人，將是本月最大的看點。

<a href="${data[8].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


## 🚗 10. 燃油車鬥魂 第三季

![燃油車鬥魂 第三季](${data[9].image})

**目前進度：MFG 第 4 戰**

### 【本季看點解析】
繼承了《頭文字D》的世界觀與熱血，夏向駕駛著馬力劣勢的 Toyota 86，在充滿超跑的 MFG 賽事中創造奇蹟。第三季的作畫與音效更加進化，引擎聲浪的還原度極高。隨著新角色（以及大家都愛的 MFG Angels）登場，比賽的節奏將會更快，對於車迷來說絕對是不可錯過的盛宴。

### 【2 月劇情預測：片桐夏向的完全覺醒】
本季重點在於夏向將面臨更嚴苛的賽道條件，可能是雨戰或是迷霧路段。他將如何利用藤原拓海傳授的公路最速理論以及自身超強的空間感知能力，在視線不佳的情況下進行超車？Eurobeat 音樂一下，那種讓人腎上腺素飆升的快感就回來了！

<a href="${data[9].link}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>


<hr />

## 💡 站長的話

今年的 2 月真的不怕沒動畫看，怕的是時間不夠用！以上這 10 部作品，目前在 MyVideo 全部都能看得到。

如果你的片單還沒滿，建議優先補《咒術迴戰》和《我推的孩子》這兩部霸權作，保證不後悔！還沒追的趕快點擊下方連結開始補進度吧！
`;

// Update article content for ID 931
const stmt = db.prepare('UPDATE articles SET content = ? WHERE title LIKE ? OR slug = ?');
stmt.run(content, '%2026冬番%2月追番指南%', '2026-winter-feb-guide');

console.log('Article 931 format updated successfully.');
