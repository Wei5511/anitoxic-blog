const puppeteer = require('puppeteer');
const db = require('better-sqlite3')('anime.db');
const fs = require('fs');
const path = require('path');

const QUARTERS = [
    '202301', '202304', '202307', '202310',
    '202401', '202404', '202407', '202410',
    '202501', '202504', '202507', '202510'
];

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'anime');
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Prepare DB statements
const getAnimeBySeason = db.prepare("SELECT mal_id, title FROM anime WHERE year = ? AND season = ?");
const updateStmt = db.prepare("UPDATE anime SET image_url = ? WHERE mal_id = ?");

function getSeasonName(q) {
    const m = q.slice(4);
    if (m === '01') return 'winter';
    if (m === '04') return 'spring';
    if (m === '07') return 'summer';
    if (m === '10') return 'fall';
    return 'unknown';
}

(async () => {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();

    // Set viewport to ensure lazy loaded images might trigger (though we might need to scroll)
    await page.setViewport({ width: 1280, height: 800 });

    for (const q of QUARTERS) {
        const year = parseInt(q.slice(0, 4));
        const season = getSeasonName(q);
        const url = `https://youranimes.tw/bangumi/${q}`;
        console.log(`Processing ${year} ${season} (${url})...`);

        // Get DB entries for this season to match titles
        // Note: Our DB titles are Traditional Chinese now.
        const dbAnime = getAnimeBySeason.all(year, season);
        const titleMap = new Map();
        dbAnime.forEach(a => titleMap.set(a.title.trim(), a.mal_id));

        console.log(`  DB has ${dbAnime.length} entries for this season.`);

        try {
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Scroll to bottom to trigger lazy loads
            await page.evaluate(async () => {
                await new Promise((resolve) => {
                    let totalHeight = 0;
                    const distance = 100;
                    const timer = setInterval(() => {
                        const scrollHeight = document.body.scrollHeight;
                        window.scrollBy(0, distance);
                        totalHeight += distance;
                        if (totalHeight >= scrollHeight - window.innerHeight) {
                            clearInterval(timer);
                            resolve();
                        }
                    }, 100);
                });
            });

            // Extract image data
            // We return a list of { title, imgSrc }
            const pageData = await page.evaluate(() => {
                const items = [];
                document.querySelectorAll('article').forEach(el => {
                    const title = el.querySelector('h3 a')?.innerText.trim();
                    const img = el.querySelector('img');
                    const src = img?.src || img?.dataset?.src; // Check lazy load attr too
                    if (title && src) {
                        items.push({ title, src });
                    }
                });
                return items;
            });

            console.log(`  Found ${pageData.length} images on page.`);

            let savedCount = 0;
            for (const item of pageData) {
                const mal_id = titleMap.get(item.title);
                if (!mal_id) {
                    // console.log(`    Skipping unknown title: ${item.title}`);
                    continue;
                }

                const filename = `${mal_id}.jpg`;
                const dest = path.join(IMAGE_DIR, filename);
                const localUrl = `/images/anime/${filename}`;

                // Force overwrite
                // if (fs.existsSync(dest)) { ... }

                try {
                    // Fetch image from WITHIN browser context to get cookies/referer pass
                    const base64Data = await page.evaluate(async (imgUrl) => {
                        const response = await fetch(imgUrl);
                        if (!response.ok) throw new Error('Status ' + response.status);
                        const blob = await response.blob();
                        if (blob.size < 1000) throw new Error('Too small');
                        return new Promise((resolve, reject) => {
                            const reader = new FileReader();
                            reader.onloadend = () => resolve(reader.result);
                            reader.onerror = reject;
                            reader.readAsDataURL(blob);
                        });
                    }, item.src);

                    // Remove header (data:image/jpeg;base64,)
                    const matches = base64Data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
                    if (matches && matches.length === 3) {
                        const buffer = Buffer.from(matches[2], 'base64');
                        fs.writeFileSync(dest, buffer);
                        updateStmt.run(localUrl, mal_id);
                        savedCount++;
                    } else {
                        console.error(`    Invalid base64 for ${item.title}`);
                    }

                } catch (e) {
                    console.error(`    Failed to fetch ${item.title}: ${e.message}`);
                }
            }
            console.log(`  Saved/Updated ${savedCount} images.`);

        } catch (e) {
            console.error(`  Error processing page: ${e.message}`);
        }
    }

    await browser.close();
    console.log('Done!');
})();
