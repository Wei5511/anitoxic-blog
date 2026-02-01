const db = require('better-sqlite3')('anime.db');
const https = require('https');

// Helper to fetch JSON from URL with delay
const delay = ms => new Promise(res => setTimeout(res, ms));

async function fetchJikan(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    resolve(null);
                }
            });
        }).on('error', err => resolve(null));
    });
}

// Mapping English MAL Data to Chinese Tags
const GENRE_MAP = {
    'Action': '戰鬥',
    'Adventure': '冒險',
    'Comedy': '搞笑',
    'Drama': '劇情',
    'Sci-Fi': '科幻',
    'Slice of Life': '日常',
    'Mystery': '懸疑',
    'Romance': '戀愛',
    'Fantasy': '奇幻',
    'Supernatural': '超自然',
    'Horror': '恐怖',
    'Sports': '運動',
    'Isekai': '異世界',
    'Reincarnation': '轉生',
    'Suspense': '懸疑'
};

const THEME_MAP = {
    'Isekai': '異世界',
    'Reincarnation': '轉生',
    'School': '校園',
    'Time Travel': '穿越',
    'Mecha': '機甲'
};

async function main() {
    const animes = db.prepare('SELECT mal_id, title, score, year, synopsis FROM anime').all();
    console.log(`Found ${animes.length} anime to update...`);

    let updatedCount = 0;

    for (const anime of animes) {
        if (!anime.mal_id) continue;

        console.log(`Processing [${anime.mal_id}] ${anime.title}...`);

        let tags = new Set();
        let existingGenres = [];

        // 1. Fetch from Jikan to retrieve detailed genres/themes if not populated or just to be sure
        // Actually, let's try to query current genres first if we have them? 
        // But the previous seed might not have populated Chinese genres correctly.
        // Let's assume we need to fetch for robustness, but respecting rate limit.
        // Or for speed, we can assume 'synopsis' or English genres if they exist in DB?
        // Checking schema: genres is TEXT.
        // Let's rely on Jikan for MAL ID.

        const data = await fetchJikan(`https://api.jikan.moe/v4/anime/${anime.mal_id}`);
        await delay(1200); // 1.2s delay to be safe for Jikan (Limit is ~3-4 req/s usually but let's be safe)

        if (data && data.data) {
            const d = data.data;

            // Map Genres
            if (d.genres) {
                d.genres.forEach(g => {
                    if (GENRE_MAP[g.name]) tags.add(GENRE_MAP[g.name]);
                    // English backup
                    // tags.add(g.name); 
                });
            }
            if (d.themes) {
                d.themes.forEach(t => {
                    if (THEME_MAP[t.name]) tags.add(THEME_MAP[t.name]);
                    if (GENRE_MAP[t.name]) tags.add(GENRE_MAP[t.name]);
                });
            }
        }

        // 2. Calculated Tags based on User Request
        // '霸權': Score >= 8.0
        if (anime.score >= 8.0) tags.add('霸權');

        // '推薦', '精選': Score >= 7.5
        if (anime.score >= 7.5) {
            tags.add('推薦');
            tags.add('精選');
        }

        // '新番': Year >= 2024 (Since it's 2026 now in context? The user has 2026 articles)
        // Let's say 2025 and 2026 are '新番'
        if (anime.year >= 2025) {
            tags.add('新番');
        }

        // '異世界', '轉生' from Synopsis as backup
        if (anime.synopsis) {
            if (anime.synopsis.includes('isekai') || anime.synopsis.includes('another world')) tags.add('異世界');
            if (anime.synopsis.includes('reincarnat')) tags.add('轉生');
        }

        // Add '整理' randomly? No, that's weird. User likely meant "Lists".
        // Maybe we just add '整理' to everything that is a Series? Or just ignore it for Anime entries.

        // Convert Set to String
        const tagString = Array.from(tags).join(',');

        if (tagString) {
            db.prepare('UPDATE anime SET genres = ? WHERE mal_id = ?').run(tagString, anime.mal_id);
            console.log(`  -> Updated tags: ${tagString}`);
            updatedCount++;
        }
    }

    console.log(`Done! Updated ${updatedCount} anime entries.`);
}

main().catch(console.error);
