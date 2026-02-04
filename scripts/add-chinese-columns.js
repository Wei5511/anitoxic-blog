const db = require('better-sqlite3')('anime.db');

console.log('=== Adding Chinese Columns to anime Table ===\n');

try {
    // Check if columns already exist
    const schema = db.prepare("PRAGMA table_info(anime)").all();
    const hasChineseTitle = schema.some(col => col.name === 'title_chinese');
    const hasChineseSynopsis = schema.some(col => col.name === 'synopsis_chinese');

    if (hasChineseTitle && hasChineseSynopsis) {
        console.log('✅ Chinese columns already exist!');
        console.log('   - title_chinese: EXISTS');
        console.log('   - synopsis_chinese: EXISTS');
    } else {
        // Add columns
        if (!hasChineseTitle) {
            console.log('Adding title_chinese column...');
            db.prepare('ALTER TABLE anime ADD COLUMN title_chinese TEXT').run();
            console.log('✅ Added title_chinese');
        } else {
            console.log('✅ title_chinese already exists');
        }

        if (!hasChineseSynopsis) {
            console.log('Adding synopsis_chinese column...');
            db.prepare('ALTER TABLE anime ADD COLUMN synopsis_chinese TEXT').run();
            console.log('✅ Added synopsis_chinese');
        } else {
            console.log('✅ synopsis_chinese already exists');
        }
    }

    // Verify
    console.log('\n=== Verification ===');
    const updatedSchema = db.prepare("PRAGMA table_info(anime)").all();
    const chineseColumns = updatedSchema.filter(col => col.name.includes('chinese'));

    console.log('Chinese columns in anime table:');
    chineseColumns.forEach(col => {
        console.log(`  - ${col.name} (${col.type})`);
    });

    console.log('\n✅ Schema migration complete!');

} catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
} finally {
    db.close();
}
