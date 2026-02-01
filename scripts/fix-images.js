const fs = require('fs');
const path = require('path');
const https = require('https');

// Use MAL or reliable sources. wikimedia links from user were 404.
// We use wsrv.nl to proxy and resize/cache, avoiding hotlink blocks.
// KEY FIX: encodeURIComponent on the target URL.
const proxy = (url) => `https://wsrv.nl/?url=${encodeURIComponent(url)}&w=600`;

const images = [
    { name: 'vigilantes.jpg', url: 'https://cdn.myanimelist.net/images/manga/3/200880.jpg' },
    { name: 'sentenced.jpg', url: 'https://cdn.myanimelist.net/images/manga/2/257321.jpg' },
    { name: 'jjk-culling.jpg', url: 'https://cdn.myanimelist.net/images/anime/1792/138022.jpg' },
    { name: 'fire-force-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1527/146836.jpg' },
    { name: 'polar-opposites.jpg', url: 'https://cdn.myanimelist.net/images/manga/2/263720.jpg' },
    { name: 'fire-eater.jpg', url: 'https://m.media-amazon.com/images/I/51A+5Z3Q3LL.jpg' }, // Amazon often allows
    { name: 'torture-princess.jpg', url: 'https://cdn.myanimelist.net/images/anime/1062/140226.jpg' },
    { name: 'oshi-no-ko-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1979/153329.jpg' },
    { name: 'mf-ghost-s3.jpg', url: 'https://cdn.myanimelist.net/images/anime/1162/138133.jpg' },
    { name: 'frieren-s2.jpg', url: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg' }
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'anime');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

async function downloadImage(sourceUrl, filename) {
    // If sourceUrl is already a proxy or safe, use it. Otherwise proxy it.
    // Amazon links usually need no proxy? let's proxy everything to be safe/consistent if wsrv supports it.
    // Actually Amazon might block wsrv. let's try direct for Amazon if we can, or correct header.
    // For now, try encoded proxy for ALL.
    const targetUrl = proxy(sourceUrl);

    return new Promise((resolve, reject) => {
        const filePath = path.join(outputDir, filename);
        const file = fs.createWriteStream(filePath);

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        };

        https.get(targetUrl, options, response => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                if (response.headers.location) {
                    // Start over with new location? 
                    // wsrv usually handles redirects internally. If wsrv redirects, we follow.
                    // But we used a constructed URL.
                    resolve(); // Simple ignore for now to avoid endless loop in this simple script
                    return;
                }
            }

            if (response.statusCode !== 200) {
                console.error(`❌ Failed ${filename}: Status ${response.statusCode}`);
                // Try fallback: Direct download if proxy failed?
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
    console.log('Fixing images (encoded proxy)...');
    await Promise.all(images.map(img => downloadImage(img.url, img.name)));
    console.log('Done.');
}

main();
