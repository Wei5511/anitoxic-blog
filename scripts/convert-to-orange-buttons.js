const db = require('better-sqlite3')('anime.db');

console.log('=== Converting Article 927 Markdown Links to Orange Buttons ===\n');

const article = db.prepare('SELECT content FROM articles WHERE id = ?').get(927);

console.log('Original format check:');
console.log('Has Markdown links [text](url):', article.content.includes('[前往MyVideo'));
console.log('Has HTML buttons <a class="btn-orange-small">:', article.content.includes('class="btn-orange-small"'));

// Convert Markdown links to HTML orange buttons
// Pattern: [前往MyVideo線上觀看](URL) -> <a href="URL" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>
let fixed = article.content;

// Use regex to find and replace all Markdown links
const linkPattern = /\[前往MyVideo線上觀看\]\(([^)]+)\)/g;
fixed = fixed.replace(linkPattern, '<a href="$1" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>');

// Count how many we converted
const matches = article.content.match(linkPattern);
const count = matches ? matches.length : 0;

console.log('\nFound', count, 'Markdown link(s) to convert');

if (count > 0) {
    // Update database
    const result = db.prepare('UPDATE articles SET content = ? WHERE id = ?').run(fixed, 927);
    console.log('✅ Updated article 927');
    console.log('   Changes:', result.changes);

    // Verify
    const updated = db.prepare('SELECT content FROM articles WHERE id = ?').get(927);
    const hasButtons = updated.content.includes('class="btn-orange-small"');
    const hasMarkdownLinks = updated.content.includes('[前往MyVideo');

    console.log('\n✅ Verification:');
    console.log('   Has HTML orange buttons:', hasButtons);
    console.log('   Still has Markdown links:', hasMarkdownLinks);

    if (hasButtons && !hasMarkdownLinks) {
        console.log('   ✅ Successfully converted to orange buttons!');
    }
} else {
    console.log('✅ No Markdown links found - may already be converted!');
}

db.close();
console.log('\n✅ Done!');
