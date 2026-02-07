const db = require('better-sqlite3')('anime.db');

// Localize anime database with Chinese titles from AniList
// PRIORITIZING POPULAR/HIGH SCORE ANIME
async function localizeAnime(options = {}) {
    const {
        dryRun = false,
        limit = 200, // Process top 200 by default
        startFrom = 0
    } = options;

    console.log('=== Anime Chinese Localization (High Score Priority) ===');
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Limit: ${limit || 'All'}`);

    // Get anime to process
    // Prioritize high score to ensure popular anime get translated first
    let query = `
        SELECT mal_id, title, title_japanese, score 
        FROM anime 
        WHERE year BETWEEN 2010 AND 2022 
        AND mal_id IS NOT NULL 
        AND (title_chinese IS NULL OR title_chinese = '')
        ORDER BY score DESC NULLS LAST
    `;

    if (limit) {
        query += ` LIMIT ${limit} OFFSET ${startFrom}`;
    }

    const animeList = db.prepare(query).all();
    const total = animeList.length;

    console.log(`📊 Found ${total} anime to process\n`);

    if (total === 0) {
        console.log('✅ No anime to process!');
        db.close();
        return;
    }

    const anilistQuery = `
    query ($malId: Int) {
      Media(idMal: $malId, type: ANIME) {
        title {
          native
        }
        synonyms
      }
    }
    `;

    let processed = 0;
    let updated = 0;
    let notFound = 0;
    let noChineseData = 0;
    let errors = 0;

    const RATE_LIMIT_DELAY = 800; // ~75 req/min

    for (let i = 0; i < animeList.length; i++) {
        const anime = animeList[i];
        processed++;

        try {
            const response = await fetch('https://graphql.anilist.co', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    query: anilistQuery,
                    variables: { malId: anime.mal_id }
                })
            });

            const json = await response.json();

            // Handle rate limiting response (429)
            if (response.status === 429) {
                console.log('⏳ Rate limited! Waiting 60s...');
                await new Promise(r => setTimeout(r, 60000));
                i--; // Retry
                continue;
            }

            if (json.data && json.data.Media) {
                const media = json.data.Media;
                // Check synonyms for Chinese
                const chineseSynonyms = media.synonyms.filter(s => /[\u4e00-\u9fa5]/.test(s));
                const chineseTitle = chineseSynonyms[0] || null;

                if (chineseTitle) {
                    if (!dryRun) {
                        db.prepare(`
                            UPDATE anime 
                            SET title_chinese = ? 
                            WHERE mal_id = ?
                        `).run(chineseTitle, anime.mal_id);
                    }

                    updated++;
                    console.log(`✅ [${processed}/${total}] ${anime.title} (${anime.score})`);
                    console.log(`   中文: ${chineseTitle}`);
                } else {
                    noChineseData++;
                    // console.log(`⚠️  ${anime.title} - No Chinese data`);
                }
            } else {
                notFound++;
            }

        } catch (error) {
            errors++;
            console.error(`❌ Error processing MAL ${anime.mal_id}:`, error.message);
        }

        // Delay
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }

    console.log('\n=== Localization Complete ===');
    console.log(`Updated: ${updated}`);
}

const args = process.argv.slice(2);
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : 200;

localizeAnime({ limit });
