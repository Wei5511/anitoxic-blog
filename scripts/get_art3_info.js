const Database = require('better-sqlite3');
const db = new Database('anime.db');
const row = db.prepare('SELECT title FROM articles WHERE id = 3').get();
if (row) {
    console.log(`TITLE: ${row.title}`);
    // Try to find image in library
    const lib = db.prepare('SELECT image_url FROM myvideo_library WHERE title LIKE ?').get('%' + row.title + '%');
    console.log(`IMG: ${lib ? lib.image_url : 'MISSING'}`);
} else {
    console.log('Article 3 not found');
}
