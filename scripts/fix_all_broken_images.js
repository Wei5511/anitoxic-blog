const Database = require('better-sqlite3');
const db = new Database('anime.db');

// Get all articles
const articles = db.prepare('SELECT id, title, content FROM articles').all();

let totalFixed = 0;

articles.forEach(article => {
    let content = article.content;
    let modified = false;

    // Regex to find markdown images with local paths: ![Alt Text](/images/...)
    // Also matches HTML img tags if present, but primarily targeting markdown
    // We capture: 1. Alt text, 2. Path
    const regex = /!\[(.*?)\]\((.*?)\)/g;

    content = content.replace(regex, (match, alt, path) => {
        // Only fix local paths starting with /
        if (!path.startsWith('/') && !path.startsWith('images/')) {
            return match;
        }

        // Try to find a match in myvideo_library using the Alt text (Title)
        // Clean up alt text (remove numbering like "1. Name")
        let searchTitle = alt.replace(/^\d+\.\s*/, '').trim();

        // Specific fix for "我推的孩子" if needed
        if (searchTitle.includes('我推的孩子')) searchTitle = '我推的孩子';

        const libEntry = db.prepare('SELECT image_url FROM myvideo_library WHERE title LIKE ?').get(`%${searchTitle}%`);

        if (libEntry && libEntry.image_url && libEntry.image_url.startsWith('http')) {
            console.log(`[Art:${article.id}] Fixing "${alt}": ${path} -> ${libEntry.image_url}`);
            modified = true;
            return `![${alt}](${libEntry.image_url})`;
        } else {
            console.log(`[Art:${article.id}] SKIP: "${searchTitle}" (Matches found: ${!!libEntry})`);
            return match; // Keep original if no better option found
        }
    });

    if (modified) {
        db.prepare('UPDATE articles SET content = ? WHERE id = ?').run(content, article.id);
        totalFixed++;
    }
});

console.log(`\nGlobal Fix Complete. Updated ${totalFixed} articles.`);
