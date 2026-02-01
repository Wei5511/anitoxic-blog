const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    { name: 'sakamoto.jpg', url: 'https://i0.wp.com/anitrendz_net/news/wp-content/uploads/2024/05/Sakamoto-Days-Anime-Key-Visual.jpg' },
    { name: 'solo-leveling-s2.jpg', url: 'https://i0.wp.com/anitrendz_net/news/wp-content/uploads/2024/03/Solo-Leveling-Season-2-Arise-from-the-Shadow-Teaser-Visual.jpg' },
    { name: 'uniteup-s2.jpg', url: 'https://anitrendz.net/news/wp-content/uploads/2024/09/Unite-Up-UniBirth-Key-Visual.jpg' },
    { name: 'honey-lemon.jpg', url: 'https://i0.wp.com/anitrendz_net/news/wp-content/uploads/2024/08/Honey-Lemon-Soda-Anime-Teaser-Visual-1.jpg' },
    { name: 'farmagia.jpg', url: 'https://i0.wp.com/anitrendz_net/news/wp-content/uploads/2024/11/Farmagia-Anime-Main-Visual.jpg' }
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'anime');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(outputDir, filename);
        // Use a temp file to avoid corrupting partial downloads
        const file = fs.createWriteStream(filePath);

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': 'https://myanimelist.net/' // Helps with MAL CDN
            }
        };

        const request = https.get(url, options, response => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                if (response.headers.location) {
                    downloadImage(response.headers.location, filename).then(resolve).catch(reject);
                    return;
                }
            }

            if (response.statusCode !== 200) {
                reject(new Error(`Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Downloaded: ${filename}`);
                resolve();
            });
        });

        request.on('error', err => {
            fs.unlink(filePath, () => { });
            console.error(`❌ Error downloading ${filename}: ${err.message}`);
            resolve(); // Don't crash main loop
        });
    });
}

async function main() {
    console.log('Downloading new assets...');
    await Promise.all(images.map(img => downloadImage(img.url, img.name)));
    console.log('Done.');
}

main();
