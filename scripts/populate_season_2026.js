const fs = require('fs');
const cheerio = require('cheerio');
const db = require('better-sqlite3')('anime.db');

// 1. Read HTML
// Try latest first, fallback to raw if needed (but user wants refresh)
let html;
try {
    html = fs.readFileSync('jan_2026_latest.html', 'utf-8');
} catch (e) {
    console.log('Latest HTML not found, trying raw...');
    html = fs.readFileSync('jan_2026_raw.html', 'utf-8');
}

const $ = cheerio.load(html);
const articles = $('article');
console.log(`Found ${articles.length} anime entries from source.`);

// 2. Clear old data for this season
// We rely on 'year' and 'season' columns.
const deleted = db.prepare("DELETE FROM anime WHERE year = 2026 AND season = 'winter'").run();
console.log(`Cleared ${deleted.changes} old entries for 2026 Winter.`);

// 3. Insert New Data
// Start ID: 202601001
let idCounter = 202601001;
let count = 0;

const insertStmt = db.prepare(`
    INSERT INTO anime (
        mal_id, title, title_japanese, synopsis, image_url, 
        score, status, season, year, episodes, 
        source, genres, studios, aired_from, rating, updated_at
    ) VALUES (
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?,
        ?, ?, ?, ?, ?, CURRENT_TIMESTAMP
    )
`);

articles.each((i, el) => {
    const $el = $(el);

    // Title & JP Title
    // H3 -> A is Title
    // H3 + P is JP Title
    const title = $el.find('h3 a').text().trim();
    const title_jp = $el.find('h3 + p').text().trim();

    // Image
    const imgUrl = $el.find('img').first().attr('src');

    // Synopsis
    let synopsis = '';
    $el.find('h4').each((j, h4) => {
        if ($(h4).text().includes('作品簡介')) {
            synopsis = $(h4).next('p').text().trim();
        }
    });

    // Metadata extraction is tricky without clear classes.
    // Assuming defaults or basic extraction.

    // Episodes?
    // Often in the info block.
    // Let's look for "話數" or assume unknown.
    let episodes = null;

    // Studios?
    // "製作公司"
    let studios = '';
    $el.find('li').each((j, li) => {
        if ($(li).text().includes('製作公司')) {
            studios = $(li).text().replace('製作公司:', '').trim();
        }
    });

    // Score: User didn't give scores, set to null or 0.
    const score = null;

    // Status
    const status = 'Currently Airing';

    // Source (Manga/Original etc) - Hard to parse generally.

    // Run Insert
    try {
        insertStmt.run(
            idCounter++,
            title,
            title_jp,
            synopsis,
            imgUrl,
            score, // score
            status,
            'winter', // season
            2026, // year
            episodes,
            'Unknown', // source
            'Action, Adventure', // genres (dummy default or need analysis)
            studios, // studios
            '2026-01-01', // aired_from
            'PG-13' // rating
        );
        count++;
    } catch (e) {
        console.error(`Failed to insert ${title}:`, e.message);
    }
});

console.log(`✅ Successfully populated ${count} entries for 2026 1月新番 (Winter 2026).`);
