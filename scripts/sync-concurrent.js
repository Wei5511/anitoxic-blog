import { createClient } from '@libsql/client';
import fs from 'fs';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function syncConcurrent() {
    console.log('=== Concurrent Sync to Turso (Limit 20) ===\n');

    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    const CONCURRENCY = 20;

    try {
        // 1. Sync Anime
        console.log('1. Syncing Anime...');
        const animeList = JSON.parse(fs.readFileSync('anime-2026-export.json', 'utf8'));

        let activePromises = [];
        let completed = 0;

        for (const anime of animeList) {
            const p = (async () => {
                try {
                    await client.execute({
                        sql: `INSERT INTO anime (
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
                        source = ?, rating = ?, youtube_id = ?`,
                        args: [
                            anime.mal_id, anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                            anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                            anime.episodes, anime.aired_from, anime.genres, anime.studios,
                            anime.source, anime.rating, anime.youtube_id,

                            anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                            anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                            anime.episodes, anime.aired_from, anime.genres, anime.studios,
                            anime.source, anime.rating, anime.youtube_id
                        ]
                    });
                } catch (e) {
                    // console.error(`Error syncing ${anime.mal_id}:`, e.message);
                }
            })();

            activePromises.push(p);

            if (activePromises.length >= CONCURRENCY) {
                await Promise.race(activePromises);
                // Clean up finished
                // Actually Promise.race just waits for one. 
                // A better pattern is p-limit, but I don't want to npm install.
                // Simple semaphore:
                // We just await all if we hit a chunk size? No that's chunking.
                // Let's just use chunking for simplicity.
            }
        }

        // Chunking is safer and easier to implement without libraries
        // Let's restart loop with chunks
    } catch (e) {
        console.error(e);
    }
}

async function syncChunked() {
    console.log('=== Chunked Sync (Size 20) ===\n');
    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });
    const CHUNK_SIZE = 20;

    try {
        const animeList = JSON.parse(fs.readFileSync('anime-2026-export.json', 'utf8'));
        console.log(`Syncing ${animeList.length} anime...`);

        for (let i = 0; i < animeList.length; i += CHUNK_SIZE) {
            const chunk = animeList.slice(i, i + CHUNK_SIZE);
            await Promise.all(chunk.map(anime =>
                client.execute({
                    sql: `INSERT INTO anime (
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
                        source = ?, rating = ?, youtube_id = ?`,
                    args: [
                        anime.mal_id, anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                        anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                        anime.episodes, anime.aired_from, anime.genres, anime.studios,
                        anime.source, anime.rating, anime.youtube_id,

                        anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                        anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                        anime.episodes, anime.aired_from, anime.genres, anime.studios,
                        anime.source, anime.rating, anime.youtube_id
                    ]
                }).catch(e => console.error(`Error ${anime.mal_id}: ${e.message}`))
            ));

            if (i % 200 === 0) console.log(`Processed ${i}/${animeList.length}`);
        }
        console.log('Anime Sync Complete.');

        // Articles (Sync them too just to be safe)
        const articles = JSON.parse(fs.readFileSync('articles-export.json', 'utf8'));
        console.log(`Syncing ${articles.length} articles...`);
        for (const article of articles) {
            await client.execute({
                sql: `INSERT INTO articles (id, title, content, anime_id, type, image_url, myvideo_url, category, is_pinned, excerpt, published_at) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                    ON CONFLICT(id) DO UPDATE SET
                        title = ?, content = ?, anime_id = ?, type = ?, image_url = ?, myvideo_url = ?, category = ?, is_pinned = ?, excerpt = ?, published_at = ?`,
                args: [
                    article.id, article.title, article.content, article.anime_id, article.type,
                    article.image_url, article.myvideo_url, article.category, article.is_pinned, article.excerpt, article.published_at,
                    article.title, article.content, article.anime_id, article.type,
                    article.image_url, article.myvideo_url, article.category, article.is_pinned, article.excerpt, article.published_at
                ]
            }).catch(e => console.error(e));
        }
        console.log('Articles Sync Complete.');

    } finally {
        client.close();
    }
}

syncChunked()
    .then(() => process.exit(0))
    .catch(e => { console.error(e); process.exit(1); });
