const db = require('better-sqlite3')('anime.db');

async function fixOpposite() {
    console.log('Fixing Opposite You and Me image...');
    const row = db.prepare('SELECT content FROM articles WHERE id = 931').get();
    let content = row.content;

    const oldUrl = 'https://cdn.myanimelist.net/images/anime/4/34949l.jpg';
    // Search TMDB for "Seihantai na Kimi to Boku"
    const newUrl = await searchTmdbImage('Seihantai na Kimi to Boku');

    if (newUrl) {
        console.log(`Found new URL: ${newUrl}`);
        if (content.includes(oldUrl)) {
            content = content.replace(oldUrl, newUrl);
            db.prepare('UPDATE articles SET content = ? WHERE id = 931').run(content);
            console.log('Article 931 updated.');
        } else {
            console.log('Old URL not found in content.');
        }
    } else {
        console.log('No image found via TMDB.');
    }
}

async function searchTmdbImage(query) {
    const TMDB_API_KEY = '8a85aea05084693c8dbcd1c0ffbfbf85';
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            const match = data.results.find(r => r.poster_path) || data.results[0];
            if (match && match.poster_path) {
                return `https://image.tmdb.org/t/p/w500${match.poster_path}`;
            }
        }
    } catch (e) {
        console.error(e);
    }
    return null;
}

fixOpposite();
