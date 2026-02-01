const fs = require('fs');
const path = require('path');
const https = require('https');

const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');

// Official IDs
const mappings = [
    { file: 'vigilantes.jpg', id: '5923' },
    { file: 'vigilantes-rec.jpg', id: '5923' },
    { file: 'sentenced.jpg', id: '4415' },
    { file: 'dark-fantasy-rec.jpg', id: '4415' },
    { file: 'jjk-culling.jpg', id: '4942' },
    { file: 'jjk-culling-analysis.jpg', id: '4942' },
    { file: 'fire-force-s3.jpg', id: '5332' },
    { file: 'polar-opposites.jpg', id: '5590' },
    { file: 'relaxing-rec.jpg', id: '5590' },
    { file: 'torture-princess.jpg', id: '5058' },
    { file: 'oshi-no-ko-s3.jpg', id: '5505' },
    { file: 'oshi-no-ko-s3-analysis.jpg', id: '5505' },
    { file: 'mf-ghost-s3.jpg', id: '5646' },
    { file: 'frieren-s2.jpg', id: '5483' },
    { file: 'frieren-s2-analysis.jpg', id: '5483' },
    { file: 'top-10-winter.jpg', id: '5483' },
    { file: 'hidden-gems.jpg', id: '5244' },         // Darwin's Incident
    { file: 'medalist.jpg', id: '5800' },            // Medalist
    { file: 'game-rec.jpg', id: '5923' },
    { file: 'movie-rec.jpg', id: '5483' },
    { file: 'music-rec.jpg', id: '5505' },
    { file: 'sakuga-rec.jpg', id: '5332' },
    { file: 'seiyuu-rec.jpg', id: '5590' }
];

async function download(id, filename) {
    // Try singular first, then plural? Let's try plural based on user's hint
    const url = `https://youranimes.tw/images/animes/${id}.jpg`;

    return new Promise((resolve) => {
        const filepath = path.join(imageDir, filename);
        // Ensure file is deleted before retry to avoid appending to garbage
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

        const file = fs.createWriteStream(filepath);
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Referer': 'https://youranimes.tw/' // CRITICAL FIX
            }
        }, res => {
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    const stats = fs.statSync(filepath);
                    if (stats.size > 1000) {
                        console.log(`✅ Downloaded ${filename} (${stats.size} bytes)`);
                    } else {
                        console.error(`❌ Zero/Small Byte Download: ${filename} (${stats.size})`);
                    }
                    resolve();
                });
            } else {
                console.error(`❌ Failed ${filename} (ID ${id}): ${res.statusCode}`);
                file.close();
                resolve();
            }
        }).on('error', (e) => {
            console.error(`❌ Network Error ${filename}: ${e.message}`);
            resolve();
        });
    });
}

async function main() {
    console.log('Downloading Verified Official Images from youranimes.tw with Referer...');
    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }
    await Promise.all(mappings.map(m => download(m.id, m.file)));
    console.log('All downloads completed.');
}

main();
