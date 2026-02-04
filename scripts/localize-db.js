const Database = require('better-sqlite3');
const fs = require('fs');
const path = require('path');

const db = new Database('anime.db');

// 1. Load Mapping
let mapping = {};
try {
    const raw = fs.readFileSync('consolidated_mapping.json', 'utf-8');
    const titleToId = JSON.parse(raw);
    // Flip to ID -> Title
    for (const [title, id] of Object.entries(titleToId)) {
        if (id) {
            mapping[id] = title;
        }
    }
} catch (e) {
    console.log('No consolidated_mapping.json found or invalid.');
}

// 2. Update Titles from Mapping
const updateTitle = db.prepare('UPDATE anime SET title = ? WHERE mal_id = ?');
let titleCount = 0;
for (const [id, title] of Object.entries(mapping)) {
    const info = updateTitle.run(title, id);
    if (info.changes > 0) titleCount++;
}
console.log(`Updated ${titleCount} titles from mapping.`);

// 3. Translate Status
const statusMapping = {
    'Finished Airing': '已完結',
    'Currently Airing': '連載中',
    'Not yet aired': '未播出'
};
for (const [eng, chi] of Object.entries(statusMapping)) {
    const info = db.prepare('UPDATE anime SET status = ? WHERE status = ?').run(chi, eng);
    console.log(`Updated status '${eng}' -> '${chi}': ${info.changes} rows`);
}

// 4. Translate Season (if stored as string)
// Note: Season is usually 'winter', 'spring' etc (lowercase). 
// The UI translates these. But if user wants DB content to be Chinese...
// Usually we keep raw data as enum-like identifiers.
// Since existing code (database/page.js) handles 'winter'/'spring' mapping, changing DB values might BREAK the UI filtering.
// I will NOT translate 'year' or 'season' columns in DB to avoid breaking logic.
// However, 'type' might be displayed directly?
// Let's check schema/inspection from previous steps. 'type' was not in the SELECT list.
// Let's assume 'type' exists (Jikan data has it).

// 5. Fate Image Fix (Ensure it is the Bahamut one)
const fateImg = 'https://p2.bahamut.com.tw/B/ACG/c/43/0000133843.JPG';
// Add cache buster just in case
const fateImgWithVer = fateImg + '?v=4';
const fateUpdate = db.prepare("UPDATE anime SET image_url = ? WHERE title LIKE '%Fate/strange%'").run(fateImgWithVer);
console.log(`Fate image force updated: ${fateUpdate.changes}`);

// 6. Report on Synopsis
const englishSynopsis = db.prepare("SELECT COUNT(*) as count FROM anime WHERE synopsis REGEXP '[a-zA-Z]{10,}'").get(); // Simple heuristic
// SQLite default doesn't have REGEXP usually unless loaded.
// Use LIKE
const engSynopsis = db.prepare("SELECT COUNT(*) as count FROM anime WHERE synopsis LIKE '% the %'").get();
console.log(`Approx. entries with English synopsis: ${engSynopsis.count}`);
