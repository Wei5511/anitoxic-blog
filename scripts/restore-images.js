const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    { name: 'vigilantes.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/e/ed/My_Hero_Academia_Vigilantes_volume_1_cover.jpg' },
    { name: 'sentenced.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/5/53/Sentenced_to_Be_a_Hero_light_novel_volume_1_cover.jpg' },
    { name: 'jjk-culling.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/4/46/Jujutsu_Kaisen_key_visual.jpg' },
    { name: 'fire-force-s3.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/e/e1/Fire_Force_volume_1_cover.jpg' },
    { name: 'polar-opposites.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/d/d3/You_and_I_Are_Polar_Opposites_volume_1_cover.jpg' },
    { name: 'fire-eater.jpg', url: 'https://placehold.co/800x450/8B0000/FFF.png?text=Fire+Eater' },
    { name: 'torture-princess.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/0/07/Tis_Time_for_Torture_Princess_volume_1_cover.jpg' },
    { name: 'oshi-no-ko-s3.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/7/7b/Oshi_no_Ko_volume_1_cover.jpg' },
    { name: 'mf-ghost-s3.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/a/a2/MF_Ghost_volume_1_cover.jpg' },
    { name: 'frieren-s2.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/d/de/Frieren_volume_1_cover.jpg' }
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
                console.error(`❌ Failed ${filename}: Status ${response.statusCode}`);
                resolve(); // Skip but resolve
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
    console.log('Restoring local images...');
    await Promise.all(images.map(img => downloadImage(img.url, img.name)));
    console.log('Done.');
}

main();
