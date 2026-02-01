const fs = require('fs');
const path = require('path');
const https = require('https');

const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');

// Target Files and Search Queries
const targets = [
    { file: 'vigilantes.jpg', query: 'My Hero Academia Vigilantes', type: 'manga' },
    { file: 'vigilantes-rec.jpg', query: 'My Hero Academia Vigilantes', type: 'manga' },
    { file: 'sentenced.jpg', query: 'Sentenced to be a Hero', type: 'manga' }, // Using Manga/LN cover
    { file: 'dark-fantasy-rec.jpg', query: 'Sentenced to be a Hero', type: 'manga' },
    { file: 'jjk-culling.jpg', query: 'Jujutsu Kaisen Season 3', type: 'anime' }, // Culling Game
    { file: 'jjk-culling-analysis.jpg', query: 'Jujutsu Kaisen Season 3', type: 'anime' },
    { file: 'fire-force-s3.jpg', query: 'Fire Force Season 3', type: 'anime' },
    { file: 'polar-opposites.jpg', query: 'You and I are Polar Opposites', type: 'manga' },
    { file: 'relaxing-rec.jpg', query: 'You and I are Polar Opposites', type: 'manga' },
    { file: 'torture-princess.jpg', query: 'Tis Time for Torture Princess Season 2', type: 'anime' },
    { file: 'oshi-no-ko-s3.jpg', query: 'Oshi no Ko Season 3', type: 'anime' },
    { file: 'oshi-no-ko-s3-analysis.jpg', query: 'Oshi no Ko Season 3', type: 'anime' },
    { file: 'mf-ghost-s3.jpg', query: 'MF Ghost 2nd Season', type: 'anime' }, // Closest match if S3 not on MAL yet
    { file: 'frieren-s2.jpg', query: 'Frieren Season 2', type: 'anime' },
    { file: 'frieren-s2-analysis.jpg', query: 'Frieren Season 2', type: 'anime' },
    { file: 'top-10-winter.jpg', query: 'Frieren Season 2', type: 'anime' },
    { file: 'hidden-gems.jpg', query: 'Darwins Incident', type: 'manga' },
    { file: 'medalist.jpg', query: 'Medalist', type: 'anime' },
    { file: 'game-rec.jpg', query: 'Shangri-La Frontier Season 2', type: 'anime' }, // Good game anime
    { file: 'movie-rec.jpg', query: 'Chainsaw Man Movie', type: 'anime' },
    { file: 'music-rec.jpg', query: 'BanG Dream! Ave Mujica', type: 'anime' },
    { file: 'sakuga-rec.jpg', query: 'Sakamoto Days', type: 'anime' },
    { file: 'seiyuu-rec.jpg', query: 'Apocalypse Hotel', type: 'anime' } // original anime
];

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function searchAndGetImage(query, type) {
    return new Promise((resolve) => {
        const url = `https://api.jikan.moe/v4/${type}?q=${encodeURIComponent(query)}&limit=1`;
        console.log(`🔍 Searching: ${query} (${type})...`);

        https.get(url, { headers: { 'User-Agent': 'Bot' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode !== 200) {
                    console.log(`❌ API Error ${res.statusCode}`);
                    resolve(null);
                    return;
                }
                try {
                    const json = JSON.parse(data);
                    if (json.data && json.data.length > 0) {
                        const img = json.data[0].images.jpg.large_image_url || json.data[0].images.jpg.image_url;
                        console.log(`✅ Foundation: ${json.data[0].title} -> ${img}`);
                        resolve(img);
                    } else {
                        console.log(`❌ No data found for ${query}`);
                        resolve(null);
                    }
                } catch (e) {
                    console.log(`❌ Parse Error`);
                    resolve(null);
                }
            });
        }).on('error', () => resolve(null));
    });
}

function download(url, filename) {
    return new Promise((resolve) => {
        if (!url) {
            resolve();
            return;
        }
        const filepath = path.join(imageDir, filename);
        // Delete existing if it might be 0 bytes
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

        const file = fs.createWriteStream(filepath);
        https.get(url, res => {
            res.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`💾 Saved: ${filename}`);
                resolve();
            });
        }).on('error', () => {
            console.log(`❌ Download Error: ${filename}`);
            resolve();
        });
    });
}

async function main() {
    if (!fs.existsSync(imageDir)) fs.mkdirSync(imageDir, { recursive: true });

    for (const t of targets) {
        const imgUrl = await searchAndGetImage(t.query, t.type);
        await download(imgUrl, t.file);
        await sleep(1000); // Rate limit respect (Jikan allows 3 req/sec but be safe)
    }
    console.log('🎉 All Official Images Downloaded via MAL!');
}

main();
