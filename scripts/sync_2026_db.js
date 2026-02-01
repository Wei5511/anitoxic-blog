const fs = require('fs');
const cheerio = require('cheerio');
const db = require('better-sqlite3')('anime.db');

// 1. Extend Schema
const columns = [
    'synopsis TEXT',
    'staff TEXT',
    'cast TEXT',
    'image_url TEXT',
    'metadata TEXT' // JSON for others
];

columns.forEach(col => {
    try {
        db.prepare(`ALTER TABLE myvideo_library ADD COLUMN ${col}`).run();
        console.log(`Added column: ${col.split(' ')[0]}`);
    } catch (e) {
        // Ignore if exists
    }
});

// 2. Read HTML
const html = fs.readFileSync('jan_2026_raw.html', 'utf-8');
const $ = cheerio.load(html);

// 3. Parse Articles
const articles = $('article');
console.log(`Found ${articles.length} anime entries.`);

let updatedCount = 0;
let newLinkCount = 0;

articles.each((i, el) => {
    const $el = $(el);
    const title = $el.find('h3 a').text().trim();
    const jpTitle = $el.find('h3 + p').text().trim();

    // Synopsis
    // Find h4 with text "作品簡介", then get the next p
    let synopsis = '';
    $el.find('h4').each((j, h4) => {
        if ($(h4).text().includes('作品簡介')) {
            synopsis = $(h4).next('p').text().trim();
        }
    });

    // Staff
    let staff = [];
    $el.find('h4').each((j, h4) => {
        if ($(h4).text().includes('製作陣容')) {
            $(h4).next('ul').find('li').each((k, li) => {
                const name = $(li).find('div').eq(0).text().trim();
                const role = $(li).find('div').eq(1).text().trim();
                staff.push(`${role}: ${name}`);
            });
        }
    });

    // Cast
    let cast = [];
    $el.find('h4').each((j, h4) => {
        if ($(h4).text().includes('演出聲優')) {
            $(h4).next('ul').find('li').each((k, li) => {
                const name = $(li).find('div').eq(0).text().replace('CV:', '').trim();
                const role = $(li).find('div').eq(1).text().trim();
                cast.push(`${role} (${name})`);
            });
        }
    });

    // Streaming Links (MyVideo)
    let myVideoUrl = null;
    $el.find('h4').each((j, h4) => {
        if ($(h4).text().includes('台灣播出資訊')) {
            $(h4).nextAll('ul').find('a').each((k, a) => {
                const href = $(a).attr('href');
                const text = $(a).text();
                if (text.includes('MyVideo') || (href && href.includes('myvideo.net.tw'))) {
                    myVideoUrl = href;
                }
            });
        }
    });

    // Image (just for metadata)
    const imgUrl = $el.find('img').first().attr('src');

    // 4. Upsert
    // If title exists, update. If not, insert? 
    // myvideo_library PK is title.

    const stmt = db.prepare(`
        INSERT INTO myvideo_library (title, url, synopsis, staff, cast, image_url, updated_at)
        VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        ON CONFLICT(title) DO UPDATE SET
            synopsis = excluded.synopsis,
            staff = excluded.staff,
            cast = excluded.cast,
            image_url = excluded.image_url,
            url = COALESCE(excluded.url, myvideo_library.url), -- Only update URL if new one found? Or overwrite? 
            -- User provided list has "MyVideo" links. We should probably overwrite if found, but keep old if not found?
            -- Actually if parsing failed we don't want to lose data.
            -- But excluded.url will be null if myVideoUrl is null.
            updated_at = CURRENT_TIMESTAMP
    `);

    // We need to handle the case where we don't have a myVideoUrl. 
    // If passed as null, COALESCE(null, old) keeps old.

    stmt.run(title, myVideoUrl, synopsis, staff.join('\n'), cast.join('\n'), imgUrl);

    if (myVideoUrl) newLinkCount++;
    updatedCount++;
    // console.log(`Processed: ${title}`);
});

console.log(`Synced ${updatedCount} animes. Found ${newLinkCount} MyVideo links.`);
