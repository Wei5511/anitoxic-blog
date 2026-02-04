const Database = require('better-sqlite3');
const db = new Database('anime.db');

const searchTerms = ['咒術', '泛而不精', '貴族', '芙莉蓮', '我推'];

console.log('--- Searching Anime Table ---');
searchTerms.forEach(term => {
    try {
        const rows = db.prepare(`SELECT * FROM anime WHERE title LIKE '%${term}%' OR title_japanese LIKE '%${term}%'`).all();
        if (rows.length > 0) {
            console.log(`\nmatches for '${term}':`);
            rows.forEach(r => {
                console.log(`[ID ${r.mal_id}] Title: ${r.title}`);
                console.log(`       JP: ${r.title_japanese}`);
                console.log(`       Image: ${r.image_url}`);
                console.log(`       Stream: ${r.streaming}`);
            });
        }
    } catch (e) {
        console.error(`Error searching '${term}':`, e.message);
    }
});

console.log('\n--- Searching Articles for reference ---');
try {
    const articles = db.prepare("SELECT title, content FROM articles WHERE content LIKE '%http%' LIMIT 5").all();
    // Just peek at some content to see format
} catch (e) { }
