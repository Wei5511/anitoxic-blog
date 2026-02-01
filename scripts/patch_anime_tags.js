const db = require('better-sqlite3')('anime.db');

function main() {
    console.log('Patching anime tags for new categories (勇者, 熱血, 戰鬥)...');

    // Select all anime with necessary fields
    const animes = db.prepare('SELECT mal_id, title, genres, synopsis FROM anime').all();

    let updatedCount = 0;

    const updateStmt = db.prepare('UPDATE anime SET genres = ? WHERE mal_id = ?');

    for (const anime of animes) {
        let currentTags = new Set((anime.genres || '').split(',').filter(t => t.trim()));
        let originalSize = currentTags.size;

        const synopsis = (anime.synopsis || '').toLowerCase();
        const title = (anime.title || '').toLowerCase();

        // 戰鬥 (Action)
        // Usually already covered by update_anime_tags.js but double check synopsis
        if (synopsis.includes('action') || synopsis.includes('battle') || synopsis.includes('fight')) {
            currentTags.add('戰鬥');
        }

        // 勇者 (Hero)
        if (title.includes('hero') || title.includes('勇者') ||
            synopsis.includes('hero') || synopsis.includes('demon king') || synopsis.includes('brave')) {
            currentTags.add('勇者');
        }

        // 熱血 (Hot-blooded/Shounen Action)
        // Often defined by "Shounen" and "Action" existing together, or just "Action" and high stakes
        if (currentTags.has('戰鬥') && (synopsis.includes('shounen') || synopsis.includes('passionate') || synopsis.includes('dream'))) {
            currentTags.add('熱血');
        }
        // Easy catch-all for anything with "Action" + "Fantasy" is often 熱血-adjacent
        if (currentTags.has('戰鬥') && currentTags.has('奇幻')) {
            // currentTags.add('熱血'); // Maybe too broad?
        }

        // Manual keywords
        if (synopsis.includes('hot-blooded') || synopsis.includes('passionate')) {
            currentTags.add('熱血');
        }

        if (currentTags.size > originalSize) {
            const newTags = Array.from(currentTags).join(',');
            updateStmt.run(newTags, anime.mal_id);
            updatedCount++;
        }
    }

    console.log(`Patched ${updatedCount} entries.`);
}

main();
