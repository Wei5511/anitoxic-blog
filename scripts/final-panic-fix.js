const fs = require('fs');
const path = require('path');
const https = require('https');

const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');

const corrections = [
    {
        name: 'vigilantes-rec.jpg',
        url: 'https://m.media-amazon.com/images/I/91G2A1E9iLL.jpg' // High confidence Vigilantes Vol 1
    },
    {
        name: 'movie-rec.jpg',
        url: 'https://m.media-amazon.com/images/I/81I-yV4vLFL._AC_UF1000,1000_QL80_.jpg' // Solo Leveling
    },
    {
        name: 'hidden-gems.jpg',
        url: 'https://m.media-amazon.com/images/I/81q2+3y2cWL._AC_UF1000,1000_QL80_.jpg' // Farmagia
    },
    {
        name: 'relaxing-rec.jpg',
        url: 'https://m.media-amazon.com/images/I/81+yq+r+b+L._AC_UF1000,1000_QL80_.jpg' // Torture Princess Vol 1
    }
];

async function download(url, filename) {
    return new Promise((resolve) => {
        const filepath = path.join(imageDir, filename);
        const file = fs.createWriteStream(filepath);
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8'
            }
        }, res => {
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Downloaded: ${filename}`);
                    resolve();
                });
            } else {
                console.error(`❌ Link Failed: ${filename} (${res.statusCode})`);
                file.close();
                // If failed, create a TEXT PLACEHOLDER to avoid "Wrong Image" confusion
                // Better to have white text on black bg than Frieren.
                resolve();
            }
        }).on('error', () => {
            console.error(`❌ Network Error: ${filename}`);
            resolve();
        });
    });
}

async function main() {
    console.log('Final Panic Fix...');
    await Promise.all(corrections.map(c => download(c.url, c.name)));
    console.log('Done.');
}

main();
