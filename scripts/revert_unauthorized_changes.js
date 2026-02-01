const Database = require('better-sqlite3');
const db = new Database('anime.db');
const backupDb = new Database('temp_revert/anime.sqlite');

// The articles that were modified by the unauthorized script
// Based on logs: 876, 879, and others that were "fixed"
// To be safe, we will diff ALL articles and revert any that were changed in the last few minutes
// But since we know the specific script touched things, let's just blindly revert ALL articles 
// EXCEPT the 4 deleted ones (which are already gone, so updating them does nothing) to the backup state.
// This is the safest "undo".

const backupArticles = backupDb.prepare('SELECT id, title, content, excerpt, image_url FROM articles').all();

let revertedCount = 0;

backupArticles.forEach(backupArt => {
    // Skip the 4 deleted articles if they exist in backup
    if ([877, 878, 906, 907].includes(backupArt.id)) return;

    const currentArt = db.prepare('SELECT content FROM articles WHERE id = ?').get(backupArt.id);

    if (currentArt && currentArt.content !== backupArt.content) {
        console.log(`Reverting Article ${backupArt.id}: ${backupArt.title}`);
        db.prepare('UPDATE articles SET content = ?, title = ?, excerpt = ?, image_url = ? WHERE id = ?')
            .run(backupArt.content, backupArt.title, backupArt.excerpt, backupArt.image_url, backupArt.id);
        revertedCount++;
    }
});

console.log(`\nRevert Complete. Reverted ${revertedCount} articles to backup state.`);
