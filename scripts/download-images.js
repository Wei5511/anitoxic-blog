const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    { name: 'frieren-s2.jpg', url: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg' },
    { name: 'jjk-culling.jpg', url: 'https://cdn.myanimelist.net/images/anime/1792/138022.jpg' },
    { name: 'oshi-no-ko-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1979/153329l.jpg' },
    { name: 'fate-strange-fake.jpg', url: 'https://cdn.myanimelist.net/images/anime/1752/150192l.jpg' },
    { name: 'fire-force-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1527/146836l.jpg' },
    { name: 'sentenced-hero.jpg', url: 'https://cdn.myanimelist.net/images/anime/1062/151911l.jpg' },
    { name: 'polar-opposites.jpg', url: 'https://cdn.myanimelist.net/images/anime/1140/154457l.jpg' },
    { name: 'executioner.jpg', url: 'https://cdn.myanimelist.net/images/anime/1423/122029l.jpg' }
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
                'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
                'Referer': 'https://myanimelist.net/'
            }
        };

        https.get(url, options, response => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Simple redirect follow if strictly needed, usually MAL doesn't
                if (response.headers.location) {
                    downloadImage(response.headers.location, filename).then(resolve).catch(reject);
                    return;
                }
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Failed to consume '${url}' status: ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${filename}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(filePath, () => { });
            console.error(`❌ Error downloading ${filename}: ${err.message}`);
            reject(err);
        });
    });
}

async function main() {
    console.log('Starting image downloads...');
    for (const img of images) {
        try {
            await downloadImage(img.url, img.name);
        } catch (error) {
            console.error(`Failed to download ${img.name}: ${error.message}`);
        }
    }
    console.log('All downloads processed.');
}

main();
