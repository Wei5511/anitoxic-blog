const puppeteer = require('puppeteer');
const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Helper to normalize strings for comparison
const normalize = (str) => {
    if (!str) return null;
    // Keep chinese characters? No, title_japanese usually has Kanji.
    // Normalized comparison usually strips punctuation.
    // But for JP matching, we want to match Kanji == Kanji.
    // So distinct normalization for JP vs EN.
    return str.replace(/\s+/g, '').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase();
};

const normalizeSlug = (str) => {
    if (!str) return null;
    return str.toLowerCase().replace(/[^a-z0-9]/g, '');
};

// Season mapping
const SEASON_MAP = {
    '01': 'winter',
    '04': 'spring',
    '07': 'summer',
    '10': 'fall'
};

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    try {
        const YEAR = 2015;
        const MONTH = '01'; // Winter
        const SEASON = SEASON_MAP[MONTH];

        console.log(`Processing ${YEAR} ${SEASON} (URL: ${YEAR}${MONTH})...`);

        const allTargets = db.prepare("SELECT mal_id, title, title_japanese FROM anime WHERE year = ? AND season = ?").all(YEAR, SEASON);
        console.log(`DB has ${allTargets.length} targets.`);

        // 2. Scrape List Page
        const page = await browser.newPage();
        await page.goto(`https://youranimes.tw/bangumi/${YEAR}${MONTH}`, { waitUntil: 'networkidle2' });

        const animeLinks = await page.evaluate(() => {
            const items = [];
            // Select only anime detail links
            document.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.startsWith('/animes/') && !href.includes('google') && !href.includes('facebook')) {
                    const title = a.innerText.trim();
                    if (title && title.length < 50) { // arbitrary max length for titles
                        items.push({ title: title, href: href });
                    }
                }
            });
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

        console.log(`Found ${animeLinks.length} anime on website.`);

        // 3. Process each website item to find a match
        // Limit to 20 for dry run
        for (const item of animeLinks.slice(0, 20)) {
            console.log(`Checking [${item.title}](${item.href})...`);

            try {
                await page.goto(`https://youranimes.tw${item.href}`, { waitUntil: 'domcontentloaded' });

                // Get Metadata
                const meta = await page.evaluate(() => {
                    const h1 = document.querySelector('h1')?.innerText?.trim();

                    let synopsis = '';
                    // Extract Synopsis
                    // Heuristic: Find container with most text within Main or Body, excluding links/navs.
                    // Or specific structure if consistent (it's not).
                    const ps = Array.from(document.querySelectorAll('p'));
                    // sort by length desc
                    ps.sort((a, b) => b.innerText.length - a.innerText.length);
                    for (const p of ps) {
                        const txt = p.innerText.trim();
                        // Filter menu items
                        if (!txt.includes('關於本站') && !txt.includes('登入') && !txt.includes('版權') && txt.length > 30) {
                            synopsis = txt;
                            break;
                        }
                    }

                    const links = Array.from(document.querySelectorAll('a')).map(a => a.href);
                    return { h1, synopsis, links };
                });

                // Analyze links for slugs
                const slugs = [];
                meta.links.forEach(l => {
                    try {
                        if (l.includes('crunchyroll.com')) slugs.push(l.split('/').pop());
                        if (l.includes('wikipedia.org/wiki/')) slugs.push(l.split('/').pop());
                        if (l.includes('myanimelist.net/anime/')) {
                            const parts = l.filter(Boolean); // split url
                            // this is hard inside evaluate, easier outside
                        }
                    } catch (e) { }
                });
                // outside evaluate
                meta.links.forEach(l => {
                    if (l.includes('myanimelist.net/anime/')) {
                        const parts = l.split('/');
                        if (parts.length > 4) slugs.push(parts[4]); // ID
                        if (parts.length > 5) slugs.push(parts[5]); // Slug
                    }
                });

                const normSlugs = slugs.map(s => normalizeSlug(s)).filter(Boolean);
                const cleanWebTitle = normalize(meta.h1); // Normalize web title (Chinese/JP)

                let bestMatch = null;

                // Strategy A: Match Title Japanese (Exact or high overlap)
                for (const t of allTargets) {
                    if (t.title_japanese) {
                        const dbJP = normalize(t.title_japanese);
                        if (dbJP && cleanWebTitle && dbJP === cleanWebTitle) {
                            bestMatch = t;
                            console.log(`  [JP-Match] "${t.title_japanese}" == "${meta.h1}"`);
                            break;
                        }
                    }
                }

                // Strategy B: Slug Match (Fallback)
                if (!bestMatch) {
                    for (const t of allTargets) {
                        const dbSlug = normalizeSlug(t.title);
                        if (dbSlug && normSlugs.includes(dbSlug)) {
                            bestMatch = t;
                            console.log(`  [Slug-Match] "${t.title}" via slugs`);
                            break;
                        }
                        // Fuzzy check for slugs
                        if (dbSlug) {
                            for (const s of normSlugs) {
                                if (s.includes(dbSlug) || dbSlug.includes(s)) {
                                    const lenDiff = Math.abs(s.length - dbSlug.length);
                                    if (lenDiff < 5) {
                                        bestMatch = t;
                                        console.log(`  [Fuzzy-Slug-Match] "${t.title}" ~ "${s}"`);
                                        break;
                                    }
                                }
                            }
                        }
                        if (bestMatch) break;
                    }
                }

                if (bestMatch) {
                    console.log(`  -> Synopsis: ${meta.synopsis.substring(0, 50)}...`);
                } else {
                    console.log(`  No match for "${meta.h1}".`);
                }

            } catch (e) {
                console.error(`  Error processing ${item.href}: ${e.message}`);
            }
        }

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
