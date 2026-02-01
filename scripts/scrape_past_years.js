const puppeteer = require('puppeteer');
const db = require('better-sqlite3')('anime.db');

const QUARTERS = [
    '202301', '202304', '202307', '202310',
    '202401', '202404', '202407', '202410',
    '202501', '202504', '202507', '202510'
];

const insertStmt = db.prepare(`
    INSERT INTO anime (
      mal_id, title, title_japanese, synopsis, image_url, trailer_url, youtube_id,
      score, status, season, year, episodes, aired_from, genres, studios, source, rating,
      staff, cast, streaming, updated_at
    ) VALUES (
      @mal_id, @title, @title_japanese, @synopsis, @image_url, @trailer_url, @youtube_id,
      @score, @status, @season, @year, @episodes, @aired_from, @genres, @studios, @source, @rating,
      @staff, @cast, @streaming, CURRENT_TIMESTAMP
    )
    ON CONFLICT(mal_id) DO UPDATE SET
      title = @title,
      title_japanese = @title_japanese,
      synopsis = @synopsis,
      image_url = @image_url,
      youtube_id = @youtube_id,
      staff = @staff,
      cast = @cast,
      streaming = @streaming,
      source = @source,
      studios = @studios,
      updated_at = CURRENT_TIMESTAMP
`);

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

    for (const q of QUARTERS) {
        const year = parseInt(q.slice(0, 4));
        const season = getSeasonName(q);
        const url = `https://youranimes.tw/bangumi/${q}`;
        console.log(`Processing ${year} ${season} (${url})...`);

        try {
            await page.goto(url, { waitUntil: 'networkidle2' });

            // Wait for articles to load
            try {
                await page.waitForSelector('article', { timeout: 5000 });
            } catch (e) {
                console.log(`  No articles found for ${q}`);
                continue;
            }

            // Expand detailed info if needed? Usually it's in the DOM.
            // Extract data
            const animes = await page.evaluate(() => {
                const results = [];
                document.querySelectorAll('article').forEach((el, index) => {
                    const title = el.querySelector('h3 a')?.innerText.trim();
                    const title_jp = el.querySelector('h3 + p')?.innerText.trim();
                    const imgUrl = el.querySelector('img')?.src;

                    let synopsis = '';
                    const h4s = el.querySelectorAll('h4');
                    h4s.forEach(h4 => {
                        if (h4.innerText.includes('作品簡介')) {
                            synopsis = h4.nextElementSibling?.innerText.trim();
                        }
                    });

                    let studios = '';
                    el.querySelectorAll('li').forEach(li => {
                        if (li.innerText.includes('製作公司')) {
                            studios = li.innerText.replace('製作公司:', '').trim();
                        }
                    });

                    // Source
                    let source = 'Unknown';
                    el.querySelectorAll('li').forEach(li => {
                        if (li.innerText.includes('漫畫改編')) source = 'Manga';
                        else if (li.innerText.includes('小說改編')) source = 'Light Novel';
                        else if (li.innerText.includes('原創')) source = 'Original';
                    });

                    // Youtube
                    let youtube_id = null;
                    const ytImg = el.querySelector('img[src*="i.ytimg.com"]');
                    if (ytImg) {
                        const m = ytImg.src.match(/\/vi(?:_webp)?\/([^\/]+)\//);
                        if (m) youtube_id = m[1];
                    }

                    // Streaming
                    const streaming = [];
                    const providers = ['巴哈姆特', 'Netflix', 'Disney+', 'KKTV', 'Hami Video', '中華電信', 'friDay', 'MyVideo', 'LINE TV', 'CATCHPLAY', '愛奇藝', 'Muse', 'Ani-One', 'YouTube'];
                    el.querySelectorAll('a').forEach(a => {
                        const txt = a.innerText.trim();
                        if (providers.some(p => txt.includes(p))) {
                            streaming.push({ name: txt, url: a.href });
                        }
                    });

                    // Staff
                    const staff = [];
                    h4s.forEach(h4 => {
                        if (h4.innerText.includes('製作陣容')) {
                            const ul = h4.nextElementSibling;
                            if (ul && ul.tagName === 'UL') {
                                ul.querySelectorAll('li').forEach(li => {
                                    const divs = li.querySelectorAll('div');
                                    if (divs.length >= 2) {
                                        staff.push({ name: divs[0].innerText.trim(), role: divs[1].innerText.trim() });
                                    }
                                });
                            }
                        }
                    });

                    // Cast
                    const cast = [];
                    h4s.forEach(h4 => {
                        if (h4.innerText.includes('演出聲優')) {
                            const ul = h4.nextElementSibling;
                            if (ul && ul.tagName === 'UL') {
                                ul.querySelectorAll('li').forEach(li => {
                                    const divs = li.querySelectorAll('div');
                                    if (divs.length >= 2) {
                                        let actor = divs[0].innerText.replace('CV:', '').trim();
                                        cast.push({ name: actor, character: divs[1].innerText.trim() });
                                    }
                                });
                            }
                        }
                    });

                    results.push({
                        title, title_jp, imgUrl, synopsis, studios, source, youtube_id, streaming, staff, cast
                    });
                });
                return results;
            });

            console.log(`  Found ${animes.length} entries. Inserting...`);

            // Insert
            let idCounter = parseInt(q + '000');
            for (const item of animes) {
                if (!item.title) continue;
                idCounter++;
                try {
                    insertStmt.run({
                        mal_id: idCounter,
                        title: item.title,
                        title_japanese: item.title_jp,
                        synopsis: item.synopsis,
                        image_url: item.image_url || item.imgUrl,
                        trailer_url: item.youtube_id ? `https://www.youtube.com/watch?v=${item.youtube_id}` : null,
                        youtube_id: item.youtube_id,
                        score: null,
                        status: 'Finished Airing', // Assumption
                        season: season,
                        year: year,
                        episodes: null,
                        aired_from: `${year}-01-01`,
                        genres: 'Action',
                        studios: item.studios,
                        source: item.source,
                        rating: 'PG-13',
                        staff: JSON.stringify(item.staff),
                        cast: JSON.stringify(item.cast),
                        streaming: JSON.stringify(item.streaming)
                    });
                } catch (e) {
                    console.error(`  Error inserting ${item.title}:`, e.message);
                }
            }

        } catch (e) {
            console.error(`Error processing ${q}:`, e.message);
        }
    }

    await browser.close();
    console.log('Done!');
})();
