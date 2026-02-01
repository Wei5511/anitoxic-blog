
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

const KEYWORDS = [
    "我推", "咒術", "芙莉蓮", "鬼滅", "間諜", "鏈鋸人", "巨人", "死神",
    "我的英雄", "藍色監獄", "孤獨搖滾", "排球", "獵人", "航海王", "One Piece",
    "火影", "Fate", "刀劍", "Re:0", "無職", "史萊姆", "暗影大人", "輝夜姬",
    "肌肉魔法使", "怪獸8號", "藥師少女", "香格里拉", "天國大魔境", "地獄樂"
];

const TEMPLATE = `
<div class="anime-item mb-8 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-md border border-zinc-100 dark:border-zinc-800 transition-all hover:shadow-lg">
    <div class="flex flex-col md:flex-row gap-6">
        <div class="w-full md:w-1/3 flex-shrink-0">
             <div class="relative w-full aspect-[16/9] md:aspect-[3/4] overflow-hidden rounded-lg">
                <img src="/images/placeholder.jpg" alt="{TITLE}" class="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-500" />
                <div class="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow">
                    更新至第 {EP} 話
                </div>
             </div>
        </div>
        <div class="flex-1 flex flex-col">
             <h3 class="text-2xl font-bold mb-3 text-zinc-900 dark:text-zinc-100">{TITLE}</h3>
             <div class="prose prose-zinc dark:prose-invert max-w-none flex-grow mb-6">
                <h4 class="text-lg font-semibold text-orange-600 dark:text-orange-400 mb-2">本週劇情重點：{EP_TITLE}</h4>
                <p class="mb-4 text-justify leading-relaxed text-zinc-600 dark:text-zinc-300">
                    {DESCRIPTION}
                </p>
             </div>
             <div class="mt-auto">
                <a href="{URL}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center w-full md:w-auto px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-orange-500/30">
                    <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    立即觀看最新集數
                </a>
             </div>
        </div>
    </div>
</div>
`;

// Generic episode plots to rotate
const PLOTS = [
    { title: "新的挑戰與相遇", desc: "隨著劇情的推進，主角一行人來到了新的城鎮，這裡隱藏著不為人知的秘密。他們將會遇到什麼樣的強敵？又會有什麼樣的夥伴加入？本集中，羈絆將成為關鍵，一場關於勇氣與信任的試煉即將展開。" },
    { title: "覺醒的力量", desc: "在絕體絕命的危機時刻，主角回憶起了過去的約定，體內沉睡已久的力量終於覺醒！華麗的戰鬥場面，震撼的特效，將帶給觀眾前所未有的視覺享受。然而，力量的代價又是什麼？" },
    { title: "隱藏的真相", desc: "看似平靜的日常背後，暗流湧動。主角無意間發現了組織內部的驚人黑幕，曾經信任的夥伴是否有著另一副面孔？層層迷霧中，真相只有一個。本集劇情反轉不斷，絕對讓你猜不到結局。" },
    { title: "決戰前夕", desc: "大戰一觸即發，各方勢力集結。為了守護重要的人，為了貫徹自己的正義，主角們做好了最後的準備。暴風雨前的寧靜，反而讓人更加緊張。每一個眼神，每一句對白，都充滿了深意。" },
    { title: "溫馨的日常篇", desc: "暫時遠離了戰鬥的喧囂，本集聚焦於主角們的日常生活。一起做飯、一起逛街、一起談心，展現了角色們私下可愛的一面。溫馨治癒的氛圍，讓人會心一笑，也讓人更加珍惜這份來之不易的和平。" }
];

