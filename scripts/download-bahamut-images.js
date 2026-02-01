/**
 * Download Anime Images from Bahamut (ani.gamer.com.tw)
 * Using their API to get anime info and cover images
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');

// Anime list with Bahamut SNI IDs (from ani.gamer.com.tw)
const animeList = [
    { sn: '39742', filename: 'frieren-s2.jpg', name: '葬送的芙莉蓮 第二季' },
    { sn: '37761', filename: 'jjk-culling.jpg', name: '咒術迴戰 死滅迴游' },
    { sn: '38544', filename: 'oshi-no-ko-s3.jpg', name: '我推的孩子 第三季' },
    { sn: '38941', filename: 'fire-force-s3.jpg', name: '炎炎消防隊 參之章' },
    { sn: '39505', filename: 'polar-opposites.jpg', name: '相反的你和我' },
    { sn: '39506', filename: 'torture-princess.jpg', name: '公主殿下拷問時間 第二季' },
    { sn: '39851', filename: 'medalist.jpg', name: '金牌得主' },
    { sn: '38942', filename: 'mf-ghost-s3.jpg', name: 'MF Ghost 第三季' },
    { sn: '39286', filename: 'vigilantes.jpg', name: '正義使者 第二季' },
    { sn: '39850', filename: 'sentenced.jpg', name: '勇者刑處刑' },
    { sn: '39849', filename: 'hidden-gems.jpg', name: '達爾文事變' },
    { sn: '39508', filename: 'dark-fantasy-rec.jpg', name: '地獄樂 第二季' }
];

async function downloadImage(url, filepath) {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(filepath);
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://ani.gamer.com.tw/'
            }
        }, (response) => {
            if (response.statusCode === 301 || response.statusCode === 302) {
                // Follow redirect
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
        }).on('error', reject);
    });
}

async function fetchAnimeInfo(sn) {
    return new Promise((resolve, reject) => {
        const url = `https://ani.gamer.com.tw/animeRef.php?sn=${sn}`;
        https.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        }, (response) => {
            let data = '';
            response.on('data', chunk => data += chunk);
            response.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    resolve(json);
                } catch (e) {
                    // Try to extract image from HTML
                    resolve(null);
                }
            });
        }).on('error', reject);
    });
}

async function main() {
    console.log('🖼️ Downloading anime images from Bahamut...');

    if (!fs.existsSync(imageDir)) {
        fs.mkdirSync(imageDir, { recursive: true });
    }

    for (const anime of animeList) {
        const filepath = path.join(imageDir, anime.filename);

        // Use Bahamut's cover image URL pattern
        const coverUrl = `https://p2.bahamut.com.tw/B/ACG/c/97/0000${anime.sn}.JPG`;

        try {
            console.log(`📥 Downloading: ${anime.name}...`);
            await downloadImage(coverUrl, filepath);

            const stats = fs.statSync(filepath);
            if (stats.size > 1000) {
                console.log(`✅ ${anime.filename} (${Math.round(stats.size / 1024)}KB)`);
            } else {
                console.log(`⚠️ ${anime.filename} may be invalid (${stats.size} bytes)`);
            }
        } catch (err) {
            console.log(`❌ Failed: ${anime.name} - ${err.message}`);
        }

        // Rate limiting
        await new Promise(r => setTimeout(r, 500));
    }

    console.log('\n✅ Image download complete!');
}

main();
