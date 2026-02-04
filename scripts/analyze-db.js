const db = require('better-sqlite3')('anime.db');

console.log('=== myvideo_library Full Schema ===\n');
const schema = db.prepare("PRAGMA table_info(myvideo_library)").all();
schema.forEach(col => {
    console.log(`${col.cid}. ${col.name} (${col.type}) ${col.pk ? '[PK]' : ''} ${col.notnull ? '[NOT NULL]' : ''}`);
});

console.log('\n=== Sample Entries ===\n');
const samples = db.prepare("SELECT * FROM myvideo_library LIMIT 3").all();
samples.forEach((s, i) => {
    console.log(`\n--- Entry ${i + 1} ---`);
    Object.keys(s).slice(0, 8).forEach(key => {
        const val = s[key];
        const display = val ? String(val).substring(0, 60) : 'NULL';
        console.log(`  ${key}: ${display}`);
    });
});

console.log(`\n=== Total Entries in myvideo_library: ${db.prepare("SELECT COUNT(*) as count FROM myvideo_library").get().count} ===`);

// Check anime table too
console.log('\n=== anime Table Schema ===\n');
const animeSchema = db.prepare("PRAGMA table_info(anime)").all();
animeSchema.forEach(col => {
    console.log(`${col.cid}. ${col.name} (${col.type}) ${col.pk ? '[PK]' : ''}`);
});

console.log('\n=== anime Table Sample ===\n');
const animeSample = db.prepare("SELECT * FROM anime WHERE year BETWEEN 2010 AND 2022 LIMIT 2").all();
animeSample.forEach((s, i) => {
    console.log(`\n--- Anime ${i + 1} ---`);
    console.log(`  ID: ${s.id}`);
    console.log(`  Title: ${s.title}`);
    console.log(`  Title JP: ${s.title_japanese || 'N/A'}`);
    console.log(`  Year: ${s.year} ${s.season}`);
    console.log(`  Synopsis: ${(s.synopsis || 'N/A').substring(0, 80)}`);
});

const animeCount = db.prepare("SELECT COUNT(*) as count FROM anime WHERE year BETWEEN 2010 AND 2022").get();
console.log(`\n=== anime Entries (2010-2022): ${animeCount.count} ===`);

db.close();
