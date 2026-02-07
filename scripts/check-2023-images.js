const db = require('better-sqlite3')('anime.db');

async function checkImages() {
    console.log('Checking 2023 anime images...');

    // Get all 2023 anime
    const animeList = db.prepare('SELECT mal_id, title, image_url FROM anime WHERE year = 2023').all();
    console.log(`Found ${animeList.length} anime from 2023.`);

    let broken = 0;

    for (const anime of animeList) {
        if (!anime.image_url) {
            console.log(`[MISSING] ${anime.mal_id} - ${anime.title} (Reason: No URL)`);
            broken++;
            continue;
        }

        try {
            const res = await fetch(anime.image_url, { method: 'HEAD' });
            if (!res.ok) {
                console.log(`[BROKEN] ${anime.mal_id} - ${anime.title}`);
                console.log(`   URL: ${anime.image_url}`);
                console.log(`   Status: ${res.status}`);
                broken++;
            }
        } catch (err) {
            console.log(`[ERROR] ${anime.mal_id} - ${anime.title}`);
            console.log(`   URL: ${anime.image_url}`);
            console.log(`   Error: ${err.message}`);
            broken++;
        }
    }

    console.log(`\nScan complete. Found ${broken} broken/missing images out of ${animeList.length}.`);
}

checkImages();
