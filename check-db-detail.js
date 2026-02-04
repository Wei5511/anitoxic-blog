const db = require('better-sqlite3')('anime.db');

console.log('=== Checking Article 927 ACTUAL Database Content ===\n');

const article = db.prepare('SELECT content FROM articles WHERE id = 927').get();

console.log('1. First 500 characters:');
console.log(article.content.substring(0, 500));
console.log('\n');

console.log('2. Has double exclamation marks !![ :', article.content.includes('!!['));
console.log('3. Has orange button class:', article.content.includes('btn-orange-small'));
console.log('4. Has Markdown links [前往:', article.content.includes('[前往'));

console.log('\n5. Line 6 (should be image):');
const lines = article.content.split('\n');
console.log(`   "${lines[5]}"`);

console.log('\n6. Line 22 (should be button):');
console.log(`   "${lines[21]}"`);

console.log('\n7. Search for all image lines:');
lines.forEach((line, i) => {
    if (line.trim().startsWith('![')) {
        console.log(`   Line ${i + 1}: ${line.substring(0, 100)}`);
    }
});

console.log('\n8. Search for all button/link lines:');
lines.forEach((line, i) => {
    if (line.includes('前往MyVideo') || line.includes('btn-orange')) {
        console.log(`   Line ${i + 1}: ${line.substring(0, 120)}`);
    }
});

db.close();
