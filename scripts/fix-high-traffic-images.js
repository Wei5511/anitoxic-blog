const fs = require('fs');
const path = require('path');
const https = require('https');

const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');

// Fallback mapping for failed downloads.
// We use known working URLs or reliable placeholders if specific ones fail.
const imagesToFix = [
    // Top 10 Winter -> Reuse Frieren S2 (It works) or JJK
    { name: 'top-10-winter.jpg', url: 'https://cdn.myanimelist.net/images/anime/1015/138006.jpg' },
    // Dark Fantasy -> Reuse JJK (It works)
    { name: 'dark-fantasy-rec.jpg', url: 'https://cdn.myanimelist.net/images/anime/1792/138022.jpg' },
    // Relaxing -> Reuse Torture Princess (It works now per last check? or generic)
    { name: 'relaxing-rec.jpg', url: 'https://cdn.myanimelist.net/images/anime/1062/140226.jpg' },
    // Hidden Gems -> Farmagia visual? Or generic.
    { name: 'hidden-gems.jpg', url: 'https://cdn.myanimelist.net/images/anime/1878/145464.jpg' }, // Farmagia MAL valid? if not, use placeholder.
    // Seiyuu -> Use a different one. E.g. Blue Box or something popular. Or Oshi no Ko.
    { name: 'seiyuu-rec.jpg', url: 'https://cdn.myanimelist.net/images/anime/1979/153329.jpg' },
    // Vigilantes Rec -> Use the Manga Volume 1 (Wiki source)
    { name: 'vigilantes-rec.jpg', url: 'https://upload.wikimedia.org/wikipedia/en/e/ed/My_Hero_Academia_Vigilantes_volume_1_cover.jpg' },
    // Movie Rec -> Solo Leveling S2 (Arise)
    { name: 'movie-rec.jpg', url: 'https://cdn.myanimelist.net/images/anime/1264/142928.jpg' }
];

async function downloadImage(url, filename) {
    return new Promise((resolve) => {
        const filePath = path.join(imageDir, filename);
        const file = fs.createWriteStream(filePath);
        const options = {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                // Wikipedia needs clear UA. MAL needs Referer.
                'Referer': 'https://myanimelist.net/',
                'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8'
            }
        };

        https.get(url, options, res => {
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    console.log(`✅ Fixed Image: ${filename}`);
                    resolve();
                });
            } else {
                console.error(`❌ Retry Failed ${filename}: ${res.statusCode}`);
                // Final Fallback: Generate Placeholder if real image fails again
                const placeholderUrl = `https://placehold.co/800x450/333/FFF.png?text=${filename.split('.')[0]}`;
                https.get(placeholderUrl, res2 => {
                    res2.pipe(file);
                    console.log(`⚠️ Used Placeholder for: ${filename}`);
                    resolve();
                });
            }
        }).on('error', () => resolve());
    });
}

async function main() {
    console.log('Fixing High Traffic Content Images...');
    await Promise.all(imagesToFix.map(img => downloadImage(img.url, img.name)));
    console.log('Done.');
}

main();
