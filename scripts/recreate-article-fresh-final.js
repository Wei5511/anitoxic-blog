const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Assets
const assets = {
    jjk: {
        img: '/images/anime/jjk-s3.jpg',
        link: 'https://www.myvideo.net.tw/details/3/25275'
    },
    party: {
        img: '/images/anime/party-outcast.jpg',
        link: 'https://www.myvideo.net.tw/details/3/25276'
    },
    noble: {
        img: '/images/anime/noble-reincarnation.jpg',
        link: 'https://www.myvideo.net.tw/details/3/25274'
    },
    frieren: {
        img: '/images/anime/frieren-s2.jpg',
        link: 'https://www.myvideo.net.tw/details/3/32346'
    },
    oshi: {
        img: '/images/anime/oshi-no-ko-s3.jpg',
        link: 'https://www.myvideo.net.tw/details/3/23277'
    },
    cta: '/images/myvideo-cta.png'
};

const content = `2026 年 1 月新番開播至今一個月，本季的陣容除了有《咒術迴戰》、《芙莉蓮》這種史詩級大作續篇之外，還有幾部「雖然低調，但看起來超級爽」的黑馬異世界番！如果你下班後不想動腦，只想看主角一路開掛、逆襲打臉，那麼這份編輯部精選的「Top 5 必看清單」絕對能滿足你的爽片需求。而且這 5 部全部都能在 MyVideo 上高清觀看！

<br/>

# 👑 1. 燃燒的經費霸權：咒術迴戰 第三季 (死滅迴游篇)
![咒術迴戰](${assets.jjk.img})
**製作公司：MAPPA**

**推薦指數：⭐⭐⭐⭐⭐**

**類型：黑暗奇幻 / 戰鬥**

**【劇情介紹與看點解析】**
澀谷事變後的日本已陷入混亂，而最殘酷的「死滅迴游」遊戲正式展開。這一季的焦點轉移到了特級術師乙骨憂太身上。MAPPA 再次展現了對動作場景的極致追求，乙骨那種壓倒性的咒力與冷酷的戰鬥風格，被還原得淋漓盡致。本季氣氛營造非常成功，那種隨時會喪命的壓迫感透過配樂與光影完美傳達。

**【接下來的期待看點：三方領域展開！？】**
隨著死滅迴游的規則逐漸明朗，劇情預計將進入高潮的**「仙台結界篇」。乙骨憂太可能會同時面對多位擁有古代術式的強者，原作粉絲最期待的「三方同時領域展開」**名場面，有望在本季後半段動畫化登場！ 請抓穩扶手，接下來的戰鬥規模絕對會讓觀眾大呼過癮。
🔥 領域展開！現在就去補進度

[![前往MyVideo線上觀看](${assets.cta})](${assets.jjk.link})

<br/>
<hr/>
<br/>

# ⚔️ 2. 被低估的逆襲爽番：泛而不精的我被逐出勇者隊伍
**泛而不精的我被逐出了勇者隊伍～因為隊伍需要成為賦予術士的原劍士，走向萬能之路**
![泛而不精的我被逐出勇者隊伍](${assets.party.img})

**製作公司：Studio A-CAT (或實際製作方)**

**推薦指數：⭐⭐⭐⭐**

**類型：奇幻 / 冒險 / 逆襲流**

**【劇情介紹與看點解析】**
「既然你們覺得我樣樣通樣樣鬆，那我就樣樣都練到最強！」 這部絕對是本季最解氣的「退隊流」作品！主角歐倫因為什麼技能都會一點、但什麼都不精通（器用貧乏），被勇者隊伍嫌棄並踢出。但他沒有因此消沉，反而利用自己過去身為劍士的經驗，轉職成為「賦予術士」，結果發現自己能打能補還能強化，根本是全能外掛！

**【接下來的期待看點：打臉前隊友的舒壓時刻】**
這類作品最讓人期待的，當然就是主角展現實力讓前隊友後悔的橋段。隨著歐倫加入新隊伍並大顯身手，他將展現出「一個人抵一整個軍隊」的誇張輔助能力。如果你喜歡看主角默默努力然後驚艷全場的劇情，這部絕對能讓你身心舒暢。
⚔️ 誰說雜魚不能翻身？看主角華麗逆襲

[![前往MyVideo線上觀看](${assets.cta})](${assets.party.link})

<br/>
<hr/>
<br/>

# 👶 3. 出生即滿等的極致龍傲天：貴族轉生
**貴族轉生～得天眷顧一出生就獲得最強力量～**
![貴族轉生](${assets.noble.img})
**製作公司：Studio Boomer (或實際製作方)**

**推薦指數：⭐⭐⭐⭐**

**類型：異世界 / 轉生 / 龍傲天**

**【劇情介紹與看點解析】**
如果你覺得生活太累，想看主角一路贏到底，選這部就對了！ 主角轉生為皇帝的第十三子，一出生等級就是無限大（Level Infinity），還擁有可以借用部下能力的作弊技能。這部作品完全不跟你演什麼「修煉變強」，主角從第 1 集開始就是世界最強，不管遇到什麼強敵都是一招秒殺。

**【接下來的期待看點：收服更多強力部下】**
這部番的樂趣在於看主角如何用那犯規的能力，收服各種強大的美少女與猛將，建立自己的最強軍團。接下來主角將面對企圖爭奪皇位的其他兄弟姊妹，看他如何用壓倒性的力量「降維打擊」這些凡人，是本季最適合配飯的無腦爽番。
👑 一出生就無敵！體驗最極致的開掛人生

[![前往MyVideo線上觀看](${assets.cta})](${assets.noble.link})

<br/>
<hr/>
<br/>

# 🛡️ 4. 觸動人心的神作：葬送的芙莉蓮 第二季
![葬送的芙莉蓮](${assets.frieren.img})
**製作公司：Madhouse**

**推薦指數：⭐⭐⭐⭐⭐**

**類型：奇幻 / 冒險 / 治癒**

**【劇情介紹與看點解析】**
如果說前幾部是追求感官刺激，那《芙莉蓮》就是負責撫慰心靈。第二季劇情深入探討魔法的歷史與人類的傳承。Madhouse 的製作依然穩定得可怕，連背景的風聲、水聲都充滿細節。這是一部適合在週末夜晚，泡一杯熱茶靜靜欣賞的藝術品。

**【接下來的期待看點：黃金鄉的謎團】**
隨著隊伍向北深入，芙莉蓮一行人有機會觸及傳說中的**「黃金鄉篇」。這一段劇情在原作中被譽為「文戲與智戰的巔峰」**，若動畫進度允許，我們將會遇到最強大的七崩賢——馬哈特。這將是芙莉蓮系列中最沈重、但也最精彩的一個篇章，即便本季未能演完，光是揭開序幕就足以讓人期待。
✨ 再次踏上旅程，每週同步更新

[![前往MyVideo線上觀看](${assets.cta})](${assets.frieren.link})

<br/>
<hr/>
<br/>

# 🌟 5. 演藝圈的黑暗與復仇：【我推的孩子】第三季
![我推的孩子](${assets.oshi.img})
**製作公司：道工房 (Doga Kobo)**

**推薦指數：⭐⭐⭐⭐⭐**

**類型：懸疑 / 演藝圈 / 劇情**

**【劇情介紹與看點解析】**
這不只是偶像番，這是披著華麗外衣的復仇劇。第三季劇情進入核心，阿奎亞為了找出殺害母親愛（Ai）的真兇，利用電影拍攝逐步逼近真相。這一季對於演藝圈的潛規則、童星的悲歌以及媒體操作有著更赤裸的描寫。每一個角色的笑容背後，都藏著無法言說的秘密。

**【接下來的期待看點：電影篇開拍與真相揭露】**
本季重點全在**「那部電影」的拍攝過程。露比與阿奎亞將如何在鏡頭前飾演自己的母親與父親？這對他們來說既是演戲，也是最殘忍的心理治療。原作中張力最強的「父子對峙」伏筆有望在本季引爆**，請準備好迎接劇情的大反轉。

🎤 謊言是愛的一種形式，真相即將大白
[![前往MyVideo線上觀看](${assets.cta})](${assets.oshi.link})

<br/>
<hr/>
<br/>

📝 站長後記
以上就是本季【漫】性中毒編輯部精選的 Top 5 作品。無論是想要追求極致作畫的視覺享受，還是只想無腦看主角開掛紓壓，這份片單都能滿足你。更棒的是，這些作品全部都能在 MyVideo 上高清觀看！

現在就點擊連結，開啟你的追番馬拉松吧！`;

const article = {
    slug: '2026-winter-must-watch',
    title: '【2026冬番】開播總體檢！本季必追這 5 部',
    excerpt: '除了咒術、芙莉蓮，看這兩部「開掛神作」無腦看主角開掛才是真正的紓壓救星！',
    category: '編輯精選',
    image_url: assets.party.img, // Cover
    myvideo_url: 'https://www.myvideo.net.tw/',
    content: content
};

const stmt = db.prepare(`
    INSERT INTO articles (slug, title, excerpt, category, image_url, myvideo_url, content, published_at, is_pinned)
    VALUES (@slug, @title, @excerpt, @category, @image_url, @myvideo_url, @content, datetime('now'), 1)
    ON CONFLICT(slug) DO UPDATE SET
        title = @title,
        excerpt = @excerpt,
        category = @category,
        image_url = @image_url,
        myvideo_url = @myvideo_url,
        content = @content,
        published_at = datetime('now')
`);

try {
    const info = stmt.run(article);
    console.log('Article recreated: ' + info.changes);
} catch (e) {
    console.error('Error updating article:', e);
}
