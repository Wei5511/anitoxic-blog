const db = require('better-sqlite3')('anime.db');

console.log('=== Fixing Image Syntax in Article 927 ===\n');

// Get current content
const article = db.prepare('SELECT content FROM articles WHERE id = ?').get(927);

console.log('Checking for double exclamation marks...');
const hasDouble = article.content.includes('!![');
console.log('Has !![ syntax:', hasDouble);

if (hasDouble) {
    // Fix double exclamation marks - use simple string replace
    let fixed = article.content;
    while (fixed.includes('!![')) {
        fixed = fixed.replace('!![', '![');
    }

    // Count how many we fixed
    let count = 0;
    let temp = article.content;
    while (temp.includes('!![')) {
        temp = temp.replace('!![', '![');
        count++;
    }
    console.log('Found', count, 'instances of !![');

    // Update database
    const result = db.prepare('UPDATE articles SET content = ? WHERE id = ?').run(fixed, 927);
    console.log('\n✅ Updated article 927');
    console.log('   Changes:', result.changes);

    // Verify
    const updated = db.prepare('SELECT content FROM articles WHERE id = ?').get(927);
    const stillHasDouble = updated.content.includes('!![');
    console.log('\n✅ Verification:');
    console.log('   Still has !![ syntax:', stillHasDouble);

    if (!stillHasDouble) {
        console.log('   ✅ All double exclamation marks fixed!');

        // Show first few lines
        const lines = updated.content.split('\n').slice(4, 8);
        console.log('\n✅ Sample of fixed content:');
        lines.forEach((line, i) => console.log(`   ${i + 5}: ${line.substring(0, 80)}`));
    }
} else {
    console.log('✅ No double exclamation marks found - already fixed!');
}

db.close();
console.log('\n✅ Done!');
