const db = require('better-sqlite3')('anime.db');

const getBtn = (url) => url ? `\n\n<a href="${url}" class="btn-orange-small" target="_blank">前往MyVideo</a>\n\n` : '';

const frierenText = `《葬送的芙莉蓮》第二季終於在萬眾矚目下歸來，正式進入原作中備受好評的「北部高原篇」。這部作品自第一季播出以來，便以其獨特的敘事節奏和對時間流逝的深刻描寫，在奇幻動畫領域佔據了一席之地。如果說第一季是芙莉蓮「了解人類」的起點，那麼第二季則是她真正深入過去回憶與現代羈絆交織的旅程。`;

const jjkText = `隨著澀谷事變的落幕，日本社會陷入了前所未有的混亂與恐慌，而這僅僅是絕望的開始。《咒術迴戰》第三季「死滅迴游篇」以更加沉重與殘酷的基調拉開序幕。這不僅僅是另一場戰鬥，而是一場精心設計的、針對全體術師的生存遊戲。原作漫畫家芥見下下在這個篇章中展現了極大的野心，將戰鬥規則複雜化，並引入了大量極具個性的新角色，將「咒術戰」提升到了智鬥與力鬥並重的全新高度。`;

const oshiText = `如果說《我推的孩子》前兩季是在鋪陳演藝圈的光鮮與黑暗，那麼第三季的「電影篇」就是直擊這一切核心的最終爆發。本季劇情進入了原作中情感濃度最高、也是角色衝突最激烈的篇章。阿奎亞長久以來的復仇計畫終於進入了執行階段，而他所選擇的舞台，竟然是一部描述他母親、傳奇偶像「星野愛」一生的電影——《15年的謊言》。這部作品不僅是對演藝圈的控訴，更是阿奎亞與露比兄妹對過去創傷的正面對決。`;

const fireText = `由大久保篤創作的熱血少年漫畫《炎炎消防隊》，其動畫版終於迎來了最終完結篇「參之章」。這部作品自連載以來，便以其獨特的「消防員滅火」結合「超能力戰鬥」的設定吸引了大量粉絲。而隨著劇情的推進，我們發現這不僅僅是一個打倒怪物的王道故事，其背後更隱藏著關於世界起源、宗教狂熱以及人類意志的宏大哲學探討。本季作為系列的收官之作，將把這些伏筆一一回收，並帶來前所未有的超大規模戰鬥。`;

const mfText = `引擎的轟鳴聲是男人的浪漫，而《MF Ghost 燃油車鬥魂》正是將這份浪漫延續到了未來。作為經典賽車漫畫《頭文字D》的正統續作，本作設定在一個電動車完全普及、燃油車面臨滅絕的近未來。然而，一項名為「MFG」的賽事卻逆勢而行，堅持使用傳統燃油跑車在公路上進行競速。這不僅是為了懷舊，更是為了證明人類駕駛技術與機械工藝的極限。第三季的到來，標誌著片桐夏向的挑戰進入了全新的階段。`;

const content877 = `2026 年的冬季新番陣容堪稱「神仙打架」，多部重量級續作回歸，加上話題十足的漫改新作，讓動漫迷們每週都過得充實無比。我們為大家精選了 5 部本季絕對不容錯過的頂尖作品，每一部都值得你花時間細細品味。

## 1. 葬送的芙莉蓮 第二季
![葬送的芙莉蓮](/images/anime/frieren-s2.jpg)
${frierenText}
${getBtn('https://www.myvideo.net.tw/details/3/32346')}

## 2. 咒術迴戰 死滅迴游篇
![咒術迴戰](/images/anime/jjk-culling.jpg)
${jjkText}
${getBtn('https://www.myvideo.net.tw/details/3/32428')}

## 3. 我推的孩子 第三季
![我推的孩子](/images/anime/oshi-no-ko-s3.jpg)
${oshiText}
${getBtn('https://www.myvideo.net.tw/search?keyword=%E6%88%91%E6%8E%A8%E7%9A%84%E5%AD%A9%E5%AD%90')}

---
`;

const content878 = `接續上篇的續作霸權，下篇我們將帶領大家關注那些同樣極具話題性、甚至可能在播放中途爆紅的強大新作與精選作品。這些作品在敘事風格與視覺表現上都有著顯著的特色。

## 1. 炎炎消防隊 參之章
![炎炎消防隊](/images/anime/fire-force-s3.jpg)
${fireText}
${getBtn('https://www.myvideo.net.tw/search?keyword=%E7%82%8E%E7%82%8E%E6%B6%88%E9%98%B2%E9%9A%8A')}

## 2. MF Ghost 燃油車鬥魂 第三季
![MF Ghost](/images/anime/mf-ghost-s3.jpg)
${mfText}
${getBtn('https://www.myvideo.net.tw/search?keyword=%E7%87%83%E6%B2%B9%E8%BB%8A%E9%AC%A5%E9%AD%82')}

## 3. 相反的你和我
![相反的你和我](/images/anime/polar-opposites.jpg)
在充斥著異世界轉生與超能力戰鬥的動畫市場中，《相反的你和我》就像一杯清爽的檸檬蘇打水，以其純粹、真誠且甜度爆表的校園戀愛喜劇風格，迅速俘獲了觀眾的心。這部改編自阿賀澤紅茶人氣漫畫的作品，沒有複雜的後宮關係，沒有令人胃痛的誤會糾葛，只有兩個性格截然不同的人如何慢慢靠近、互相理解的溫暖過程。它證明了簡單的故事如果講得好，依然擁有打動人心的力量。
${getBtn('https://www.myvideo.net.tw/details/3/32423')}

## 4. 花樣少年少女
![花樣少年少女](/images/anime/game-rec.jpg)
在少女漫畫的歷史長河中，《花樣少年少女》（偷偷愛著你）絕對是佔有重要地位的經典之作。它開啟了「女扮男裝潛入男校」這一題材的黃金時代，並曾多次被改編為真人電視劇（台劇、日劇、韓劇），風靡全亞洲。如今，這部傳奇作品終於迎來了首次完整的電視動畫化。對於老粉來說，這是一次穿越時空的圓夢之旅；對於新觀眾來說，這是一次體驗純正少女漫魅力的絕佳機會。
${getBtn('https://www.myvideo.net.tw/details/3/32406')}

---
`;

const res1 = db.prepare('UPDATE articles SET content = ? WHERE id = 877').run(content877);
console.log('Updated 877:', res1.changes);

const res2 = db.prepare('UPDATE articles SET content = ? WHERE id = 878').run(content878);
console.log('Updated 878:', res2.changes);
