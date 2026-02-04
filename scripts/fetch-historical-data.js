const axios = require('axios');
const Database = require('better-sqlite3');
const path = require('path');
const GENRE_MAP = require('./genre-mapping');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

// Configuration
const START_YEAR = 2010;
const END_YEAR = 2022; // Range inclusive
const SEASONS = ['winter', 'spring', 'summer', 'fall'];
const DELAY_MS = 1000; // Jikan rate limit buffer

// Prepare statement
const upsertStmt = db.prepare(`
    INSERT INTO anime (
      mal_id, title, title_japanese, synopsis, image_url, trailer_url,
      score, status, season, year, episodes, aired_from, genres, studios, source, rating, updated_at
    ) VALUES (
      @mal_id, @title, @title_japanese, @synopsis, @image_url, @trailer_url,
      @score, @status, @season, @year, @episodes, @aired_from, @genres, @studios, @source, @rating, CURRENT_TIMESTAMP
    )
    ON CONFLICT(mal_id) DO UPDATE SET
      title = @title,
      title_japanese = @title_japanese,
      synopsis = @synopsis,
      image_url = @image_url,
      trailer_url = @trailer_url,
      score = @score,
      status = @status,
      season = @season,
      year = @year,
      episodes = @episodes,
      aired_from = @aired_from,
      genres = @genres,
      studios = @studios,
      source = @source,
      rating = @rating,
      updated_at = CURRENT_TIMESTAMP
`);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

function mapGenres(genres = []) {
    return genres.map(g => {
        const cn = GENRE_MAP[g.name];
        return cn || g.name; // Fallback to English if no mapping
    }).join(',');
}

function mapStudios(studios = []) {
    return studios.map(s => s.name).join(', ');
}

async function fetchSeason(year, season) {
    let page = 1;
    let hasNextPage = true;
    let animeCount = 0;

    console.log(`\n📅 Processing ${year} ${season.toUpperCase()}...`);

    while (hasNextPage) {
        try {
            await sleep(DELAY_MS);
            const url = `https://api.jikan.moe/v4/seasons/${year}/${season}?page=${page}&filter=tv`; // Focus on TV series for now
            const { data: response } = await axios.get(url);

            const animeList = response.data;
            const pagination = response.pagination;

            for (const anime of animeList) {
                // Filter out hentai/obscure stuff if needed
                if (anime.genres.some(g => g.name === 'Hentai')) continue;
                // Skip if score is too low? optional.

                const allGenres = [...anime.genres, ...(anime.themes || []), ...(anime.demographics || [])];

                const record = {
                    mal_id: anime.mal_id,
                    title: anime.title, // or anime.title_english || anime.title
                    title_japanese: anime.title_japanese,
                    synopsis: anime.synopsis,
                    image_url: anime.images.jpg.large_image_url || anime.images.jpg.image_url,
                    trailer_url: anime.trailer?.embed_url || null,
                    score: anime.score || 0,
                    status: anime.status,
                    season: season,
                    year: year,
                    episodes: anime.episodes,
                    aired_from: anime.aired?.from,
                    genres: mapGenres(allGenres),
                    studios: mapStudios(anime.studios),
                    source: anime.source,
                    rating: anime.rating
                };

                try {
                    upsertStmt.run(record);
                    animeCount++;
                } catch (dbErr) {
                    console.error(`   ❌ DB Error for ${anime.title}:`, dbErr.message);
                }
            }

            hasNextPage = pagination.has_next_page;
            // Limit pages per season to avoid too much junk? Jikan pagination usually ok.
            // Safety break
            if (page > 5) hasNextPage = false;

            process.stdout.write(`   Page ${page} done. Total: ${animeCount}...\r`);
            page++;

        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.log('\n   ⚠️ Rate limited. Waiting 3 seconds...');
                await sleep(3000);
                // Retry same page
                continue;
            } else {
                console.error(`\n   ❌ Error fetching ${year} ${season} p${page}:`, error.message);
                hasNextPage = false;
            }
        }
    }
    console.log(`   ✅ Finished ${year} ${season}: ${animeCount} entries.`);
    return animeCount;
}

async function main() {
    let totalImported = 0;

    // Reverse chronological order might be more interesting to see updates first?
    // User requested 2010-2022. Let's do descending.
    for (let year = END_YEAR; year >= START_YEAR; year--) {
        // Seasons usually ordered Winter -> Spring -> Summer -> Fall
        // If traversing backwards: Fall -> Summer -> Spring -> Winter
        const seasonsOrder = ['fall', 'summer', 'spring', 'winter'];

        for (const season of seasonsOrder) {
            const count = await fetchSeason(year, season);
            totalImported += count;
        }
    }

    console.log(`\n🎉 Grand Total Imported: ${totalImported} animes.`);
}

main();
