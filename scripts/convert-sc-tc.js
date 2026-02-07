const db = require('better-sqlite3')('anime.db');
const OpenCC = require('opencc-js');

async function convertTitles() {
    console.log('Starting Simplified -> Traditional Chinese conversion...');

    // Initialize converter (Simplified to Traditional Taiwan)
    const converter = OpenCC.Converter({ from: 'cn', to: 'tw' });

    // Get all anime with Chinese titles
    const animeList = db.prepare("SELECT mal_id, title_chinese FROM anime WHERE title_chinese IS NOT NULL AND title_chinese != ''").all();
    console.log(`Found ${animeList.length} titles to check.`);

    const updateStmt = db.prepare('UPDATE anime SET title_chinese = ? WHERE mal_id = ?');

    let updatedCount = 0;

    for (const anime of animeList) {
        const original = anime.title_chinese;
        const converted = converter(original);

        if (original !== converted) {
            updateStmt.run(converted, anime.mal_id);
            updatedCount++;
            console.log(`[CONVERTED] ${anime.mal_id}: ${original} -> ${converted}`);
        }
    }

    console.log(`\nConversion complete. Updated ${updatedCount} titles.`);
}

convertTitles();
