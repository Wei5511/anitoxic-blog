const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Check FULL schema
const schema = db.prepare("PRAGMA table_info(anime)").all();
console.log('--- Schema ---');
schema.forEach(c => console.log(c.name));

// Search for target shows using generic select to avoid column errors
// We want to find matches for our 5 shows
const searchTerms = ['咒術', '泛而不精', '貴族', '芙莉蓮', '我推'];
const results = {};

console.log('\n--- Searching ---');
searchTerms.forEach(term => {
    try {
        // Just select * to see what we get
        const rows = db.prepare(`SELECT * FROM anime WHERE title LIKE '%${term}%' OR content LIKE '%${term}%'`).all();
        if (rows.length > 0) {
            console.log(`\nFound matches for '${term}':`);
            rows.forEach(r => {
                console.log(`[ID ${r.id}] Title: ${r.title}`);
                console.log(`       Image: ${r.image_url}`);
                console.log(`       Link: ${r.link} / MyVideo: ${r.myvideo_url}`);
            });
        } else {
            console.log(`No matches for '${term}'`);
        }
    } catch (e) {
        console.error(`Error searching '${term}':`, e.message);
    }
});
