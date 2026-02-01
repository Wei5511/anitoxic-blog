const fs = require('fs');
const path = require('path');
const https = require('https');

const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');

const targets = [
    {
        filename: 'vigilantes.jpg', // Replace the 10KB placeholder
        mirrors: [
            'https://m.media-amazon.com/images/I/91t6+c+2C+L.jpg', // Amazon is usually safe
            'https://upload.wikimedia.org/wikipedia/en/e/ed/My_Hero_Academia_Vigilantes_volume_1_cover.jpg',
            'https://cdn.myanimelist.net/images/manga/3/200880.jpg'
        ]
    },
    {
        filename: 'vigilantes-rec.jpg', // Keep consistent
        mirrors: [
            'https://m.media-amazon.com/images/I/91t6+c+2C+L.jpg',
            'https://upload.wikimedia.org/wikipedia/en/e/ed/My_Hero_Academia_Vigilantes_volume_1_cover.jpg'
        ]
    },
    {
        filename: 'hidden-gems.jpg', // Farmagia
        mirrors: [
            'https://cdn.myanimelist.net/images/anime/1878/145464.jpg',
            'https://m.media-amazon.com/images/M/MV5BN2YyNjYxMjEtM2YxYi00M2YxLWJlZjItM2I3NzQ0Y2IyMzVlXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg' // Generic fallback? No, let's try direct.
        ]
    },
    {
        filename: 'movie-rec.jpg', // Solo Leveling S2
        mirrors: [
            'https://m.media-amazon.com/images/M/MV5BMzVkMzA1ODItMzY3Ny00NDYwLWJhZDYtODk4MTVhYWYzMzY2XkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg', // IMDB Solo Leveling
            'https://cdn.myanimelist.net/images/anime/1264/142928.jpg'
        ]
    },
    {
        filename: 'relaxing-rec.jpg', // Torture Princess
        mirrors: [
            'https://m.media-amazon.com/images/M/MV5BNzQzMzdhZDQtZDYxYi00MDQ0LWJlZjItM2I3NzQ0Y2IyMzVlXkEyXkFqcGdeQXVyMzgxODM4NjM@._V1_FMjpg_UX1000_.jpg',
            'https://cdn.myanimelist.net/images/anime/1062/140226.jpg'
        ]
    }
];

// Helper to download
function download(url, filepath) {
    return new Promise((resolve) => {
        const file = fs.createWriteStream(filepath);
        const request = https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                'Referer': 'https://myanimelist.net/'
            }
        }, (res) => {
            if (res.statusCode === 200) {
                res.pipe(file);
                file.on('finish', () => {
                    file.close();
                    // Check size. if < 2KB, likely an error page/pixel
                    const stats = fs.statSync(filepath);
                    if (stats.size < 2000) {
                        resolve(false);
                    } else {
                        console.log(`✅ Success: ${path.basename(filepath)} from ${url} (${stats.size} bytes)`);
                        resolve(true);
                    }
                });
            } else {
                file.close();
                fs.unlink(filepath, () => { });
                resolve(false);
            }
        });
        request.on('error', () => {
            fs.unlink(filepath, () => { });
            resolve(false);
        });
    });
}

async function main() {
    console.log('Final Image Rescue...');
    for (const target of targets) {
        let success = false;
        const filepath = path.join(imageDir, target.filename);

        for (const mirror of target.mirrors) {
            console.log(`Trying ${target.filename} via ${mirror}...`);
            success = await download(mirror, filepath);
            if (success) break;
        }

        if (!success) {
            console.error(`❌ ALL MIRRORS FAILED for ${target.filename}. Using Local Copy of Frieren as last resort.`);
            // Copy frieren-s2.jpg to target
            try {
                fs.copyFileSync(path.join(imageDir, 'frieren-s2.jpg'), filepath);
                console.log(`⚠️ Used Frieren fallback for ${target.filename}`);
            } catch (e) {
                console.error('Even fallback failed');
            }
        }
    }
}

main();
