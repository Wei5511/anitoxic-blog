const db = require('better-sqlite3')('anime.db');

const healingArticles = [
    { t: '明日同學的水手服', id: '18962', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_1.jpg' },
    { t: '夏目友人帳', id: '4819', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_2.jpg' },
    { t: '水星領航員', id: '6511', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_3.jpg' },
    { t: '新 我們這一家', id: '2578', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_4.jpg' },
    { t: 'SPY×FAMILY 間諜家家酒', id: '17236', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_5.jpg' },
    { t: '比宇宙更遠的地方', id: '12704', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_6.jpg' },
    { t: '房間露營', id: '12703', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_7.jpg' },
    { t: '雙人單身露營', id: '31281', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_8.jpg' },
    { t: '異世界悠閒農家', id: '22427', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_9.jpg' },
    { t: '江戶前精靈', id: '23334', img: '/assets/picks/v8_pick_healing-picks-relax-10-v8_10.jpg' }
];

const suspenseArticles = [
    { t: '進擊的巨人 The Final Season', id: '24584', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_1.jpg' },
    { t: '命運石之門', id: '4665', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_2.jpg' },
    { t: '夏日重現', id: '17849', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_3.jpg' },
    { t: '藥師少女的獨語', id: '24292', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_4.jpg' },
    { t: '咒術迴戰 死滅迴游 前篇', id: '32428', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_5.jpg' },
    { t: '朋友遊戲', id: '31432', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_6.jpg' },
    { t: '怪物事變', id: '14624', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_7.jpg' },
    { t: '風都偵探', id: '21157', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_8.jpg' },
    { t: '偵探已經，死了。', id: '16763', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_9.jpg' },
    { t: '異世界自殺突擊隊', id: '27855', img: '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_10.jpg' }
];

const plotData = {
    '明日同學的水手服': `這是一部關於「初次體驗」與「純粹連結」的治癒神作。主角明日小路考上了夢寐以求的私立蠟梅學園，唯一的願望就是穿上水手服。整部作品透過細膩的作畫，捕捉了少女們日常生活的點滴：指尖的撩動、髮絲的飛揚、以及清新的校園氣息。`,
    '夏目友人帳': `能看見妖怪的少女夏目貴志，在歸還名字的過程中，聽見了妖怪們的執著、思念與寂寞。每一集都是一個獨立的小故事，溫柔得讓人想哭。夏目從最初的排斥妖怪，到後來真心想幫助他們，這種溫柔的轉變非常動人。`,
    '水星領航員': `在被水覆蓋的火星「水星」上，划著貢多拉船帶領遊客觀光的「領航員」。這裡沒有壞人，只有波光粼粼的水面、美麗的歐式建築以及人與人之間真誠的互動。如果這個世界讓你感到疲憊，歡迎來到新威尼斯。`,
    '新 我們這一家': `精準捕捉了普通家庭的瑣碎與溫馨。花媽的大嗓門、花爸的沈默、橘子的少女煩惱與柚子的冷靜吐槽，每一個角色都真實得像你身邊的鄰居。它提醒我們，平凡的日常其實就是最大的奇蹟。`,
    'SPY×FAMILY 間諜家家酒': `為了拯救世界，頂尖間諜「黃昏」必須組建家庭。但他找來的女兒安妮亞是讀心超能力者，妻子約兒是殺手，一場充滿謊言與誤會的家庭喜劇就此展開。雖然三個人都隱瞞著真實身分，但在這個拼湊出來的家庭裡，他們第一次感受到了「家」的溫暖。`,
    '比宇宙更遠的地方': `四個平凡的女高中生，決定挑戰一個看似不可能的目標：去南極。劇本極其出色，對於少女們心理變化的描寫細膩真實。當插曲響起，看著她們在南極的冰原上奔跑、吶喊，你會感受到那種直擊靈魂的衝擊。`,
    '房間露營': `這是人氣大作《搖曳露營》的短篇外傳。撫子、千明與葵三人因為各種原因無法遠行，於是發揮想像力，在狹窄的社辦裡進行「房間露營」。這是一道精緻的餐後甜點，隨時都能拿出來補充能量。`,
    '雙人單身露營': `樹乃倉嚴是一個奉行「獨自露營」的孤高大叔，遇見了菜鳥女大生草野雫。這部作品探討了一種很有趣的人際關係：即使兩個人一起出去，也可以保持各自的空間與節奏。作品對於露營技巧與野炊料理的描寫非常硬核。`,
    '異世界悠閒農家': `轉生到異世界後唯一的願望就是「耕作」。神給了他一具健康的身體與一把「萬能農具」，他便開始在充滿魔物的森林裡開荒拓土。沒有驚心動魄的冒險，只有日復一日的耕種、收成。帶給人最純粹的生存喜悅。`,
    '江戶前精靈': `住在神社裡、沉迷於遊戲與網購的精靈大人？這種反轉的設定讓人看了會心一笑。作品巧妙地將日本傳統的神社文化與現代阿宅生活結合，營造出一種悠閒且溫暖的氛圍。`,
    '進擊的巨人 The Final Season': `從人類對抗吃人巨人的末世生存劇，演變成關於歷史、政治、自由與仇恨輪迴的複雜史詩。諫山創老師對於劇情的鋪掛與伏筆的回收能力，簡直到了令人頭皮發麻的地步。MAPPA 維持了電影級的製作水準。`,
    '命運石之門': `這是一部典型的「慢熱神作」。當劇情進入中段，時光機的蝴蝶效應開始發酵，原本歡樂的日常瞬間崩壞，你才會發現前面所有看似無關的細節，全部都是精心埋下的伏筆。為了拯救青梅竹馬，岡部在無數世界線中穿梭。`,
    '夏日重現': `完美融合了「時間輪迴」與「孤島懸疑」。慎平利用每一次的死亡回歸蒐集情報，與反派「影子」進行局勢博弈。劇情節奏極快，幾乎沒有冷場，每一個轉折都出人意料。不到最後一秒絕對猜不到結局。`,
    '藥師少女的獨語': `在金輝煌卻也深不見底的後宮中，一名對藥草有著異常執著的宮女「貓貓」，利用她的藥理知識，抽絲剝繭地解開一個個看似靈異或意外的懸案。主角的個人魅力帶領觀眾窺見那個時代背後的陰暗與悲哀。`,
    '咒術迴戰 死滅迴游 前篇': `在这个人的負面情緒會化為「咒靈」危害人間的世界。虎杖悠仁與伏黑惠等人為了營救津美紀，主動投身死滅迴游。MAPPA 再次挑戰製作極限，戰鬥場景運用了大量動態鏡頭，視覺效果震撼。`,
    '朋友遊戲': `「友情在金錢面前，真的經得起考驗嗎？」五個高中生被迫參加了一場神秘賭局。遊戲設計極其惡毒，專門利用人與人之間的猜忌與秘密來瓦解信任。主角片切友一其實是一個擁有扭曲價值觀的「惡人」。`,
    '怪物事變': `半妖少年夏羽在偵探隱神的引導下，加入了專門解決怪物事件的事務所。這部作品側重於描寫這些被社會排斥的邊緣少年們，如何建立起如同家人般的羈絆，溫暖與殘酷並存。`,
    '風都偵探': `經典特攝《假面騎士W》的正統續篇。左翔太郎與菲利普這對搭檔繼續在風都解開超能力犯罪。動作戲行雲流水，爵士風格的配樂更是營造出一種成熟、都會的迷人氛圍。`,
    '偵探已經，死了。': `故事從名偵探希耶絲塔死後一年開始，透過倒敘與插敘，拼湊出那三年的回憶以及那位名偵探留下的佈局。如果您喜愛帶有淡淡憂傷的奇幻懸疑，這絕對能觸動您的內心。`,
    '異世界自殺突擊隊': `DC 宇宙的反派們穿越到異世界。小丑女哈莉·奎茵、死射等，必須在異世界完成任務。這部作品美術風格強烈，色彩鮮艷大膽，動作場面更是 WIT STUDIO 的拿手好戲。`
};

const jan2026Upper = [
    { name: 'Fate/strange Fake', img: '/images/anime/fate-strange-fake.jpg', url: 'https://www.myvideo.net.tw/search?keyword=Fate%2Fstrange+Fake', intro: '成田良悟執筆，舞台搬到美國西部。召喚出了不該存在的職階與從者。「虛偽的聖杯戰爭」將帶來前所未有的驚喜！' },
    { name: '葬送的芙莉蓮 第二季', img: '/images/anime/frieren-s2.jpg', url: 'https://www.myvideo.net.tw/details/3/32346', intro: '芙莉蓮與夥伴們朝著恩代前進。這季將迎接更深刻的戰鬥與情感羈絆。' },
    { name: '【我推的孩子】第三季', img: '/images/anime/oshi-no-ko-s3.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E6%88%91%E6%8E%A8%E7%9A%84%E5%AD%A9%E5%AD%90', intro: 'B小町爆紅在即，阿奎亞與露比在復仇與成名的道路上越走越遠，真相即將揭曉。' },
    { name: '咒術迴戰 死滅迴游', img: '/images/anime/jjk-culling.jpg', url: 'https://www.myvideo.net.tw/details/3/32428', intro: '日本各地被結界封鎖。虎杖悠仁與伏黑惠等人主動投身這場死亡遊戲。' },
    { name: '炎炎消防隊 參之章', img: '/images/anime/fire-force-s3.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E7%82%8E%E7%82%8E%E6%B6%88%E9%98%B2%E9%9A%8A', intro: '森羅與特殊消防隊聯手阻止「大災害」，揭開世界的重大秘密。' },
    { name: '輝夜姬想讓人告白 邁向大人的階梯', img: '/images/anime/seiyuu-rec.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E8%BC%9D%E5%A4%9C%E5%A7%AC', intro: '白銀邀請輝夜到新家獨處。天才們這次是否能跨越那道牆？' },
    { name: '給不滅的你 第三季', img: '/images/anime/frieren-s2.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E7%B5%A6%E4%B8%8D%E6%BB%85%E7%9A%84%E4%BD%A0', intro: '不死來到現代世界。在富足的現代，舊日的陰影再次逼近。' },
    { name: 'MF Ghost 燃油車鬥魂 第三季', img: '/images/anime/mf-ghost-s3.jpg', url: 'https://www.myvideo.net.tw/search?keyword=MF+Ghost', intro: '夏向在決賽前夕受傷。面對強敵，他該如何守護 86 的精神？' },
    { name: '魔都精兵的奴隸 第二季', img: '/images/anime/medalist.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E9%AD%94%E9%83%BD%E7%B2%BE%E5%85%B5', intro: '全新威脅展開行動，優希與京香的戰鬥（與獎勵）將更加激烈。' },
    { name: '藍色管弦樂 第二季', img: '/images/anime/polar-opposites.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E8%97%8D%E8%89%B2%E7%AE%A1%E5%弦%BE', intro: '青少年在音樂中尋找自我救贖，最細膩的音樂物語。' }
];

const jan2026Lower = [
    { name: '異國日記', img: '/images/anime/polar-opposites.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E7%95%B0%E5%9C%8B%E6%97%A5%E8%A8%98', intro: '性格古怪的小說家收留了外甥女。一部關於理解、哀悼與生活的細膩傑作。' },
    { name: '東島丹三郎想成為假面騎士', img: '/images/anime/medalist.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E6%9D%B1%E5%B3%B6%E4%B8%B9%E4%B8%89%E9%83%8E', intro: '40 歲大叔認真玩假面騎士家家酒。當惡勢力現身，大叔展現真正的正義。' },
    { name: '相反的你和我', img: '/images/anime/polar-opposites.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E7%9B%B8%E5%8F%8D%E7%9A%84%E4%BD%A0%E5%92%8C%E6%88%91', intro: '活力少女與文靜少年的超純愛日常。沒有勾心鬥角，只有滿滿的糖分。' },
    { name: '判處勇者刑', img: '/images/anime/sentenced.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E5%8B%87%E8%80%85%E5%88%91', intro: '重罪犯的最終懲罰——成為勇者！這群罪人如何殺出一片天？' },
    { name: '從前從前有隻貓！', img: '/images/anime/medalist.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E6%9C%89%E9%9A%BB%E8%B2%BD', intro: '當童話主角通通變成貓！超現實的療癒感，貓奴必收的精神糧食。' },
    { name: '魔術師庫諾看得見一切', img: '/images/anime/fate-strange-fake.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E9%AD%94%E8%A1%93%E5%B8%AB', intro: '水系魔術重現世界。失明少年的想像力與天賦超越常人。' },
    { name: '轉生之後的我變成了龍蛋', img: '/images/anime/oshi-no-ko-s3.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E9%BE%8D%E8%9B%8B', intro: '轉生成一顆蛋！看一顆蛋如何翻身成為世界最強的龍。' },
    { name: 'GNOSIA', img: '/images/anime/vigilantes.jpg', url: 'https://www.myvideo.net.tw/search?keyword=GNOSIA', intro: '宇宙船上的終極人狼遊戲。在疑心暗鬼中選出嫌疑人。' },
    { name: '現在的是哪一個多聞！?', img: '/images/anime/oshi-no-ko-s3.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E5%A4%9A%E8%81%9E', intro: '偶像與粉絲之間的爆笑心動喜劇。' },
    { name: '靠死亡遊戲混飯吃。', img: '/images/anime/sentenced.jpg', url: 'https://www.myvideo.net.tw/search?keyword=%E6%AD%BB%E4%BA%A1%E9%81%8A%E6%88%B2', intro: '少女們以命相搏！這是一場與死亡為鄰的專業生存遊戲。' }
];

function generateMarkdown(title, list, useRawPlot = false) {
    let md = `## **精選推薦內容**\n\n---\n\n`;
    list.forEach((item, i) => {
        const name = item.t || item.name;
        const img = item.img;
        const url = item.url || `https://www.myvideo.net.tw/details/3/${item.id}`;
        const desc = useRawPlot ? plotData[name] : item.intro;

        md += `### ${i + 1}. 《${name}》\n\n`;
        md += `![${name}](${img})\n\n`;
        md += `**內容簡介：** ${desc}\n\n`;
        md += `[點此前往 MyVideo 線上觀看](${url})\n\n`;
        md += `---\n\n`;
    });
    return md;
}

const update = db.prepare('UPDATE articles SET title = ?, content = ?, image_url = ?, excerpt = ?, category = ?, is_pinned = 1 WHERE id = ?');

// 877
update.run(
    '【編輯精選】生活太累？10部治癒系動畫幫你充電',
    generateMarkdown('治癒系', healingArticles, true),
    '/assets/picks/v8_pick_healing-picks-relax-10-v8_1.jpg',
    '本篇精選推薦包括：明日同學的水手服、夏目友人帳等 10 部精彩作品。',
    '編輯精選',
    877
);

// 878
update.run(
    '【編輯精選】燒腦神作！10部讓你停不下來的懸疑動畫',
    generateMarkdown('懸疑系', suspenseArticles, true),
    '/assets/picks/v8_pick_suspense-picks-thriller-10-v8_1.jpg',
    '本篇精選推薦包括：進擊的巨人、命運石之門等 10 部精彩作品。',
    '編輯精選',
    878
);

// 906
update.run(
    '【2026 動漫新番特輯】1月動畫強力推薦總整理（上篇）',
    generateMarkdown('2026上', jan2026Upper, false),
    '/images/anime/frieren-s2.jpg',
    '霸權續作回歸！這 10 部強檔沒看過，別說你懂 2026 動漫圈！',
    '綜合報導',
    906
);

// 907
update.run(
    '【2026 動漫新番特輯】1月動畫強力推薦總整理（下篇）',
    generateMarkdown('2026下', jan2026Lower, false),
    '/images/anime/polar-opposites.jpg',
    '黑馬新作大合輯！從療癒貓咪到重刑勇者，這 10 部非追不可！',
    '綜合報導',
    907
);

console.log('✅ Articles 877, 878, 906, 907 RESTORED DEFINITIVELY.');
