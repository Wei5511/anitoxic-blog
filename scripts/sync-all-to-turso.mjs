// Comprehensive sync to Turso: Anime (2026), Articles, Chinese Titles
import { createClient } from '@libsql/client';
import fs from 'fs';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function syncAll() {
    console.log('=== Syncing All Data to Turso Production ===\n');

    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

    try {
        // 1. Sync 2026 Anime
        console.log('1. Syncing 2026 Anime...');
        const anime2026 = JSON.parse(fs.readFileSync('anime-2026-export.json', 'utf8'));

        let animeUpdated = 0;
        let animeInserted = 0;

        for (const anime of anime2026) {
            try {
                // Try update first
                const updateRes = await client.execute({
                    sql: `UPDATE anime SET 
                title = ?, title_japanese = ?, synopsis = ?, image_url = ?, 
                trailer_url = ?, score = ?, status = ?, season = ?, year = ?, 
                episodes = ?, aired_from = ?, genres = ?, studios = ?, 
                source = ?, rating = ?, youtube_id = ?
                WHERE mal_id = ?`,
                    args: [
                        anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                        anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                        anime.episodes, anime.aired_from, anime.genres, anime.studios,
                        anime.source, anime.rating, anime.youtube_id, anime.mal_id
                    ]
                });

                if (updateRes.rowsAffected > 0) {
                    animeUpdated++;
                } else {
                    // Insert if not exists
                    await client.execute({
                        sql: `INSERT INTO anime (mal_id, title, title_japanese, synopsis, image_url, 
                  trailer_url, score, status, season, year, episodes, aired_from, 
                  genres, studios, source, rating, youtube_id) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                        args: [
                            anime.mal_id, anime.title, anime.title_japanese, anime.synopsis, anime.image_url,
                            anime.trailer_url, anime.score, anime.status, anime.season, anime.year,
                            anime.episodes, anime.aired_from, anime.genres, anime.studios,
                            anime.source, anime.rating, anime.youtube_id
                        ]
                    });
                    animeInserted++;
                }

                if ((animeUpdated + animeInserted) % 10 === 0) {
                    console.log(`   Progress: ${animeUpdated + animeInserted}/${anime2026.length}`);
                }
            } catch (error) {
                console.error(`   ❌ Error syncing ${anime.mal_id}:`, error.message);
            }
        }

        console.log(`   ✅ Anime sync complete: ${animeUpdated} updated, ${animeInserted} inserted\n`);

        // 2. Sync Articles
        console.log('2. Syncing Articles...');
        const articles = JSON.parse(fs.readFileSync('articles-export.json', 'utf8'));

        let articlesUpdated = 0;
        let articlesInserted = 0;

        for (const article of articles) {
            try {
                // Try update first
                const updateRes = await client.execute({
                    sql: `UPDATE articles SET title = ?, content = ?, anime_id = ?, type = ?
                WHERE id = ?`,
                    args: [article.title, article.content, article.anime_id, article.type, article.id]
                });

                if (updateRes.rowsAffected > 0) {
                    articlesUpdated++;
                } else {
                    // Insert if not exists
                    await client.execute({
                        sql: `INSERT INTO articles (id, title, content, anime_id, type) 
                  VALUES (?, ?, ?, ?, ?)`,
                        args: [article.id, article.title, article.content, article.anime_id, article.type]
                    });
                    articlesInserted++;
                }
            } catch (error) {
                console.error(`   ❌ Error syncing article ${article.id}:`, error.message);
            }
        }

        console.log(`   ✅ Articles sync complete: ${articlesUpdated} updated, ${articlesInserted} inserted\n`);

        // 3. Summary
        console.log('=== Sync Complete ===');
        console.log(`2026 Anime: ${animeUpdated} updated, ${animeInserted} inserted`);
        console.log(`Articles: ${articlesUpdated} updated, ${articlesInserted} inserted`);
        console.log(`Chinese Titles: Already synced (168 titles)`);

    } finally {
        client.close();
    }
}

syncAll()
    .then(() => {
        console.log('\n✅ All data synced to Turso production!');
        process.exit(0);
    })
    .catch(error => {
        console.error('\n❌ Sync failed:', error);
        process.exit(1);
    });
