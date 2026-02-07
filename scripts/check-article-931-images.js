const db = require('better-sqlite3')('anime.db');
const { sleep } = require('../src/lib/tmdb'); // Re-use sleep

// Map titles to DB IDs for reference (same as before)
const data = [
    { title: '葬送的芙莉蓮', id: 202601002 },
    { title: '咒術迴戰', id: 56641 },
    { title: '【我推的孩子】', id: 202601001 },
    { title: '貴族轉生', id: 202601026 },
    { title: '泛而不精', id: 202601025 },
    { title: '判處勇者刑', id: 32447 },
    { title: '相反的你和我', id: 10460 },
    { title: 'Fate/strange Fake', id: 202307015 },
    { title: '安逸領主', id: 202601035 },
    { title: '燃油車鬥魂', id: 202310019 }
];

async function checkAndFixImages() {
    console.log('Checking images for Article 931...');

    // Get article content
    const row = db.prepare('SELECT content FROM articles WHERE id = 931').get();
    if (!row) {
        console.error('Article 931 not found.');
        return;
    }

    let content = row.content;

    // Regex to find markdown images: ![Alt](URL)
    const imgRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
    let match;
    let replacements = [];

    // Find all images
    while ((match = imgRegex.exec(content)) !== null) {
        const fullMatch = match[0];
        const alt = match[1];
        const url = match[2];
        replacements.push({ fullMatch, alt, url });
    }

    console.log(`Found ${replacements.length} images.`);

    for (const item of replacements) {
        console.log(`Checking: ${item.alt} -> ${item.url}`);

        let isValid = false;
        try {
            const res = await fetch(item.url, { method: 'HEAD' });
            if (res.ok) {
                isValid = true;
                console.log('   [OK]');
            } else {
                console.log(`   [BROKEN] Status: ${res.status}`);
            }
        } catch (err) {
            console.log(`   [ERROR] ${err.message}`);
        }

        if (!isValid) {
            console.log('   Attempting to find new image...');
            const newUrl = await searchTmdbImage(item.alt);
            if (newUrl) {
                console.log(`   [FIXED] New URL: ${newUrl}`);
                content = content.replace(item.url, newUrl);

                // Also update the main anime table just in case? 
                // No, just the article for now to be safe.
            } else {
                console.log('   [FAILED] No replacement found.');
            }
        }
        await sleep(500);
    }

    // Save updated content
    db.prepare('UPDATE articles SET content = ? WHERE id = 931').run(content);
    console.log('Article 931 updated.');
}

// Helper to search TMDB for image
async function searchTmdbImage(title) {
    const TMDB_API_KEY = '8a85aea05084693c8dbcd1c0ffbfbf85';
    // Clean title for search (remove Season X, etc)
    const cleanTitle = title.replace(/第二季|第三季|Season \d+|Part \d+/gi, '').trim();
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(cleanTitle)}&language=zh-TW`;

    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();

        if (data.results && data.results.length > 0) {
            // Prefer anime/animation with poster
            const match = data.results.find(r => (r.media_type === 'tv' || r.media_type === 'movie') && r.poster_path) || data.results[0];
            if (match && match.poster_path) {
                return `https://image.tmdb.org/t/p/w500${match.poster_path}`;
            }
        }
    } catch (e) {
        console.error('TMDB Search Error:', e);
    }
    return null;
}

checkAndFixImages();
