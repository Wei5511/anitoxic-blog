const db = require('better-sqlite3')('anime.db');

// Localize anime database with Chinese titles from AniList
async function localizeAnime(options = {}) {
    const {
        dryRun = false,
        limit = null,
        startFrom = 0
    } = options;

    console.log('=== Anime Chinese Localization ===');
    console.log(`Mode: ${dryRun ? 'DRY RUN' : 'LIVE'}`);
    console.log(`Limit: ${limit || 'All'}`);
    console.log(`Start from: ${startFrom}\n`);

    // Get anime to process
    let query = `
        SELECT mal_id, title, title_japanese 
        FROM anime 
        WHERE year BETWEEN 2010 AND 2022 
        AND mal_id IS NOT NULL
    `;

    // Skip already processed if not starting from beginning
    if (!dryRun && startFrom === 0) {
        query += ` AND title_chinese IS NULL`;
    }

    query += ` ORDER BY year DESC, mal_id ASC`;

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
          romaji
          english
          native
        }
        synonyms
        description(asHtml: false)
      }
    }
    `;

    let processed = 0;
    let updated = 0;
    let notFound = 0;
    let noChineseData = 0;
    let errors = 0;

    const RATE_LIMIT_DELAY = 700; // ~85 requests per minute (safe margin)

    for (let i = 0; i < animeList.length; i++) {
        const anime = animeList[i];
        processed++;

        try {
            // Query AniList
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

            if (json.data && json.data.Media) {
                const media = json.data.Media;

                // Extract Chinese title from synonyms
                const chineseSynonyms = media.synonyms.filter(s => /[\u4e00-\u9fa5]/.test(s));
                const chineseTitle = chineseSynonyms[0] || null;

                // For now, we'll use title as fallback (can add description translation later)
                const chineseSynopsis = null; // Can be added if needed

                if (chineseTitle) {
                    if (!dryRun) {
                        db.prepare(`
                            UPDATE anime 
                            SET title_chinese = ?, synopsis_chinese = ? 
                            WHERE mal_id = ?
                        `).run(chineseTitle, chineseSynopsis, anime.mal_id);
                    }

                    updated++;
                    console.log(`✅ [${processed}/${total}] ${anime.title}`);
                    console.log(`   中文: ${chineseTitle}`);
                } else {
                    noChineseData++;
                    console.log(`⚠️  [${processed}/${total}] ${anime.title} - No Chinese data`);
                }
            } else {
                notFound++;
                console.log(`❌ [${processed}/${total}] MAL ${anime.mal_id} not found in AniList`);
            }

        } catch (error) {
            errors++;
            console.error(`❌ [${processed}/${total}] Error processing MAL ${anime.mal_id}:`, error.message);
        }

        // Progress indicator
        if (processed % 100 === 0) {
            const percent = ((processed / total) * 100).toFixed(1);
            console.log(`\n📊 Progress: ${processed}/${total} (${percent}%)`);
            console.log(`   Updated: ${updated}, No Chinese: ${noChineseData}, Not Found: ${notFound}, Errors: ${errors}\n`);
        }

        // Rate limiting
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
    }

    // Final summary
    console.log('\n=== Localization Complete ===');
    console.log(`Total processed: ${processed}`);
    console.log(`✅ Updated with Chinese: ${updated} (${((updated / total) * 100).toFixed(1)}%)`);
    console.log(`⚠️  No Chinese data: ${noChineseData}`);
    console.log(`❌ Not found: ${notFound}`);
    console.log(`❌ Errors: ${errors}`);

    db.close();
}

// Parse command line arguments
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const limitIndex = args.indexOf('--limit');
const limit = limitIndex !== -1 ? parseInt(args[limitIndex + 1]) : null;
const startIndex = args.indexOf('--start');
const startFrom = startIndex !== -1 ? parseInt(args[startIndex + 1]) : 0;

localizeAnime({ dryRun, limit, startFrom });
