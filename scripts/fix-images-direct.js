const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    { name: 'vigilantes.jpg', url: 'https://cdn.myanimelist.net/images/manga/3/200880.jpg' },
    { name: 'sentenced.jpg', url: 'https://cdn.myanimelist.net/images/manga/2/257321.jpg' },
    { name: 'jjk-culling.jpg', url: 'https://cdn.myanimelist.net/images/anime/1792/138022.jpg' },
    { name: 'fire-force-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1527/146836.jpg' },
    { name: 'polar-opposites.jpg', url: 'https://cdn.myanimelist.net/images/manga/2/263720.jpg' },
    // Fire Eater: using a generic placeholder or wiki if available. MAL doesn't have anime visual yet? 
    // Let's use the one from Anitrendz or similar if we can find it, or placeholder.
    { name: 'fire-eater.jpg', url: 'https://cdn.myanimelist.net/images/anime/1070/144985.jpg' }, // Trying a guess or placeholder? No, let's use a safe fallback.
    { name: 'torture-princess.jpg', url: 'https://cdn.myanimelist.net/images/anime/1062/140226.jpg' },
    { name: 'oshi-no-ko-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1979/153329.jpg' },
    { name: 'mf-ghost-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1162/138133.jpg' },
    { name: 'frieren-s2.jpg', url: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg' }
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'anime');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(outputDir, filename);
        const file = fs.createWriteStream(filePath);

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Referer': 'https://myanimelist.net/', // Critical for MAL
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
        };

        https.get(url, options, response => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                if (response.headers.location) {
                    downloadImage(response.headers.location, filename).then(resolve).catch(reject);
                    return;
                }
            }

            if (response.statusCode !== 200) {
                console.error(`❌ Failed ${filename}: Status ${response.statusCode}`);
                // If MAL fails, try fallback placeholder
                if (filename === 'fire-eater.jpg') {
                    // Download a placeholder
                    downloadImage('https://placehold.co/800x450/8B0000/FFF.png?text=Fire+Eater', filename).then(resolve);
                    return;
                }
                resolve();
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${filename} (${response.headers['content-length']} bytes)`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(filePath, () => { });
            console.error(`❌ Error downloading ${filename}: ${err.message}`);
            resolve();
        });
    });
}

async function main() {
    console.log('Direct download from MAL...');
    await Promise.all(images.map(img => downloadImage(img.url, img.name)));
    console.log('Done.');
}

main();
