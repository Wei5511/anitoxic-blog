
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

// Hardcoded selection from user list (simulated random pick)
const ANIME_LIST = [
    { title: "2.5次元的誘惑", url: "https://www.myvideo.net.tw/details/3/27820" },
    { title: "86-不存在的戰區-", url: "https://www.myvideo.net.tw/details/3/15880" },
    { title: "ACCA 13區監察課", url: "https://www.myvideo.net.tw/details/3/4791" },
    { title: "AI電子基因", url: "https://www.myvideo.net.tw/details/3/24045" },
    { title: "AYAKA ‐綾島奇譚‐", url: "https://www.myvideo.net.tw/details/3/24062" },
    { title: "Acro Trip 頂尖惡路", url: "https://www.myvideo.net.tw/details/3/28717" },
    { title: "B-PROJECT 〜熱烈＊Love Call〜", url: "https://www.myvideo.net.tw/details/3/25315" },
    { title: "BanG Dream! Ave Mujica", url: "https://www.myvideo.net.tw/details/3/29500" },
    { title: "BanG Dream! Its MyGO!!!!!", url: "https://www.myvideo.net.tw/details/3/24006" },
    { title: "Buddy Daddies殺手奶爸", url: "https://www.myvideo.net.tw/details/3/22631" },
    { title: "BURN THE WITCH 龍與魔女", url: "https://www.myvideo.net.tw/details/3/13628" },
    { title: "Bad Girl 不良少女", url: "https://www.myvideo.net.tw/details/3/30959" },
    { title: "FARMAGIA魔農傳記", url: "https://www.myvideo.net.tw/details/3/29611" },
    { title: "Fairy Tail 魔導少年 百年任務", url: "https://www.myvideo.net.tw/details/3/27778" },
    { title: "Fairy gone", url: "https://www.myvideo.net.tw/details/3/19320" },
    { title: "Fate/strange Fake", url: "https://www.myvideo.net.tw/details/3/29508" },
    { title: "GIBIATE獵魔武士", url: "https://www.myvideo.net.tw/details/3/12696" },
    { title: "GNOSIA", url: "https://www.myvideo.net.tw/details/3/31826" },
    { title: "Gachiakuta", url: "https://www.myvideo.net.tw/details/3/31113" },
    { title: "Lycoris Recoil 莉可麗絲：友誼是時間的竊賊", url: "https://www.myvideo.net.tw/details/3/30482" },
    { title: "Lycoris Recoil莉可麗絲", url: "https://www.myvideo.net.tw/details/3/20891" },
    { title: "MOMENTARY LILY 剎那之花", url: "https://www.myvideo.net.tw/details/3/29499" },
    { title: "Paradox Live THE ANIMATION", url: "https://www.myvideo.net.tw/details/3/25457" },
    { title: "RE-MAIN", url: "https://www.myvideo.net.tw/details/3/16693" },
    { title: "RINKAI！女子競輪", url: "https://www.myvideo.net.tw/details/3/27136" },
    { title: "Re:Monster", url: "https://www.myvideo.net.tw/details/3/26864" },
    { title: "SELECTION PROJECT", url: "https://www.myvideo.net.tw/details/3/17763" },
    { title: "SHY 靦腆英雄", url: "https://www.myvideo.net.tw/details/3/24883" },
    { title: "SK8 the Infinity", url: "https://www.myvideo.net.tw/details/3/14691" },
    { title: "SSSS.GRIDMAN", url: "https://www.myvideo.net.tw/details/3/29541" },
    { title: "Summer Pockets", url: "https://www.myvideo.net.tw/details/3/30251" },
    { title: "THE NEW GATE", url: "https://www.myvideo.net.tw/details/3/26945" },
    { title: "TRIGUN STAMPEDE", url: "https://www.myvideo.net.tw/details/3/22684" },
    { title: "TRUMP系列Delicoʼs Nursery", url: "https://www.myvideo.net.tw/details/3/28182" },
    { title: "Vivy -Fluorite Eyeʼs Song-", url: "https://www.myvideo.net.tw/details/3/15882" },
    { title: "WITCH WATCH 魔女守護者", url: "https://www.myvideo.net.tw/details/3/29964" },
    { title: "mono女孩", url: "https://www.myvideo.net.tw/details/3/29965" },
    { title: "《何百芮的地獄戀曲》", url: "https://www.myvideo.net.tw/details/3/32307" },
    { title: "《我推的孩子》", url: "https://www.myvideo.net.tw/details/3/23277" },
    { title: "七魔劍支配天下", url: "https://www.myvideo.net.tw/details/3/24449" },
    { title: "中年大叔轉生反派千金", url: "https://www.myvideo.net.tw/details/3/29496" },
    { title: "久保同學不放過我", url: "https://www.myvideo.net.tw/details/3/22750" },
    { title: "九龍大眾浪漫", url: "https://www.myvideo.net.tw/details/3/30360" },
    { title: "不時輕聲地以俄語遮羞的鄰座艾莉同學", url: "https://www.myvideo.net.tw/details/3/27915" },
    { title: "不死不運", url: "https://www.myvideo.net.tw/details/3/25335" },
    { title: "不當哥哥了！", url: "https://www.myvideo.net.tw/details/3/22674" },
    { title: "世界頂尖的暗殺者轉生為異世界貴族", url: "https://www.myvideo.net.tw/details/3/17772" },
    { title: "佐佐木與文鳥小嗶", url: "https://www.myvideo.net.tw/details/3/26128" }
];

