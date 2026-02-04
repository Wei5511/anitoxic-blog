const axios = require('axios');
const cheerio = require('cheerio');
const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Helper for delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Headers to mimic browser
const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
};

async function searchBahamut(keyword) {
    try {
        const url = `https://ani.gamer.com.tw/search.php?keyword=${encodeURIComponent(keyword)}`;
        const res = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(res.data);

        // Correct Selector: .anime-card-list a.theme-list-main
        const linkEl = $('.anime-card-list a.theme-list-main').first();
        const firstLink = linkEl.attr('href');
        const title = linkEl.find('.theme-name').text().trim();

        if (firstLink) {
            return {
                url: `https://ani.gamer.com.tw/${firstLink}`,
                title: title
            };
        }
        return null;
    } catch (e) {
        console.error(`Search error for ${keyword}: ${e.message}`);
        return null;
    }
}

async function getDetails(url) {
    try {
        const res = await axios.get(url, { headers: HEADERS });
        const $ = cheerio.load(res.data);

        // Correct Selector: .data-intro (hyphen)
        const synopsis = $('.data-intro').text().trim();

        return { synopsis };
    } catch (e) {
        console.error(`Detail error for ${url}: ${e.message}`);
        return null;
    }
}

async function main() {
    // 1. Get targets: English synopsis (heuristic)
    const targets = db.prepare("SELECT mal_id, title FROM anime WHERE synopsis LIKE '% The %' OR synopsis LIKE '% in %' LIMIT 50").all();

    console.log(`Found ${targets.length} targets to localize...`);

    for (const row of targets) {
        console.log(`Processing [${row.mal_id}] ${row.title}...`);

        // Search
        await delay(1500); // 1.5s delay
        const result = await searchBahamut(row.title);

        if (result && result.url) {
            console.log(`  Found URL: ${result.url}`);
            console.log(`  Bahamut Title: ${result.title}`);

            await delay(1000);
            const data = await getDetails(result.url);

            if (data && data.synopsis) {
                // Use Bahamut title if available, otherwise keep original? 
                // User wants "Taiwan translation". So use Bahamut title.
                const newTitle = result.title || row.title;
                if (result.title) {
                    console.log(`  -> New Title: ${newTitle}`);
                }
                console.log(`  -> New Synopsis: ${data.synopsis.substring(0, 50)}...`);

                // Update DB
                const info = db.prepare("UPDATE anime SET title = ?, synopsis = ? WHERE mal_id = ?").run(newTitle, data.synopsis, row.mal_id);
                console.log(`  Database updated: ${info.changes}`);
            } else {
                console.log(`  Failed to parse details (synopsis missing).`);
            }
        } else {
            console.log(`  No match found.`);
        }
    }
}

main();
