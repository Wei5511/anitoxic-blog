const db = require('better-sqlite3')('anime.db');

function verify() {
    console.log('=== Title Language Verification (2010-2022) ===');

    const stats = db.prepare(`
        SELECT 
            COUNT(*) as total,
            COUNT(CASE WHEN title_chinese IS NOT NULL AND title_chinese != '' THEN 1 END) as has_chinese,
            COUNT(CASE WHEN title_japanese IS NOT NULL AND title_japanese != '' THEN 1 END) as has_japanese
        FROM anime 
        WHERE year BETWEEN 2010 AND 2022
    `).get();

    console.log(`Total Anime: ${stats.total}`);
    console.log(`With Chinese Title: ${stats.has_chinese} (${((stats.has_chinese / stats.total) * 100).toFixed(1)}%)`);
    console.log(`With Japanese Title: ${stats.has_japanese} (${((stats.has_japanese / stats.total) * 100).toFixed(1)}%)`);

    console.log('\nYear Breakdown:');
    const years = db.prepare(`
        SELECT year, 
               COUNT(*) as total,
               COUNT(CASE WHEN title_chinese IS NOT NULL AND title_chinese != '' THEN 1 END) as has_chinese
        FROM anime 
        WHERE year BETWEEN 2010 AND 2022
        GROUP BY year
        ORDER BY year
    `).all();

    years.forEach(y => {
        const pct = ((y.has_chinese / y.total) * 100).toFixed(1);
        console.log(`- ${y.year}: ${y.has_chinese}/${y.total} (${pct}%)`);
    });


    // Sample missing
    if (stats.has_chinese < stats.total) {
        console.log('\nSample missing Chinese titles:');
        const missing = db.prepare(`
            SELECT title, year 
            FROM anime 
            WHERE year BETWEEN 2010 AND 2022 
            AND (title_chinese IS NULL OR title_chinese = '')
            LIMIT 5
        `).all();
        missing.forEach(m => console.log(`- [${m.year}] ${m.title}`));
    }
}

verify();
