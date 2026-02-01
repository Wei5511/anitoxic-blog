const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database('anime.db', { readonly: true });

// Load all maps
const mapping = {}; // URL -> Title
[1, 2, 3, 4].forEach(n => {
    try {
        const content = fs.readFileSync(path.join(__dirname, `user_urls_${n}.txt`), 'utf8');
        content.split('\n').forEach(line => {
            const parts = line.split('\t');
            if (parts.length >= 2) {
                const title = parts[0].trim();
                const url = parts[1].trim();
                mapping[url] = title;
            }
        });
    } catch (e) { }
});

const slugs = [
    'sports-picks-top10-final',
    'isekai-picks-unique-10-final',
    'healing-picks-relax-10-final',
    'suspense-picks-thriller-10-final',
    'comedy-picks-lol-10-final'
];

slugs.forEach(slug => {
    const r = db.prepare('SELECT title, content FROM articles WHERE slug = ?').get();
    if (!r) {
        console.log(`\n### Article ${slug} NOT FOUND`);
        return;
    }
    console.log(`\n### Article: ${r.title} (${slug})`);

    // Extract items (Title followed by Button)
    // Looking for ## N. Title ... <a href="URL"
    const items = r.content.split('---');
    let count = 0;
    items.forEach(item => {
        const titleMatch = item.match(/## \d+\. (.*)/);
        const urlMatch = item.match(/href="(https:\/\/www\.myvideo\.net\.tw\/details\/3\/\d+)"/);

        if (titleMatch && urlMatch) {
            const articleTitle = titleMatch[1].trim();
            const url = urlMatch[1].trim();
            const mappedTitle = mapping[url] || 'UNKNOWN';

            const isCorrect = articleTitle.includes(mappedTitle) || mappedTitle.includes(articleTitle);
            const status = isCorrect ? '✅' : '❌';

            console.log(`${status} [Article: ${articleTitle}] -> [Map: ${mappedTitle}] (${url})`);
            if (isCorrect) count++;
        }
    });
    console.log(`Total Correct: ${count}/10`);
});
