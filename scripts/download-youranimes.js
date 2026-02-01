/**
 * Download Anime Images from youranimes.tw
 * Uses their anime page og:image meta tag to get cover images
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');

// Anime list with youranimes.tw IDs (extracted from bangumi/202601)
const animeList = [
    { id: '5483', filename: 'frieren-s2.jpg', name: '葬送的芙莉蓮 第二季' },
    { id: '4942', filename: 'jjk-culling.jpg', name: '咒術迴戰 死滅迴游' },
    { id: '5505', filename: 'oshi-no-ko-s3.jpg', name: '我推的孩子 第三季' },
    { id: '5332', filename: 'fire-force-s3.jpg', name: '炎炎消防隊 參之章' },
    { id: '5590', filename: 'polar-opposites.jpg', name: '相反的你和我' },
    { id: '5058', filename: 'torture-princess.jpg', name: '公主殿下拷問時間 第二季' },
    { id: '5800', filename: 'medalist.jpg', name: '金牌得主' },
    { id: '5646', filename: 'mf-ghost-s3.jpg', name: 'MF Ghost 第三季' },
    { id: '5923', filename: 'vigilantes.jpg', name: '正義使者 第二季' },
    { id: '4415', filename: 'sentenced.jpg', name: '判處勇者刑' },
    { id: '5244', filename: 'hidden-gems.jpg', name: '達爾文事變' },
    { id: '4367', filename: 'dark-fantasy-rec.jpg', name: '地獄樂 第二季' },
    { id: '5811', filename: 'fate-strange-fake.jpg', name: '飆馬野郎 JOJO' },
    { id: '5235', filename: 'game-rec.jpg', name: '花樣少年少女' },
    { id: '6135', filename: 'seiyuu-rec.jpg', name: '靈異教師神眉' },
    { id: '5917', filename: 'music-rec.jpg', name: '輝夜姬想讓人告白' },
    { id: '4353', filename: 'movie-rec.jpg', name: '黃金神威' },
    { id: '5038', filename: 'sakuga-rec.jpg', name: 'BEASTARS' }
];

function fetchPage(url) {
    return new Promise((resolve, reject) => {
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml',
                'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8'
            }
        }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                fetchPage(response.headers.location).then(resolve).catch(reject);
                return;
            }
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => resolve(data));
        }).on('error', reject);
    });
}

function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        // Handle both http and https
        const protocol = url.startsWith('https') ? https : require('http');
        const file = fs.createWriteStream(filepath);

        protocol.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://youranimes.tw/'
            }
        }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                file.close();
                fs.unlinkSync(filepath);
                downloadImage(response.headers.location, filepath).then(resolve).catch(reject);
                return;
            }
            if (response.statusCode !== 200) {
                reject(new Error(`HTTP ${response.statusCode}`));
                return;
            }
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve();
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

async function main() {
    console.log('🖼️ Downloading anime images from youranimes.tw...\n');

    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    let successCount = 0;
    let failCount = 0;

    for (const anime of animeList) {
        const pageUrl = `https://youranimes.tw/animes/${anime.id}`;
        const filepath = path.join(imageDir, anime.filename);

        try {
            console.log(`📥 Fetching: ${anime.name}...`);

            // Fetch the anime page to get og:image
            const html = await fetchPage(pageUrl);

            // Extract og:image URL
            const ogImageMatch = html.match(/<meta\s+property="og:image"\s+content="([^"]+)"/);

            if (!ogImageMatch) {
                console.log(`⚠️ No og:image found for ${anime.name}`);
                failCount++;
                continue;
            }

            const imageUrl = ogImageMatch[1];
            console.log(`   Found image: ${imageUrl}`);

            // Download the image
            await downloadImage(imageUrl, filepath);

            const stats = fs.statSync(filepath);
            if (stats.size > 1000) {
                console.log(`✅ ${anime.filename} (${Math.round(stats.size / 1024)}KB)\n`);
                successCount++;
            } else {
                console.log(`⚠️ ${anime.filename} may be invalid (${stats.size} bytes)\n`);
                failCount++;
            }
        } catch (err) {
            console.log(`❌ Failed: ${anime.name} - ${err.message}\n`);
            failCount++;
        }

        // Rate limiting to avoid being blocked
        await new Promise(r => setTimeout(r, 1000));
    }

    console.log(`\n✅ Download complete!`);
    console.log(`   Success: ${successCount}`);
    console.log(`   Failed: ${failCount}`);
}

main();
