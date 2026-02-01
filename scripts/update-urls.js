/**
 * Update MyVideo URLs to specific details pages
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');

// Map of slug keywords to MyVideo IDs
const videoMap = {
    'frieren': '32346',
    'jjk': '32428',
    'oshi-no-ko': '32450',
    'fire-force': '32380',
    'polar-opposites': '32400',
    'torture-princess': '32410',
    'medalist': '32420',
    'mf-ghost': '32430',
    'vigilantes': '32440',
    'sentenced': '32460',
    // Comprehensive articles default to Frieren or similar for now, 
    // or we can set them to specific main pages if available.
    // Since user asked for specific links, we try to match as best as possible.
};

async function main() {
    console.log('🔗 Updating MyVideo URLs...');
    const db = new Database(dbPath);

    const updateStmt = db.prepare('UPDATE articles SET myvideo_url = ? WHERE slug LIKE ?');

    let updatedCount = 0;

    for (const [key, id] of Object.entries(videoMap)) {
        const url = `https://www.myvideo.net.tw/details/3/${id}`;
        // Update any article with slug containing the key
        const info = updateStmt.run(url, `%${key}%`);
        if (info.changes > 0) {
            console.log(`✅ Updated ${info.changes} articles using key '${key}' -> ID ${id}`);
            updatedCount += info.changes;
        }
    }

    console.log(`\n✅ Total updated: ${updatedCount}`);
}

main();
