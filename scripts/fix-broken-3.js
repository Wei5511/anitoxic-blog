const fs = require('fs');
const path = require('path');
const https = require('https');

// Fallback to placeholders for the 3 persistent failures to ensure site stability.
const images = [
    { name: 'vigilantes.jpg', url: 'https://placehold.co/600x850/333/FFF/png?text=Vigilantes+Vol.1' },
    { name: 'torture-princess.jpg', url: 'https://placehold.co/600x850/FF69B4/FFF/png?text=Torture+Princess+S2' },
    { name: 'mf-ghost-s3.jpg', url: 'https://placehold.co/600x850/D21F1F/FFF/png?text=MF+Ghost+S3' }
];

const outputDir = path.join(__dirname, '..', 'public', 'images', 'anime');

async function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filePath = path.join(outputDir, filename);
        const file = fs.createWriteStream(filePath);

        https.get(url, response => {
            if (response.statusCode !== 200) {
                console.error(`❌ Failed ${filename}: Status ${response.statusCode}`);
                resolve();
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                console.log(`✅ Generated Placeholder: ${filename}`);
                resolve();
            });
        }).on('error', err => {
            fs.unlink(filePath, () => { });
            console.error(`❌ Error ${filename}: ${err.message}`);
            resolve();
        });
    });
}

async function main() {
    console.log('Generating placeholders for missing assets...');
    await Promise.all(images.map(img => downloadImage(img.url, img.name)));
    console.log('Done.');
}

main();
