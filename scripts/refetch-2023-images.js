const db = require('better-sqlite3')('anime.db');
const { sleep } = require('../src/lib/tmdb'); // Re-use sleep function if available, or define new

// Simple sleep if import fails (CommonJS vs ESM issue might occur)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to search TMDB for image
async function searchTmdbImage(title) {
    const TMDB_API_KEY = '8a85aea05084693c8dbcd1c0ffbfbf85';
    // Remove (TV), (Movie), (2023) etc for cleaner search
    const cleanTitle = title.replace(/\(TV\)|\(Movie\)|\(\d{4}\)/gi, '').trim();
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=zh-TW`;

    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.results && data.results.length > 0) {
        // Prefer anime/animation
        const match = data.results.find(r => r.media_type === 'tv' || r.media_type === 'movie') || data.results[0];
        if (match.poster_path) {
            return `https://image.tmdb.org/t/p/w500${match.poster_path}`;
        }
    }
    return null;
}

async function refetchImages() {
    console.log('Refetching 2023 anime images from TMDB (Search by Title)...');

    // Get all 2023 anime with CloudFront URLs or missing images
    // CloudFront URLs look like 'https://d28s5ztqvkii64.cloudfront.net...'
    const animeList = db.prepare(`
        SELECT mal_id, title, image_url 
        FROM anime 
        WHERE year = 2023 
        AND (image_url IS NULL OR image_url LIKE '%cloudfront.net%')
    `).all();

    console.log(`Found ${animeList.length} anime to update.`);

    // Prepare update statement
    const updateStmt = db.prepare('UPDATE anime SET image_url = ? WHERE mal_id = ?');

    let updated = 0;
    let errors = 0;

    for (const anime of animeList) {
        try {
            const newImageUrl = await searchTmdbImage(anime.title);

            if (newImageUrl) {
                updateStmt.run(newImageUrl, anime.mal_id);
                updated++;
                console.log(`[UPDATED] [${anime.mal_id}] ${anime.title}: ${newImageUrl}`);
            } else {
                console.log(`[NO IMAGE] [${anime.mal_id}] ${anime.title}: No image found on TMDB.`);
            }

            // Rate limit (TMDB is generous but let's be safe)
            await delay(250);

        } catch (err) {
            console.error(`[ERROR] [${anime.mal_id}] ${anime.title}: ${err.message}`);
            errors++;
            await delay(1000);
        }
    }

    console.log(`\nUpdate complete. Updated: ${updated}, Errors: ${errors}`);
}

refetchImages();