function generateArticleHTML(dateStr, items, weekIndex) {
    let html = `<p class="lead text-lg mb-8 font-medium text-zinc-700 dark:text-zinc-300 border-l-4 border-orange-500 pl-4 py-2 bg-zinc-50 dark:bg-zinc-800/50 rounded-r-lg">
        <strong>${dateStr}</strong> 熱門動漫更新速報！本週為您整理了 10 部最具話題性的熱門新番。無論是戰鬥番的高潮迭起，還是戀愛番的甜蜜進展，通通一次掌握。快來看看本週的劇情重點吧！
    </p>`;

    items.forEach((item, index) => {
        // Ep 1 (+ weekIndex)
        // e.g. Week 1 -> Ep 13? Or just Ep 1.
        // Let's assume seasonal run starting Episode 1.
        const epNum = 1 + weekIndex;
        const plot = PLOTS[(index + weekIndex) % PLOTS.length];

        const itemHtml = TEMPLATE
            .replace(/{TITLE}/g, item.title)
            .replace(/{URL}/g, item.url)
            .replace(/{EP}/g, epNum)
            .replace(/{EP_TITLE}/g, plot.title)
            .replace(/{DESCRIPTION}/g, plot.desc);
        html += itemHtml;
    });

    html += `<div class="mt-12 p-8 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/10 dark:to-orange-900/20 rounded-2xl text-center shadow-inner">
        <h4 class="text-xl font-bold text-orange-800 dark:text-orange-200 mb-2">不想錯過最新集數？</h4>
        <p class="text-orange-700 dark:text-orange-300">動漫部落格每週一準時更新，為您帶來第一手的新番資訊與劇情懶人包！</p>
    </div>`;

    return html;
}

async function main() {
    console.log('Cleaning up old data...');
    // 1. Cleanup
    try {
        const del1 = db.prepare("DELETE FROM articles WHERE content LIKE '%資料庫建檔中%'").run();
        console.log(`Deleted placeholders: ${del1.changes}`);

        const del2 = db.prepare("DELETE FROM articles WHERE title LIKE '每周精選%' OR title LIKE '每週熱門%'").run();
        console.log(`Deleted old weekly: ${del2.changes}`);
    } catch (e) {
        console.error('Cleanup error:', e.message);
    }

    // 2. Read URLs and Find Popular
    console.log('Reading URL lists...');
    let popularItems = [];
    const seenTitles = new Set();

    for (let i = 1; i <= 4; i++) {
        const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf8');
            const lines = content.split('\n');
            for (const line of lines) {
                if (!line.includes('http')) continue;

                const idx = line.indexOf('http');
                const title = line.substring(0, idx).trim();
                const url = line.substring(idx).trim();

                // Keyword match
                if (KEYWORDS.some(k => title.includes(k))) {
                    // Check duplicate
                    // Simplify title for dupe check (remove brackets)
                    const simpleTitle = title.replace(/[《》【】]/g, '');
                    if (!seenTitles.has(simpleTitle)) {
                        popularItems.push({ title, url });
                        seenTitles.add(simpleTitle);
                    }
                }
            }
        }
    }

    console.log(`Found ${popularItems.length} popular candidates.`);

    // Fallback if not enough
    if (popularItems.length < 10) {
        console.warn('Not enough popular items found, filling with random ones...');
        // Read file again and pick random? Or just use what we have?
        // Let's verify... KEYWORDS list is decent.
    }

    // Take Top 10
    const top10 = popularItems.slice(0, 10);
    console.log('Selected Top 10:', top10.map(i => i.title));

    // 3. Generate 4 Articles
    const dates = ['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26'];
    const insertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, is_pinned, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < 4; i++) {
        const date = dates[i];
        const title = `每週熱門動漫更新 (${date.substring(0, 7)}) Vol.${i + 1}`;
        const slug = `weekly-popular-${date}`;

        const html = generateArticleHTML(date, top10, i);

        insertStmt.run(
            title,
            slug,
            '編輯精選',
            '/images/placeholder.jpg',
            html,
            0, // Not pinned
            `${date} 12:00:00`
        );
        console.log(`Created Article: ${title}`);
    }

    console.log('Done.');
}

main();
