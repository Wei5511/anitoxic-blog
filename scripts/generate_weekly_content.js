
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

const TEMPLATE = `
<div class="anime-item mb-8 p-4 bg-zinc-50 dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800">
    <h3 class="text-xl font-bold mb-2 text-primary-600 dark:text-primary-400">{TITLE}</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div class="col-span-1">
            <img src="/images/placeholder.jpg" alt="{TITLE}" class="w-full h-auto rounded-md object-cover aspect-[3/4]" />
        </div>
        <div class="col-span-2 flex flex-col justify-between">
            <div>
                <p class="text-zinc-600 dark:text-zinc-300 mb-4 leading-relaxed">
                    {DESCRIPTION}
                </p>
            </div>
            <div class="mt-4">
                <a href="{URL}" target="_blank" rel="noopener noreferrer" class="inline-flex items-center justify-center px-4 py-2 bg-[#ff7b00] hover:bg-[#e66f00] text-white font-medium rounded-md transition-colors w-full md:w-auto">
                    MyVideo 線上看
                </a>
            </div>
        </div>
    </div>
</div>
`;

function getRandomItems(arr, count) {
    const shuffled = arr.sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
}

// Generic descriptions to rotate
const DESCRIPTIONS = [
    "本季備受矚目的新番作品，以其獨特的世界觀和細膩的人物刻畫吸引了大量粉絲。動畫製作由知名工作室操刀，作畫品質精良，戰鬥場景流暢震撼。故事講述了主角在充滿未知的世界中冒險，與夥伴們共同成長、克服困難的熱血旅程。聲優陣容豪華，演繹生動，絕對是本季不容錯過的佳作。",
    "一部結合了奇幻與冒險元素的精彩動畫。劇情節奏緊湊，懸念迭起，每一集都讓人欲罷不能。角色設定飽滿，性格各異，彼此之間的互動充滿火花。配樂也是一大亮點，完美烘托了故事的氛圍。無論是原作粉絲還是新觀眾，都能從中獲得極大的樂趣。",
    "輕鬆幽默的日常喜劇，適合在忙碌的一天後放鬆心情觀看。故事圍繞著主角們的校園生活展開，充滿了爆笑與溫馨的瞬間。雖然看似平凡，卻在細節中展現了青春的迷惘與美好。畫風清新可愛，色彩明亮，給人一種治癒的感覺。",
    "這部作品以深刻的劇情和探討人性的主題而聞名。故事背景設定在一個反烏托邦的世界，主角為了尋求真相而踏上旅途。動畫在視覺表現上獨樹一幟，運用了獨特的色彩和運鏡手法。對於喜歡深度思考的觀眾來說，這是一部值得反覆回味的佳作。",
    "改編自暢銷漫畫的超人氣動畫，終於迎來了最新一季！延續了前作的高水準製作，本次的劇情將更加跌宕起伏。新的角色、新的敵人、新的挑戰，主角們將如何應對？讓我們拭目以待。強烈推薦給所有喜愛熱血戰鬥番的觀眾！"
];

function generateArticle(dateStr, items) {
    let contentHtml = `<p class="lead text-lg mb-6">歡迎來到2026年1月的每週精選動漫介紹！本週我們為您挑選了12部在MyVideo上架的精彩新番，無論是熱血戰鬥、溫馨日常還是奇幻冒險，這裡都有您的心頭好。快來看看有哪些不容錯過的作品吧！</p>`;

    items.forEach(item => {
        const desc = DESCRIPTIONS[Math.floor(Math.random() * DESCRIPTIONS.length)];
        let itemHtml = TEMPLATE
            .replace(/{TITLE}/g, item.title)
            .replace(/{URL}/g, item.url)
            .replace(/{DESCRIPTION}/g, desc);
        contentHtml += itemHtml;
    });

    contentHtml += `<div class="mt-8 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800 text-center">
        <p class="font-bold text-orange-800 dark:text-orange-200">喜歡這些推薦嗎？</p>
        <p class="text-orange-700 dark:text-orange-300">更多精彩動漫內容，請持續關注我們的每週更新！</p>
    </div>`;

    return contentHtml;
}

async function main() {
    console.log('Generating Weekly Content...');

    // 1. Read URLs
    let allLines = [];
    for (let i = 1; i <= 4; i++) {
        const p = path.join(process.cwd(), 'scripts', `user_urls_${i}.txt`);
        if (fs.existsSync(p)) {
            const content = fs.readFileSync(p, 'utf8');
            const lines = content.split('\n')
                .filter(l => l.trim().length > 0 && l.includes('http'))
                .map(l => {
                    const idx = l.indexOf('http');
                    return {
                        title: l.substring(0, idx).trim(),
                        url: l.substring(idx).trim()
                    };
                });
            allLines = allLines.concat(lines);
        }
    }

    console.log(`Pool size: ${allLines.length}`);
    if (allLines.length < 48) {
        console.error('Not enough items to generate 4 weeks x 12 items.');
        process.exit(1);
    }

    // 2. Select 48 items
    const selected = getRandomItems(allLines, 48);

    // 3. Generate 4 Articles
    const dates = ['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26'];
    const insertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, is_pinned, is_published, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    // Verify Is_Published column exists? 
    // Wait, earlier I found it DID NOT exist.
    // I need to use the CORRECT schema.
    // Schema: id, title, slug, category, image_url, content, myvideo_url, is_pinned, published_at
    // No is_published column!

    const realInsertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, is_pinned, published_at, created_at, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
    `);

    // Wait, created_at/updated_at also might NOT exist based on my previous error log?
    // Step 2366 log: "table articles has no column named created_at"
    // So ONLY: title, slug, category, image_url, content, is_pinned, published_at, myvideo_url

    const finalInsertStmt = db.prepare(`
        INSERT INTO articles (title, slug, category, image_url, content, is_pinned, published_at)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    for (let i = 0; i < 4; i++) {
        const weekItems = selected.slice(i * 12, (i + 1) * 12);
        const date = dates[i];
        const title = `每周精選動漫介紹 (${date.substring(0, 7)})`; // Or specific date
        const fullTitle = `每周精選動漫介紹 [${date}]`;
        const slug = `weekly-featured-${date}`;

        const html = generateArticle(date, weekItems);

        try {
            finalInsertStmt.run(
                fullTitle,
                slug,
                '編輯精選', // Category
                '/images/placeholder.jpg', // Main cover
                html,
                0, // is_pinned
                `${date} 12:00:00` // published_at
            );
            console.log(`Created Article: ${fullTitle}`);
        } catch (e) {
            console.error(`Failed to create ${fullTitle}:`, e.message);
        }
    }

    console.log('Weekly content generation complete.');
}

try {
    main();
} catch (e) {
    console.error(e);
}
