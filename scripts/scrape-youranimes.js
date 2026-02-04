// Scrape Youranimes.tw for Chinese anime titles (2010-2022)

const https = require('https');
const http = require('http');

const USER_AGENT = 'AnimeBlogBot/1.0 (Educational Project)';
const DELAY_MS = 1500; // 1.5 seconds between requests (respectful)

// Helper: Fetch URL content
function fetchURL(url) {
    return new Promise((resolve, reject) => {
        const client = url.startsWith('https') ? https : http;

        const options = {
            headers: {
                'User-Agent': USER_AGENT,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
                'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8'
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

// Helper: Delay
function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Parse season page to extract anime list
function parseSeasonPage(html) {
    const animeList = [];

    // Find all anime links: https://youranimes.tw/animes/{id}
    const linkRegex = /https:\/\/youranimes\.tw\/animes\/(\d+)/g;
    const matches = html.matchAll(linkRegex);

    const seenIds = new Set();
    for (const match of matches) {
        const id = match[1];
        if (!seenIds.has(id)) {
            seenIds.add(id);
            animeList.push({ id, url: match[0] });
        }
    }

    return animeList;
}

// Parse anime detail page
function parseAnimePage(html, animeId) {
    const result = {
        id: animeId,
        chinese_title: null,
        japanese_title: null,
        season: null
    };

    // Extract Chinese title from <h1>
    const h1Match = html.match(/<h1[^>]*>([^<]+)<\/h1>/);
    if (h1Match) {
        result.chinese_title = h1Match[1].trim();
    }

    // Alternative: from title tag
    if (!result.chinese_title) {
        const titleMatch = html.match(/<title>([^|<]+)/);
        if (titleMatch) {
            result.chinese_title = titleMatch[1].trim();
        }
    }

    // Extract season link
    const seasonMatch = html.match(/youranimes\.tw\/bangumi\/(\d{6})/);
    if (seasonMatch) {
        result.season = seasonMatch[1];
    }

    return result;
}

// Extract Japanese title from page (look for patterns)
function extractJapaneseTitle(html) {
    // Look for Japanese characters after Chinese title
    // Pattern: Chinese title followed by Japanese on next line
    const lines = html.split('\n');

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();

        // Check if line contains Japanese characters (Hiragana/Katakana/Kanji)
        if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(line)) {
            // Remove HTML tags
            const clean = line.replace(/<[^>]+>/g, '').trim();

            // If it's a substantial Japanese title (not just single characters)
            if (clean.length > 3 && !/^[\u4E00-\u9FAF]{1,3}$/.test(clean)) {
                return clean;
            }
        }
    }

    return null;
}

// Main scraping function
async function scrapeYouranimes() {
    console.log('=== Scraping Youranimes.tw (2010-2022) ===\n');

    // Generate season codes
    const seasons = [];
    for (let year = 2010; year <= 2022; year++) {
        for (let month of ['01', '04', '07', '10']) {
            seasons.push(`${year}${month}`);
        }
    }

    console.log(`Total seasons to scrape: ${seasons.length}\n`);

    const allAnime = new Map(); // Use Map to deduplicate by ID
    let seasonCount = 0;

    for (const season of seasons) {
        seasonCount++;
        const url = `https://youranimes.tw/bangumi/${season}`;

        try {
            console.log(`[${seasonCount}/${seasons.length}] Fetching ${season}...`);
            const html = await fetchURL(url);
            const animeLinks = parseSeasonPage(html);

            console.log(`  Found ${animeLinks.length} anime`);

            // Add to collection
            for (const anime of animeLinks) {
                if (!allAnime.has(anime.id)) {
                    allAnime.set(anime.id, {
                        id: anime.id,
                        url: anime.url,
                        season: season
                    });
                }
            }

            // Progress update
            if (seasonCount % 10 === 0) {
                console.log(`\n  Progress: ${seasonCount}/${seasons.length} seasons`);
                console.log(`  Unique anime collected: ${allAnime.size}\n`);
            }

            await delay(DELAY_MS);

        } catch (error) {
            console.error(`  ❌ Error fetching ${season}:`, error.message);
        }
    }

    console.log(`\n=== Phase 1 Complete ===`);
    console.log(`Total unique anime IDs: ${allAnime.size}`);
    console.log(`\n=== Phase 2: Fetching anime details ===\n`);

    // Now fetch each anime's detail page for Chinese and Japanese titles
    const animeData = [];
    const animeArray = Array.from(allAnime.values());
    let detailCount = 0;
    let successCount = 0;

    for (const anime of animeArray) {
        detailCount++;

        try {
            const html = await fetchURL(anime.url);
            const details = parseAnimePage(html, anime.id);
            const japaneseTitle = extractJapaneseTitle(html);

            if (details.chinese_title && japaneseTitle) {
                animeData.push({
                    youranime_id: anime.id,
                    chinese_title: details.chinese_title,
                    japanese_title: japaneseTitle,
                    season: anime.season,
                    url: anime.url
                });
                successCount++;

                if (successCount <= 5) {
                    console.log(`✅ [${detailCount}/${animeArray.length}] ${details.chinese_title}`);
                    console.log(`   日文: ${japaneseTitle}`);
                }
            } else {
                if (detailCount <= 10) {
                    console.log(`⚠️  [${detailCount}/${animeArray.length}] Missing data for ID ${anime.id}`);
                }
            }

            // Progress updates
            if (detailCount % 50 === 0) {
                console.log(`\n📊 Progress: ${detailCount}/${animeArray.length} (${successCount} successful)\n`);
            }

            await delay(DELAY_MS);

        } catch (error) {
            if (detailCount <= 10) {
                console.error(`❌ [${detailCount}/${animeArray.length}] Error:`, error.message);
            }
        }
    }

    console.log(`\n=== Scraping Complete ===`);
    console.log(`Total anime processed: ${detailCount}`);
    console.log(`Successfully extracted: ${successCount}`);
    console.log(`Success rate: ${((successCount / detailCount) * 100).toFixed(1)}%`);

    // Save to JSON
    const fs = require('fs');
    fs.writeFileSync(
        'youranimes-data.json',
        JSON.stringify(animeData, null, 2),
        'utf8'
    );

    console.log(`\n✅ Data saved to youranimes-data.json`);

    return animeData;
}

// Run if executed directly
if (require.main === module) {
    scrapeYouranimes()
        .then(() => {
            console.log('\n🎉 Scraping completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { scrapeYouranimes };
