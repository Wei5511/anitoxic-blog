const fs = require('fs');
const path = require('path');
const https = require('https');
const db = require('better-sqlite3')('anime.db');

const IMAGE_DIR = path.join(process.cwd(), 'public', 'images', 'anime');
if (!fs.existsSync(IMAGE_DIR)) {
    fs.mkdirSync(IMAGE_DIR, { recursive: true });
}

// Select all anime with Cloudfront images
const rows = db.prepare("SELECT mal_id, title, image_url FROM anime WHERE image_url LIKE '%cloudfront.net%'").all();
console.log(`Found ${rows.length} images to download.`);

async function downloadImage(url, dest) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(dest);
        https.get(url, {
            headers: {
                'Referer': 'https://youranimes.tw/',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
            }
        }, (response) => {
            if (response.statusCode !== 200) {
                reject(new Error(`Status ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(dest, () => { }); // Delete partial file
            reject(err);
        });
    });
}

const updateStmt = db.prepare("UPDATE anime SET image_url = ? WHERE mal_id = ?");

(async () => {
    let successCount = 0;
    let failCount = 0;

    for (const anime of rows) {
        const ext = path.extname(anime.image_url) || '.jpg';
        const filename = `${anime.mal_id}${ext}`;
        const dest = path.join(IMAGE_DIR, filename);
        const localUrl = `/images/anime/${filename}`;

        try {
            if (fs.existsSync(dest)) {
                // console.log(`Skipping existing: ${anime.title}`);
                updateStmt.run(localUrl, anime.mal_id);
                successCount++;
                continue;
            }

            // console.log(`Downloading: ${anime.title}`);
            await downloadImage(anime.image_url, dest);
            updateStmt.run(localUrl, anime.mal_id);
            successCount++;

            // Be nice to the server
            await new Promise(r => setTimeout(r, 50));

        } catch (err) {
            console.error(`Failed ${anime.title}: ${err.message}`);
            failCount++;
        }

        if (successCount % 50 === 0) process.stdout.write('.');
    }

    console.log(`\nDone! Success: ${successCount}, Failed: ${failCount}`);
})();
