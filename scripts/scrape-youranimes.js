const https = require('https');
const http = require('http');
const cheerio = require('cheerio');
const fs = require('fs');

const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';
const DELAY_MS = 1000;

// Helper: Fetch URL content
function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;
        const options = {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
            }
        };
        client.get(url, options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(data);
                } else {
                    reject(new Error(`HTTP ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeYouranimes() {
    console.log('=== Scraping Youranimes.tw (2010-2022) [Optimized] ===\n');

    const seasons = [];
    for (let year = 2010; year <= 2022; year++) {
        for (let month of ['01', '04', '07', '10']) {
            seasons.push(`${year}${month}`);
        }
    }

    const allAnime = new Map();
    let seasonCount = 0;

    for (const season of seasons) {
        seasonCount++;
        const url = `https://youranimes.tw/bangumi/${season}`;

        try {
            process.stdout.write(`[${seasonCount}/${seasons.length}] Fetching ${season}... `);
            const html = await fetchURL(url);
            const $ = cheerio.load(html);

            let count = 0;
            $('a[href*="/animes/"]').each((i, el) => {
                const href = $(el).attr('href');
                const match = href.match(/\/animes\/(\d+)/);
                if (match) {
                    const id = match[1];
                    const title = $(el).text().trim();

                    // Filter out bad titles (sometimes images are wrapped in A tags)
                    if (title && !allAnime.has(id)) {
                        allAnime.set(id, {
                            youranime_id: id,
                            chinese_title: title,
                            japanese_title: null, // We won't have this, but import script can fallback to fuzzy matching or ID matching if we had common IDs?
                            // Wait, without Japanese title, how do we match?
                            // We need to hope the "Title" from list page matches Chinese column?
                            // Or we need Japanese title... 
                            // The list page usually has only the main title (Chinese).
                            // BUT, we can try to match this Chinese title to existing empty records? 
                            // No, existing records have English/Japanese.
                            // We need to link by something. 
                            // If we don't have japanese_title, our import script relying on it will fail.
                            // Does the list page contain Japanese title?
                            // "無頭騎士異聞錄 DuRaRaRa!!" -> "DuRaRaRa!!" matches?
                            // Let's modify import script to attempt fuzzy match if no JP title.
                            season: season,
                            url: `https://youranimes.tw/animes/${id}`
                        });
                        count++;
                    }
                }
            });

            console.log(`Found ${count} titles.`);
            await delay(DELAY_MS);

        } catch (error) {
            console.log(`❌ Error: ${error.message}`);
        }
    }

    console.log(`\n Total unique anime: ${allAnime.size}`);

    const animeData = Array.from(allAnime.values());
    fs.writeFileSync('youranimes-data.json', JSON.stringify(animeData, null, 2));
    console.log('Saved to youranimes-data.json');
}

if (require.main === module) {
    scrapeYouranimes();
}

module.exports = { scrapeYouranimes };
