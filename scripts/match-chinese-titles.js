// Match scraped Chinese titles with our database using Japanese title matching

const db = require('better-sqlite3')('anime.db');
const fs = require('fs');

// Normalize Japanese text for matching
function normalizeJapanese(text) {
    if (!text) return '';

    return text
        .trim()
        .replace(/\s+/g, '')  // Remove all whitespace
        .replace(/！/g, '!')   // Normalize punctuation
        .replace(/？/g, '?')
        .replace(/：/g, ':')
        .replace(/「/g, '')
        .replace(/」/g, '')
        .replace(/【/g, '')
        .replace(/】/g, '')
        .replace(/～/g, '~')
        .toLowerCase();
}

// Fuzzy match for similar titles
function calculateSimilarity(str1, str2) {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
        for (let j = 1; j <= len2; j++) {
            const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
            matrix[i][j] = Math.min(
                matrix[i - 1][j] + 1,
                matrix[i][j - 1] + 1,
                matrix[i - 1][j - 1] + cost
            );
        }
    }

    const distance = matrix[len1][len2];
    const maxLen = Math.max(len1, len2);
    return 1 - (distance / maxLen);
}

async function matchChineseTitles() {
    console.log('=== Matching Chinese Titles with Database ===\n');

    // Load scraped data
    console.log('Loading scraped data...');
    const youranimeData = JSON.parse(fs.readFileSync('youranimes-data.json', 'utf8'));
    console.log(`Loaded ${youranimeData.length} anime from Youranimes.tw\n`);

    // Load our database anime
    console.log('Loading database anime (2010-2022)...');
    const ourAnime = db.prepare(`
        SELECT mal_id, title, title_japanese, year, season 
        FROM anime 
        WHERE year BETWEEN 2010 AND 2022 
        AND mal_id IS NOT NULLrunning ORDER BY year DESC, season DESC
    `).all();
    console.log(`Loaded ${ourAnime.length} anime from database\n`);

    // Create lookup map for Youranimes data
    const youranimeMap = new Map();
    for (const anime of youranimeData) {
        const normalized = normalizeJapanese(anime.japanese_title);
        youranimeMap.set(normalized, anime);
    }

    console.log('=== Matching Process ===\n');

    const matches = [];
    const unmatched = [];
    let exactMatches = 0;
    let fuzzyMatches = 0;

    for (const anime of ourAnime) {
        if (!anime.title_japanese) {
            unmatched.push({ ...anime, reason: 'no_japanese_title' });
            continue;
        }

        const normalized = normalizeJapanese(anime.title_japanese);

        // Try exact match
        let match = youranimeMap.get(normalized);

        if (match) {
            exactMatches++;
            matches.push({
                mal_id: anime.mal_id,
                title: anime.title,
                title_japanese: anime.title_japanese,
                chinese_title: match.chinese_title,
                match_type: 'exact',
                confidence: 1.0
            });

            if (exactMatches <= 10) {
                console.log(`✅ EXACT: ${anime.title}`);
                console.log(`   日文: ${anime.title_japanese}`);
                console.log(`   中文: ${match.chinese_title}\n`);
            }
        } else {
            // Try fuzzy match
            let bestMatch = null;
            let bestSimilarity = 0;

            for (const [normTitle, youranime] of youranimeMap.entries()) {
                const similarity = calculateSimilarity(normalized, normTitle);
                if (similarity > bestSimilarity && similarity >= 0.85) {
                    bestSimilarity = similarity;
                    bestMatch = youranime;
                }
            }

            if (bestMatch) {
                fuzzyMatches++;
                matches.push({
                    mal_id: anime.mal_id,
                    title: anime.title,
                    title_japanese: anime.title_japanese,
                    chinese_title: bestMatch.chinese_title,
                    match_type: 'fuzzy',
                    confidence: bestSimilarity
                });

                if (fuzzyMatches <= 5) {
                    console.log(`🔍 FUZZY (${(bestSimilarity * 100).toFixed(1)}%): ${anime.title}`);
                    console.log(`   DB日文: ${anime.title_japanese}`);
                    console.log(`   YA日文: ${bestMatch.japanese_title}`);
                    console.log(`   中文: ${bestMatch.chinese_title}\n`);
                }
            } else {
                unmatched.push({ ...anime, reason: 'no_match' });
            }
        }

        // Progress update
        const processed = matches.length + unmatched.length;
        if (processed % 500 === 0) {
            console.log(`📊 Progress: ${processed}/${ourAnime.length}`);
            console.log(`   Matched: ${matches.length} (Exact: ${exactMatches}, Fuzzy: ${fuzzyMatches})`);
            console.log(`   Unmatched: ${unmatched.length}\n`);
        }
    }

    console.log('\n=== Matching Complete ===');
    console.log(`Total anime in database: ${ourAnime.length}`);
    console.log(`✅ Matched: ${matches.length} (${((matches.length / ourAnime.length) * 100).toFixed(1)}%)`);
    console.log(`   - Exact matches: ${exactMatches}`);
    console.log(`   - Fuzzy matches: ${fuzzyMatches}`);
    console.log(`❌ Unmatched: ${unmatched.length}`);

    // Save matches to file for review
    fs.writeFileSync(
        'chinese-title-matches.json',
        JSON.stringify(matches, null, 2),
        'utf8'
    );

    fs.writeFileSync(
        'unmatched-anime.json',
        JSON.stringify(unmatched, null, 2),
        'utf8'
    );

    console.log('\n✅ Saved matches to chinese-title-matches.json');
    console.log('✅ Saved unmatched to unmatched-anime.json');

    // Update database
    console.log('\n=== Updating Database ===\n');

    const updateStmt = db.prepare(`
        UPDATE anime 
        SET title_chinese = ? 
        WHERE mal_id = ?
    `);

    const transaction = db.transaction((matches) => {
        for (const match of matches) {
            updateStmt.run(match.chinese_title, match.mal_id);
        }
    });

    transaction(matches);

    console.log(`✅ Updated ${matches.length} anime with Chinese titles`);

    // Verify
    const updated = db.prepare(`
        SELECT COUNT(*) as count 
        FROM anime 
        WHERE year BETWEEN 2010 AND 2022 
        AND title_chinese IS NOT NULL
    `).get();

    console.log(`\n=== Verification ===`);
    console.log(`Total anime with Chinese titles: ${updated.count}`);
    console.log(`Coverage: ${((updated.count / ourAnime.length) * 100).toFixed(1)}%`);

    db.close();

    return { matches, unmatched, stats: { exactMatches, fuzzyMatches } };
}

if (require.main === module) {
    matchChineseTitles()
        .then(() => {
            console.log('\n🎉 Matching completed successfully!');
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ Fatal error:', error);
            process.exit(1);
        });
}

module.exports = { matchChineseTitles };
