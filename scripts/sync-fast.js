import { createClient } from '@libsql/client';
import fs from 'fs';

const TURSO_URL = 'libsql://anitoxic-db-wei5511.aws-ap-northeast-1.turso.io';
const TURSO_TOKEN = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicnciLCJpYXQiOjE3Njk5NjM0MDYsImlkIjoiNjQ3NTZhOWItMTcwYy00OTI2LWI2N2EtM2NkYjlhOGNhYTEwIiwicmlkIjoiNTU0MTNmN2ItNGM3NC00YjE1LWI0ZjMtYjhjNDRjNzIwYTM4In0.0zYohaqgOn-m3V7ibjQqrWjX5-96MiKfwVq1syD67hBugqLFgr7lxj7ao4aT1dZ9MQT47kbR2FNyRmK3GkvaBQ';

async function syncFast() {
    console.log('=== Fast Sync to Turso Production ===\n');

    const client = createClient({ url: TURSO_URL, authToken: TURSO_TOKEN });

    try {
        // 1. Sync ALL Articles (Small table so it's fast)
        console.log('1. Syncing Articles...');
        const articles = JSON.parse(fs.readFileSync('articles-export.json', 'utf8'));

        for (const article of articles) {
            try {
                // Try update first
                const updateRes = await client.execute({
                    sql: `UPDATE articles SET title = ?, content = ?, anime_id = ?, type = ?, image_url = ?, excerpt = ?, category = ?
                WHERE id = ?`,
                    args: [
                        article.title, article.content, article.anime_id, article.type,
                        article.image_url, article.excerpt, article.category,
                        article.id
                    ]
                });

                if (updateRes.rowsAffected === 0) {
                    await client.execute({
                        sql: `INSERT INTO articles (id, title, content, anime_id, type, image_url, excerpt, category) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
                        args: [
                            article.id, article.title, article.content, article.anime_id, article.type,
                            article.image_url, article.excerpt, article.category
                        ]
                    });
                    console.log(`   Inserted article: ${article.title}`);
                } else {
                    console.log(`   Updated article: ${article.title}`);
                }
            } catch (error) {
                console.error(`   ❌ Error syncing article ${article.id}:`, error.message);
            }
        }

        // 2. Sync Specific Anime (The ones we fixed images for)
        console.log('\n2. Syncing Key Anime Updates...');
        const animeExport = JSON.parse(fs.readFileSync('anime-2026-export.json', 'utf8'));

        // List of anime we touched today
        const targetTitles = [
            '葬送的芙莉蓮', '咒術迴戰', '【我推的孩子】', '貴族轉生', '泛而不精',
            '判處勇者刑', '相反的你和我', 'Fate/strange Fake', '安逸領主', '燃油車鬥魂',
            'Netflix', '迷宮飯', '藥師少女', '肌肉魔法使' // Include some others just in case
        ];

        // Find matches in export
        const updates = animeExport.filter(a => targetTitles.some(t => a.title.includes(t) || (a.title_chinese && a.title_chinese.includes(t))));
        console.log(`Found ${updates.length} anime to sync.`);

        for (const anime of updates) {
            try {
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
                console.log(`   Synced anime: ${anime.title}`);
            } catch (error) {
                console.error(`   ❌ Error syncing anime ${anime.mal_id}:`, error.message);
            }
        }

        console.log('\n=== Fast Sync Complete ===');

    } finally {
        client.close();
    }
}

syncFast()
    .then(() => {
        console.log('✅ Done!');
        process.exit(0);
    })
    .catch(error => {
        console.error('❌ Failed:', error);
        process.exit(1);
    });