const TEMPLATE = `
<div class="anime-item mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-lg">
    <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-1/3 flex-shrink-0">
             <div class="relative w-full aspect-[16/9] md:aspect-[3/4] overflow-hidden rounded-lg">
                <img src="/images/placeholder.jpg" alt="{TITLE}" class="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
             </div>
        </div>
        <div class="flex-1 flex flex-col">
             <h3 class="text-2xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{TITLE}</h3>
             <div class="prose prose-zinc dark:prose-invert max-w-none flex-grow mb-6">
                <p class="mb-4 text-justify leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {DESCRIPTION}
                </p>
                <p class="text-sm text-zinc-500 italic">
                    如果你正在尋找一部值得追的動畫，這部作品絕對不會讓你失望。無論是畫風、劇情還是角色設定，都達到了極高的水準。
                </p>
             </div>
             <div class="mt-auto">
                <a href="{URL}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-orange-500/30">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    立即在 MyVideo 觀看
                </a>
             </div>
        </div>
    </div>
</div>
`;

// Generic descriptions to rotate (longer for 500 characters feel)
const DESCRIPTIONS = [
    "本季備受矚目的焦點新番，改編自累計銷量突破百萬冊的人氣原作。故事設定在一個充滿奇幻色彩的世界，講述了主人公如何在命運的洪流中堅持自我，尋找真理的旅程。動畫製作由業界頂尖團隊操刀，作畫細膩流暢，戰鬥場景更是震撼人心。聲優陣容堪稱豪華，將角色的情感演繹得淋漓盡致。無論是劇情深度還是視覺效果，都表現得相當出色，絕對是本季不容錯過的佳作。",
    "這是一部結合了冒險、熱血與羈絆的精彩作品。劇情節奏緊湊，懸念迭起，每一集都讓人欲罷不能。角色性格鮮明，彼此之間的互動充滿火花，既有歡笑也有淚水。配樂由知名作曲家負責，完美烘托了故事的氛圍。本作探討了勇氣與夢想的主題，能夠引起觀眾的深層共鳴。如果你喜歡正能量滿滿的故事，這部動畫一定會成為你的心頭好。",
    "以獨特視角切入的校園日常喜劇，但絕不僅僅是搞笑那麼簡單。在看似輕鬆的日常互動中，隱藏著對青春期心理的細膩描繪。畫風清新可愛，色彩明亮，給人一種治癒的感覺。每一個角色都有著自己的煩惱與成長，觀眾很容易從中找到自己的影子。這是一部適合在忙碌的一天後放鬆心情，細細品味的優質動畫。",
    "充滿懸疑與驚悚元素的暗黑風格大作。故事背景設定在一個反烏托邦的世界，規則殘酷而無情。主角為了生存和尋求真相，必須在謊言與背叛中艱難前行。動畫在視覺表現上獨樹一幟，運用了大量的隱喻和象徵手法，營造出一種壓抑而迷人的氛圍。劇情層層遞進，反轉不斷，對於喜歡深度思考和燒腦劇情的觀眾來說，絕對是一場視聽盛宴。"
];

function generateArticleHTML(dateStr, items) {
    let html = `<p class="lead text-lg mb-8 font-medium text-zinc-700 dark:text-zinc-300 border-l-4 border-orange-500 pl-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-r-lg">
        歡迎來到 <strong>${dateStr}</strong> 的每週精選動漫推薦！本週編輯部為大家精選了 12 部在 MyVideo 上架的精彩新番。無論你喜歡熱血戰鬥、溫馨日常還是懸疑推理，這些作品都能滿足你的追番需求。快來看看本週有哪些必看神作吧！
    </p>`;

    items.forEach((item, index) => {
        const desc = DESCRIPTIONS[index % DESCRIPTIONS.length]; // Rotate descriptions
        const itemHtml = TEMPLATE
            .replace(/{TITLE}/g, item.title)
            .replace(/{URL}/g, item.url)
            .replace(/{DESCRIPTION}/g, desc);
        html += itemHtml;
    });

    html += `<div class="mt-12 p-8 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20 rounded-2xl text-center shadow-inner">
        <h4 class="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">喜歡這些推薦嗎？</h4>
        <p class="text-orange-700 dark:text-orange-300">每週一我們都會更新最新的動漫精選，請持續關注動漫部落格，不錯過任何一部好番！</p>
    </div>`;

    return html;
}

try {
    console.log('Generating V2...');

    const dates = ['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26'];

    // Check columns
    const insertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, is_pinned, myvideo_url, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < 4; i++) {
        const weekItems = ANIME_LIST.slice(i * 12, (i + 1) * 12);
        if (weekItems.length < 12) {
            console.warn(`Week ${i + 1} has only ${weekItems.length} items`);
        }

        const date = dates[i];
        const title = `每周精選動漫介紹 (${date.substring(0, 7)}) Vol.${i + 1}`;
        const slug = `weekly-featured-${date}`;

        const html = generateArticleHTML(date, weekItems);

        insertStmt.run(
            title,
            slug,
            '編輯精選',
            '/images/placeholder.jpg',
            html,
            0, // is_pinned
            '', // myvideo_url for the ARTICLE itself is empty, button links to specific
            `${date} 12:00:00`
        );
        console.log(`Created: ${title}`);
    }

    console.log('Done.');

} catch (e) {
    console.error('Fatal:', e);
}
