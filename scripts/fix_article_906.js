const Database = require('better-sqlite3');
const db = new Database('anime.db');

const getBtn = (url) => `\n\n<a href="${url}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>\n\n`;

const items = [
    { t: 'Fate/strange Fake', id: '29508', img: '/images/anime/fate-strange-fake-fixed.jpg', desc: '成田良悟執筆，舞台搬到美國西部。由於模仿聖杯戰爭的系統存在缺陷，召喚出了不該存在的職階與從者。「虛偽的聖杯戰爭」將帶來前所未有的戰力通膨與驚喜！\n\n這部作品與其說是聖杯戰爭，不如說是各路英雄豪傑在現代美國舞台上的極限博弈。畫面製作由 A-1 Pictures 操刀，維持了 Fate 系列一貫的高水準視覺特效。' },
    { t: '葬送的芙莉蓮 第二季', id: '32346', img: '/images/anime/frieren-s2.jpg', desc: '《葬送的芙莉蓮》第二季終於在萬眾矚目下歸來，正式進入原作中備受好評的「北部高原篇」。這部作品自第一季播出以來，便以其獨特的敘事節奏和對時間流逝的深刻描寫，在奇幻動畫領域佔據了一席之地。' },
    { t: '【我推的孩子】第三季', id: '23277', img: '/images/anime/oshi-no-ko-s3.jpg', desc: '演藝圈的明爭暗鬥升級！B小町爆紅在即，阿奎亞與露比在復仇與成名的道路上越走越遠，真相即將揭曉。\n\n本季進入了原作中情感濃度最高、也是角色衝突最激烈的篇章「電影篇」。' },
    { t: '咒術迴戰 死滅迴游 前篇', id: '32428', img: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5494/a3m35gq34q.jpg', desc: '隨著澀谷事變的落幕，日本社會陷入了前所未有的混亂與恐慌，而這僅僅是絕望的開始。《咒術迴戰》第三季「死滅迴游篇」以更加沉重與殘酷的基調拉開序幕。這不僅僅是另一場戰鬥，而是一場精心設計的、針對全體術師的生存遊戲。' },
    { t: '炎炎消防隊 參之章', id: '32424', img: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5481/t2f2t4g4.jpg', desc: '由大久保篤創作的熱血少年漫畫《炎炎消防隊》，其動畫版終於迎來了最終完結篇「參之章」。這部作品自連載以來，便以其獨特的「消防員滅火」結合「超能力戰鬥」的設定吸引了大量粉絲。' },
    { t: '輝夜姬想讓人告白 邁向大人的階梯', id: '32347', img: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5439/k3g3d3k3.jpg', desc: '白銀邀請輝夜到新家獨處共進晚餐。傲嬌的天才們，這次是否能跨越那道牆？\n\n這部作品將戀愛番拍成了諜報動作片，旁白的激情解說更是神來之筆。本季特別篇聚焦於兩位主角關係的進一步昇華。' },
    { t: '給不滅的你 第三季', id: '32425', img: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5858/N8v9K7513G.jpg', desc: '不死來到和平的現代世界。在富足的現代，舊日的陰影再次逼近，這是一部跨越千年的生命贊歌。\n\n不死這段漫長的旅程終於來到了現代篇。雖然看起來是一個不再需要戰鬥的和平時代，但對於跨越數千年的不死來說，適應現代生活與面對老靈魂的糾纏是全新的考驗。' },
    { t: 'MF Ghost 燃油車鬥魂 第三季', id: '32426', img: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5586/m3f3g3h3.jpg', desc: '引擎的轟鳴聲是男人的浪漫，而《MF Ghost 燃油車鬥魂》正是將這份浪漫延續到了未來。作為經典賽車漫畫《頭文字D》的正統續作，本作設定在一個電動車完全普及、燃油車面臨滅絕的近未來。' },
    { t: '魔都精兵的奴隸 第二季', id: '32343', img: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5040/J2FJgisqtb.jpg', desc: '組長全體集結！全新的威脅《八雷神》展開行動，優希與京香的戰鬥將更加激烈。\n\n本作以獨特的角色關係與刺激的戰鬥場面深受好評。第二季中各個組長的能力展現與隊伍間的合作是最大看點。' },
    { t: '藍色管弦樂 第二季', id: '30640', img: 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5482/m6vLALdIu1.jpg', desc: '青春的管弦樂再次奏響。青野一在音樂中尋找自我的救贖，描寫少年少女最細膩的音樂物語。\n\n第二季深入探討了青野一與父親、與過去自己的和解過程。音樂演奏部分的 3D 技術與手繪結合得更加流暢，完美呈現了交響樂團全神貫注合奏時的張力。' }
];

let markdown = `霸權續作回歸！這 10 部強檔沒看過，別說你懂 2026 動漫圈！從 Fate 全新篇章到芙莉蓮的冒險續篇，最強陣容全數搜羅。\n\n---\n\n`;

items.forEach((item, index) => {
    markdown += `## ${index + 1}. ${item.t}\n`;
    markdown += `![${item.t}](${item.img})\n\n`;
    markdown += `${item.desc}\n`;
    markdown += getBtn(`https://www.myvideo.net.tw/details/3/${item.id}`);
    markdown += `\n---\n\n`;
});

const stmt = db.prepare('UPDATE articles SET title = ?, content = ?, excerpt = ?, image_url = ?, is_pinned = 1 WHERE id = 906');
const res = stmt.run('【MyVideo 2026 新番特輯】1月動畫強力推薦總整理（上篇）', markdown, '霸權續作回歸！這 10 部強檔沒看過，別說你懂 2026 動漫圈！', '/images/anime/fate-strange-fake-fixed.jpg');

console.log(`Updated Article 906. Changes: ${res.changes}`);
console.log('✅ Article 906 fixed with correct Fate image and valid links.');
