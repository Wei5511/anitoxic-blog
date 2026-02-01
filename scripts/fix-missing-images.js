const fs = require('fs');
const path = require('path');
const https = require('https');

// Use Wikipedia/reliable sources for the missing ones.
const images = [
    { name: 'vigilantes.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/e/ed/My_Hero_Academia_Vigilantes_volume_1_cover.jpg' },
    { name: 'torture-princess.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/0/07/Tis_Time_for_Torture_Princess_volume_1_cover.jpg' },
    { name: 'mf-ghost-s3.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/a/a2/MF_Ghost_volume_1_cover.jpg' }
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'anime');

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(outputDir, filename);
        const file = fs.createWriteStream(filePath);

        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                // Wikipedia usually doesn't check Referer strictly for images, but let's be safe
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
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
    console.log('Downloading missing images from Wikipedia...');
    await Promise.all(images.map(img => downloadImage(img.url, img.name)));
    console.log('Done.');
}

main();
