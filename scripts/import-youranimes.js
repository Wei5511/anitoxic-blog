const db = require('better-sqlite3')('anime.db');
const fs = require('fs');
const path = require('path');

function importData() {
    console.log('=== Importing YourAnimes Data ===');

    const jsonPath = path.join(__dirname, '..', 'youranimes-data.json');
    if (!fs.existsSync(jsonPath)) {
        console.error('Data file not found:', jsonPath);
        return;
    }

    const data = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
    console.log(`Loaded ${data.length} entries from JSON.`);

    // Prepare statements
    const updateStmt = db.prepare(`
        UPDATE anime 
        SET title_chinese = ? 
        WHERE mal_id = ?
    `);

    // We need to find the anime in DB.
    // Strategy: Match by Japanese title first.
    // If not found, maybe match by year + fuzzy string? (Too risky for now, stick to Japanese title)

    // Normalize string helper
    const normalize = (s) => s ? s.replace(/\s+/g, '').toLowerCase() : '';

    let updated = 0;
    let notFound = 0;
    let skipped = 0;

    // Load all DB titles to memory for faster matching if needed, 
    // but for 3000 anime, individual queries are fine, or we can build a Map.
    // Let's build a Map of Japanese Title -> ID
    // Also strict Year filtering to reduce false positives.

    // Load all DB titles to memory
    const allAnime = db.prepare('SELECT mal_id, title_japanese, title, year, aired_from FROM anime WHERE year BETWEEN 2010 AND 2022').all();
    console.log(`Loaded ${allAnime.length} anime from DB (2010-2022).`);

    // Helper to get season from date
    const getSeason = (dateStr) => {
        if (!dateStr) return null;
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return null;
        const y = d.getFullYear();
        const m = d.getMonth() + 1; // 1-12
        let q = '01';
        if (m >= 4) q = '04';
        if (m >= 7) q = '07';
        if (m >= 10) q = '10';
        return `${y}${q}`;
    };

    db.transaction(() => {
        for (const item of data) {
            const scrapedTitle = item.chinese_title;
            const scrapedSeason = item.season;

            // Find candidates in DB with same season (relaxed: same year)
            // matching season exactly is better but start_date might be slightly off
            const candidates = allAnime.filter(a => {
                if (a.year !== parseInt(scrapedSeason.substring(0, 4))) return false;
                // Optional: Strict season check
                // const dbSeason = getSeason(a.start_date);
                // return dbSeason === scrapedSeason;
                return true;
            });

            let bestMatch = null;
            let maxScore = 0;

            for (const candidate of candidates) {
                let score = 0;
                const normScraped = normalize(scrapedTitle);

                // Check Japanese Title inclusion
                if (candidate.title_japanese) {
                    const normJP = normalize(candidate.title_japanese);
                    if (normScraped.includes(normJP)) score += 10;
                }

                // Check English/Romaji Title inclusion
                if (candidate.title) {
                    const normEN = normalize(candidate.title);
                    if (normScraped.includes(normEN)) score += 5;
                }

                // Bonus if season matches exactly
                const dbSeason = getSeason(candidate.aired_from);
                if (dbSeason === scrapedSeason) score += 2;

                if (score > maxScore) {
                    maxScore = score;
                    bestMatch = candidate;
                }
            }

            if (bestMatch && maxScore >= 5) {
                // Heuristic: If the matched title contains "Season 2" etc, verify scraped title also does?
                // For now, assume good match.

                // Extract pure Chinese? 
                // Often format is "Chinese Name Japanese/English Name"
                // or just "Chinese Name"
                // We'll take the whole string for now, user can edit later or we refine regex.
                // Or maybe split by space and take first part if it's CJK?

                updateStmt.run(scrapedTitle, bestMatch.mal_id);
                updated++;
            } else {
                notFound++;
            }
        }
    })();

    console.log('\n=== Import Complete ===');
    console.log(`Updated: ${updated}`);
    console.log(`Not Found (No matching JP title): ${notFound}`);
    console.log(`Skipped (Missing data in JSON): ${skipped}`);
}

importData();
