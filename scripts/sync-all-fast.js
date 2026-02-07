import { createClient } from '@libsql/client';
import fs from 'fs';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function syncAllBatch() {
    console.log('=== Batch Syncing All Data to Turso Production ===\n');

    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    const BATCH_SIZE = 50;

    try {
        // 1. Sync Anime
        console.log('1. Syncing Anime...');
        const animeList = JSON.parse(fs.readFileSync('anime-2026-export.json', 'utf8'));

        // We will just perform UPSERT logic using REPLACE INTO or manually constructing batches?
        // SQLite `INSERT OR REPLACE` or `ON CONFLICT` is best.
        // My `upsertAnime` logic used `INSERT ... ON CONFLICT DO UPDATE`.
        // I will use that.

        let batch = [];
        let totalProcessed = 0;

        for (const anime of animeList) {
            batch.push({
                sql: `
                    INSERT INTO anime (
                        mal_id, title, title_japanese, synopsis, image_url, 
                        trailer_url, score, status, season, year, episodes, aired_from, 
                        genres, studios, source, rating, youtube_id
                    ) VALUES (
                        ?, ?, ?, ?, ?, 
                        ?, ?, ?, ?, ?, ?, ?, 
                        ?, ?, ?, ?, ?
                    )
                    ON CONFLICT(mal_id) DO UPDATE SET
                        title = ?, title_japanese = ?, synopsis = ?, image_url = ?, 
                        trailer_url = ?, score = ?, status = ?, season = ?, year = ?, 
                        episodes = ?, aired_from = ?, genres = ?, studios = ?, 
                        source = ?, rating = ?, youtube_id = ?
                `,
                args: [
                    // INSERT params
                    anime.mal_id, anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                    anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                    anime.episodes, anime.aired_from, anime.genres, anime.studios,
                    anime.source, anime.rating, anime.youtube_id,

                    // UPDATE params
                    anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                    anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                    anime.episodes, anime.aired_from, anime.genres, anime.studios,
                    anime.source, anime.rating, anime.youtube_id
                ]
            });

            if (batch.length >= BATCH_SIZE) {
                await client.batch(batch);
                totalProcessed += batch.length;
                batch = [];
                if (totalProcessed % 500 === 0) {
                    console.log(`   Synced ${totalProcessed}/${animeList.length} anime...`);
                }
            }
        }

        if (batch.length > 0) {
            await client.batch(batch);
            totalProcessed += batch.length;
        }
        console.log(`   ✅ Synced ${totalProcessed} anime.`);

        // 2. Sync Articles
        console.log('\n2. Syncing Articles...');
        const articles = JSON.parse(fs.readFileSync('articles-export.json', 'utf8'));

        batch = [];
        totalProcessed = 0;

        for (const article of articles) {
            batch.push({
                sql: `
                    INSERT INTO articles (id, title, content, anime_id, type, image_url, myvideo_url, category, is_pinned, excerpt, published_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        title = ?, content = ?, anime_id = ?, type = ?, image_url = ?, myvideo_url = ?, category = ?, is_pinned = ?, excerpt = ?, published_at = ?
                `,
                args: [
                    // INSERT
                    article.id, article.title, article.content, article.anime_id, article.type,
                    article.image_url, article.myvideo_url, article.category, article.is_pinned, article.excerpt, article.published_at,
                    // UPDATE
                    article.title, article.content, article.anime_id, article.type,
                    article.image_url, article.myvideo_url, article.category, article.is_pinned, article.excerpt, article.published_at
                ]
            });

            if (batch.length >= BATCH_SIZE) {
                await client.batch(batch);
                totalProcessed += batch.length;
                batch = [];
            }
        }

        if (batch.length > 0) {
            await client.batch(batch);
            totalProcessed += batch.length;
        }
        console.log(`   ✅ Synced ${totalProcessed} articles.`);

    } finally {
        client.close();
    }
}

syncAllBatch()
    .then(() => {
        console.log('\n✅ Batch Sync Complete!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Batch Sync Failed:', error);
        process.exit(1);
    });
