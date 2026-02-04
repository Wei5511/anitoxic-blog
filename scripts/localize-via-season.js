const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Helper to normalize strings for comparison (JP sensitive)
const normalize = (str) => {
    if (!str) return null;
    return str.replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
};

const normalizeSlug = (str) => {
    if (!str) return null;
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Season mapping
const MO_TO_SEASON = {
    '01': 'winter',
    '04': 'spring',
    '07': 'summer',
    '10': 'fall'
};

const DELAY_MS = 2000;
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        // Iterate years 2010 to 2022
        for (let year = 2022; year >= 2010; year--) {
            for (const month of ['10', '07', '04', '01']) {
                const season = MO_TO_SEASON[month];
                console.log(`=== Processing ${year} ${season} (${year}${month}) ===`);

                // 1. Get DB Targets
                const allTargets = db.prepare("SELECT mal_id, title, title_japanese FROM anime WHERE year = ? AND season = ?").all(year, season);

                if (allTargets.length === 0) {
                    console.log('  No DB entries for this season. Skipping.');
                    continue;
                }

                // 2. Scrape List Page
                const page = await browser.newPage();
                try {
                    await page.goto(`https://youranimes.tw/bangumi/${year}${month}`, { waitUntil: 'networkidle2', timeout: 30000 });

                    const animeLinks = await page.evaluate(() => {
                        const items = [];
                        document.querySelectorAll('a').forEach(a => {
                            const href = a.getAttribute('href');
                            if (href && href.startsWith('/animes/') && !href.includes('google') && !href.includes('facebook')) {
                                const title = a.innerText.trim();
                                if (title && title.length < 50) {
                                    items.push({ title: title, href: href });
                                }
                            }
                        });
                        // Unique
                        const unique = [];
                        const seen = new Set();
                        items.forEach(i => {
                            if (!seen.has(i.href)) {
                                seen.add(i.href);
                                unique.push(i);
                            }
                        });
                        return unique;
                    });

                    console.log(`  Found ${animeLinks.length} anime links on website.`);

                    // 3. Process each website item
                    let updatedCount = 0;

                    for (const item of animeLinks) {
                        try {
                            await page.goto(`https://youranimes.tw${item.href}`, { waitUntil: 'domcontentloaded', timeout: 15000 });

                            // Get Metadata
                            const meta = await page.evaluate(() => {
                                const h1 = document.querySelector('h1')?.innerText?.trim();
                                let synopsis = '';
                                const ps = Array.from(document.querySelectorAll('p'));
                                ps.sort((a, b) => b.innerText.length - a.innerText.length);
                                for (const p of ps) {
                                    const txt = p.innerText.trim();
                                    if (!txt.includes('關於本站') && !txt.includes('登入') && !txt.includes('版權') && txt.length > 30) {
                                        synopsis = txt;
                                        break;
                                    }
                                }
                                const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
                                return { h1, synopsis, links };
                            });

                            if (!meta.h1 || !meta.synopsis) continue;

                            // Calculate Slugs
                            const slugs = [];
                            // (Slug logic same as dry run)
                            meta.links.forEach(l => {
                                if (l.includes('myanimelist.net/anime/')) {
                                    const parts = l.split('/');
                                    if (parts.length > 5) slugs.push(parts[5]);
                                } else if (l.includes('crunchyroll.com') || l.includes('wikipedia.org')) {
                                    slugs.push(l.split('/').pop());
                                }
                            });
                            const normSlugs = slugs.map(s => normalizeSlug(s)).filter(Boolean);
                            const cleanWebTitle = normalize(meta.h1);

                            // Match
                            let bestMatch = null;

                            // A. JP Match
                            for (const t of allTargets) {
                                if (t.title_japanese) {
                                    const dbJP = normalize(t.title_japanese);
                                    if (dbJP && cleanWebTitle && dbJP === cleanWebTitle) {
                                        bestMatch = t;
                                        break;
                                    }
                                }
                            }

                            // B. Slug Match
                            if (!bestMatch) {
                                for (const t of allTargets) {
                                    const dbSlug = normalizeSlug(t.title);
                                    if (dbSlug && normSlugs.includes(dbSlug)) {
                                        bestMatch = t;
                                        break;
                                    }
                                }
                            }

                            if (bestMatch) {
                                // Update DB
                                const info = db.prepare("UPDATE anime SET title = ?, synopsis = ? WHERE mal_id = ?").run(meta.h1, meta.synopsis, bestMatch.mal_id);
                                if (info.changes > 0) {
                                    console.log(`    UPDATED: [${bestMatch.mal_id}] ${bestMatch.title} -> ${meta.h1}`);
                                    updatedCount++;
                                }
                            }

                            await delay(500); // polite delay per item

                        } catch (e) {
                            // Ignore errors for individual items
                        }
                    }
                    console.log(`  Season Complete. Updated ${updatedCount} entries.`);

                } catch (e) {
                    console.error(`  Error processing season page: ${e.message}`);
                } finally {
                    page.close();
                }

                await delay(DELAY_MS);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
