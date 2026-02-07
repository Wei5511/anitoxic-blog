const db = require('better-sqlite3')('anime.db');
const { sleep } = require('../src/lib/tmdb');

async function fixImages() {
    console.log('Fixing specific images for Article 931...');

    const row = db.prepare('SELECT content FROM articles WHERE id = 931').get();
    let content = row.content;

    // 1. Fix Frieren (Failed replacement)
    const frierenOld = 'https://d28s5ztqvkii64.cloudfront.net/images/anime/5660/jH8fWyVuPX.jpg';
    // Use the one found in previous step or search again. 
    // Previous found: https://image.tmdb.org/t/p/w500/kh0L66cvTdaCk4Njk8oZ58N27iJ.jpg (Visual from TMDB)
    const frierenNew = 'https://image.tmdb.org/t/p/w500/kh0L66cvTdaCk4Njk8oZ58N27iJ.jpg';

    if (content.includes(frierenOld)) {
        console.log('Replacing Frieren image...');
        content = content.replace(frierenOld, frierenNew);
    } else {
        console.log('Frieren old image not found in content (already fixed?).');
    }

    // 2. Fix Hero Execution (MAL link 403?)
    const heroOld = 'https://cdn.myanimelist.net/images/anime/1969/116702l.jpg';
    const heroNew = await searchTmdbImage('Sentenced to Be a Hero');
    if (heroNew) {
        console.log(`Replacing Hero Execution: ${heroNew}`);
        content = content.replace(heroOld, heroNew);
    }

    // 3. Fix Opposite You and Me (MAL link 403?)
    const oppositeOld = 'https://cdn.myanimelist.net/images/anime/4/34949l.jpg';
    // "You and Me Are Polar Opposites"
    const oppositeNew = await searchTmdbImage('You and Me Are Polar Opposites');
    if (oppositeNew) {
        console.log(`Replacing Opposite You and Me: ${oppositeNew}`);
        content = content.replace(oppositeOld, oppositeNew);
    }

    // Update DB
    db.prepare('UPDATE articles SET content = ? WHERE id = 931').run(content);
    // Also update main image if it was Frieren
    db.prepare('UPDATE articles SET image_url = ? WHERE id = 931 AND image_url LIKE ?').run(frierenNew, '%cloudfront%');
    console.log('Done.');
}

async function searchTmdbImage(query) {
    const TMDB_API_KEY = '8a85aea05084693c8dbcd1c0ffbfbf85';
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=zh-TW`;
    try {
        const res = await fetch(url);
        // Fallback to English if no ZH results (often the case for new niche shows)
        let data = await res.json();

        // If no results in Chinese, try English/Japanese query (no language param defaults to En-US mostly but query matters)
        // Actually, just remove language param to get all results? No, language param filters results in simpler endpoints.
        // Let's try searching without language param if first one fails
        if (!data.results || data.results.length === 0) {
            const urlEn = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}`;
            const resEn = await fetch(urlEn);
            data = await resEn.json();
        }

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

fixImages();
