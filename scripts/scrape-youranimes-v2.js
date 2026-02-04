// Scrape Youranimes.tw using read_url_content approach
// This will be more reliable than raw HTML parsing

const { exec } = require('child_process');
const util = require('util');
const execPromise = util.promisify(exec);
const fs = require('fs');

const DELAY_MS = 2000; // 2 seconds between requests

async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Use curl to fetch content (simpler than custom HTTP)
async function curlFetch(url) {
    try {
        const { stdout } = await execPromise(
            `curl -s "${url}" -H "User-Agent: AnimeBlogBot/1.0"`,
            { maxBuffer: 10 * 1024 * 1024 } // 10MB buffer
        );
        return stdout;
    } catch (error) {
        throw new Error(`Curl failed: ${error.message}`);
    }
}

// Parse HTML to extract anime data
function parseHTMLForAnime(html) {
    const animeList = [];

    // Find all links to anime pages
    const animeRegex = /<a[^>]*href="https?:\/\/youranimes\.tw\/animes\/(\d+)"[^>]*>([^<]+)<\/a>/gi;
    let match;

    const seen = new Set();
    while ((match = animeRegex.exec(html)) !== null) {
        const id = match[1];
        const title = match[2].trim();

        if (!seen.has(id)) {
            seen.add(id);
            animeList.push({ id, chineseTitle: title });
        }
    }

    return animeList;
}

// Extract Japanese title from detail page
function extractJapaneseTitle(html) {
    // Look for heading structure: Chinese title (h1) followed by Japanese text
    const lines = html.split('\n');

    for (let i = 0; i < lines.length - 1; i++) {
        const line = lines[i].trim();
        const nextLine = lines[i + 1].trim();

        // If current line is h1 (Chinese title), next line might be Japanese
        if (line.match(/<h1[^>]*>/)) {
            // Look ahead for Japanese characters
            for (let j = i + 1; j < Math.min(i + 5, lines.length); j++) {
                const checkLine = lines[j].replace(/<[^>]+>/g, '').trim();

                // Check if contains Japanese characters
                if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]{4,}/.test(checkLine)) {
                    // Must not be a URL or tag
                    if (!checkLine.includes('http') && !checkLine.includes('<')) {
                        return checkLine;
                    }
                }
            }
        }
    }

    // Alternative: Look in title/meta
    const titleMatch = html.match(/<title>([^<]+)<\/title>/);
    if (titleMatch) {
        const parts = titleMatch[1].split('|');
        if (parts.length > 0) {
            const titlePart = parts[0].trim();
            // The title might be "Chinese | 你的動畫", we want first part
            return titlePart;
        }
    }

    return null;
}

async function scrapeYouranimesSmart() {
    console.log('=== Smart Scraping Youranimes.tw (2016-2022) ===\n');
    console.log('Note: Youranimes.tw data starts from ~2016\n');

    // Start from 2016 since earlier data doesn't exist
    const seasons = [];
    for (let year = 2016; year <= 2022; year++) {
        for (let month of ['01', '04', '07', '10']) {
            seasons.push(`${year}${month}`);
        }
    }

    console.log(`Total seasons to scrape: ${seasons.length}\n`);

    const allAnime = new Map();
    let seasonCount = 0;

    // Phase 1: Collect anime IDs and Chinese titles from season pages
    for (const season of seasons) {
        seasonCount++;
        const url = `https://youranimes.tw/bangumi/${season}`;

        try {
            console.log(`[${seasonCount}/${seasons.length}] Fetching ${season}...`);
            const html = await curlFetch(url);
            const animeList = parseHTMLForAnime(html);

            console.log(`  Found ${animeList.length} anime`);

            for (const anime of animeList) {
                if (!allAnime.has(anime.id)) {
                    allAnime.set(anime.id, {
                        id: anime.id,
                        chineseTitle: anime.chineseTitle,
                        season: season
                    });
                }
            }

            if (seasonCount % 5 === 0) {
                console.log(`\n📊 Progress: ${seasonCount}/${seasons.length} seasons`);
                console.log(`   Unique anime: ${allAnime.size}\n`);
            }

            await delay(DELAY_MS);

        } catch (error) {
            console.error(`  ❌ Error: ${error.message}`);
        }
    }

    console.log(`\n=== Phase 1 Complete ===`);
    console.log(`Total unique anime: ${allAnime.size}`);
    console.log(`\n=== Phase 2: Fetching japanese titles ===\n`);

    const animeData = [];
    const animeArray = Array.from(allAnime.values());
    let processed = 0;
    let success = 0;

    for (const anime of animeArray) {
        processed++;
        const url = `https://youranimes.tw/animes/${anime.id}`;

        try {
            const html = await curlFetch(url);
            const japaneseTitle = extractJapaneseTitle(html);

            if (japaneseTitle) {
                animeData.push({
                    youranime_id: anime.id,
                    chinese_title: anime.chineseTitle,
                    japanese_title: japaneseTitle,
                    season: anime.season
                });
                success++;

                if (success <= 10 || success % 100 === 0) {
                    console.log(`✅ [${processed}/${animeArray.length}] ${anime.chineseTitle}`);
                    console.log(`   日文: ${japaneseTitle}`);
                }
            } else if (processed <= 10) {
                console.log(`⚠️  [${processed}/${animeArray.length}] No Japanese title: ${anime.chineseTitle}`);
            }

            if (processed % 50 === 0) {
                console.log(`\n📊 Progress: ${processed}/${animeArray.length} (${success} with Japanese titles)\n`);
            }

            await delay(DELAY_MS);

        } catch (error) {
            if (processed <= 10) {
                console.error(`❌ [${processed}/${animeArray.length}] Error: ${error.message}`);
            }
        }
    }

    console.log(`\n=== Scraping Complete ===`);
    console.log(`Processed: ${processed}`);
    console.log(`Success: ${success} (${((success / processed) * 100).toFixed(1)}%)`);

    // Save
    fs.writeFileSync('youranimes-data.json', JSON.stringify(animeData, null, 2));
    console.log(`\n✅ Saved ${animeData.length} anime to youranimes-data.json`);

    return animeData;
}

if (require.main === module) {
    scrapeYouranimesSmart()
        .then(() => {
            console.log('\n🎉 Done!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Fatal:', error);
            process.exit(1);
        });
}

module.exports = { scrapeYouranimesSmart };
