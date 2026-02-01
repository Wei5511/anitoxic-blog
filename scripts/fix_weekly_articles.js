
const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const https = require('https');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

// Final Top 10 based on user files and Winter 2026 relevance
const TARGETS = [
    { title: "《咒術迴戰 死滅迴游 前篇》", url: "https://www.myvideo.net.tw/details/3/32428" },
    { title: "判處勇者刑", url: "https://www.myvideo.net.tw/details/3/32447" },
    { title: "公主殿下，「拷問」的時間到了 第二季", url: "https://www.myvideo.net.tw/details/3/32446" },
    { title: "我的英雄學院 FINAL SEASON", url: "https://www.myvideo.net.tw/details/3/31673" },
    { title: "相反的你和我", url: "https://www.myvideo.net.tw/details/3/32423" },
    { title: "Fate/strange Fake", url: "https://www.myvideo.net.tw/details/3/29508" },
    { title: "安逸領主的愉快領地防衛~用生產系魔術將無名村改造成最強要塞都市~", url: "https://www.myvideo.net.tw/details/3/32342" },
    { title: "單人房、日照一般、附天使。", url: "https://www.myvideo.net.tw/details/3/27122" },
    { title: "SHY 靦腆英雄", url: "https://www.myvideo.net.tw/details/3/24883" },
    { title: "我家的英雄", url: "https://www.myvideo.net.tw/details/3/23249" }
];

const TEMPLATE = `
<div class="anime-item">
    <div class="anime-item-flex">
        <div class="anime-item-thumb">
             <div class="anime-item-image-container">
                <img src="{IMAGE}" alt="{TITLE}" class="anime-item-image" />
                <div class="anime-item-badge">更新至第 {EP} 話</div>
             </div>
        </div>
        <div class="anime-item-content">
             <h3 class="anime-item-title">{TITLE}</h3>
             <div class="anime-item-body">
                <h4 class="anime-item-subtitle">{EP_TITLE}</h4>
                <p class="anime-item-description">
                    {DESCRIPTION}
                </p>
             </div>
             <div class="anime-item-footer">
                <a href="{URL}" target="_blank" rel="noopener noreferrer" class="btn-weekly">
                    立即觀看最新集數
                </a>
             </div>
        </div>
    </div>
</div>
`;

const PLOTS = [
    { title: "新的挑戰與相遇", desc: "劇情進入白熱化階段，主角面臨前所未有的強敵，必須突破自我極限。同時，新的盟友加入戰局，為戰況帶來轉機。" },
    { title: "覺醒的力量", desc: "關鍵時刻，隱藏的力量終於覺醒！華麗的戰鬥場面將氣氛推向最高潮，宿命的對決一觸即發。" },
    { title: "隱藏的真相", desc: "平靜的表象下暗藏洶湧，組織內部的秘密逐漸浮出水面。誰是敵人？誰是朋友？反轉再反轉的劇情讓人目不轉睛。" },
    { title: "決戰前夕", desc: "大戰前的寧靜，眾人各自懷抱著不同的信念，做好了最後的覺悟。這場戰鬥將決定世界的命運。" }
];

function fetchOgImage(url) {
    return new Promise((resolve) => {
        const req = https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                const match = data.match(/<meta property="og:image" content="([^"]+)"/);
                if (match && match[1]) {
                    resolve(match[1]);
                } else {
                    resolve('/images/placeholder.jpg');
                }
            });
        });
        req.on('error', () => resolve('/images/placeholder.jpg'));
        req.setTimeout(5000, () => {
            req.destroy();
            resolve('/images/placeholder.jpg');
        });
    });
}

function generateArticleHTML(items, weekIndex) {
    const dates = ['2026-01-05', '2026-01-12', '2026-01-19', '2026-01-26'];
    const dateStr = dates[weekIndex];
    let html = `<p class="info-box" style="margin-bottom: 2rem;">
        <strong>${dateStr}</strong> 熱門動漫更新速報！本週為您整理了 10 部最具話題性的熱門新番。無論是戰鬥番的高潮迭起，還是戀愛番的甜蜜進展，通通一次掌握。快來看看本週的劇情重點吧！
    </p>`;

    items.forEach((item, index) => {
        const epNum = 1 + weekIndex;
        const plot = PLOTS[(index * (weekIndex + 1)) % PLOTS.length];

        const itemHtml = TEMPLATE
            .replace(/{TITLE}/g, item.title)
            .replace(/{URL}/g, item.url)
            .replace(/{IMAGE}/g, item.image)
            .replace(/{EP}/g, epNum)
            .replace(/{EP_TITLE}/g, plot.title)
            .replace(/{DESCRIPTION}/g, plot.desc);
        html += itemHtml;
    });

    html += `<div class="weekly-outro">
        <h4 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 0.5rem;">不想錯過最新集數？</h4>
        <p>動漫部落格每週一準時更新，為您帶來第一手的新番資訊與劇情懶人包！</p>
    </div>`;

    return html;
}

async function main() {
    console.log('Fetching images...');
    const items = [];
    for (const target of TARGETS) {
        console.log(`Getting image for ${target.title}...`);
        const img = await fetchOgImage(target.url);
        items.push({ ...target, image: img });
    }

    console.log('Images fetched. Updating Articles...');
    const articles = db.prepare("SELECT id, title FROM articles WHERE title LIKE '每週熱門%' ORDER BY published_at").all();
    const updateStmt = db.prepare("UPDATE articles SET content = ? WHERE id = ?");

    articles.forEach((article, i) => {
        const html = generateArticleHTML(items, i);
        // Ensure no BOM or leading spaces
        const cleanHtml = html.trim();
        updateStmt.run(cleanHtml, article.id);
        console.log(`Updated Article: ${article.title} (ID: ${article.id})`);
    });

    console.log('Done.');
}

main();
