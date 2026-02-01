/**
 * Find MyVideo IDs script V2 - With Headers
 */

const https = require('https');

const keywords = {
    'oshi-no-ko': '我推的孩子',
    'fire-force': '炎炎消防隊',
    'polar-opposites': '相反的你和我',
    'torture-princess': '公主殿下',
    'medalist': '金牌得主',
    'mf-ghost': '燃油車鬥魂',
    'vigilantes': '正義使者',
    'sentenced': '勇者刑',
    'darwin': '達爾文事變',
    'hells-paradise': '地獄樂',
    'jojo-sbr': 'JOJO',
    'nube': '靈異教師神眉',
    'hanakimi': '花樣少年少女'
};

const options = {
    headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
    }
};

function fetchId(name) {
    return new Promise((resolve) => {
        const url = `https://www.myvideo.net.tw/search?keyword=${encodeURIComponent(name)}`;
        https.get(url, options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // Regex for /details/3/12345 or /player/3/12345
                // Common pattern on MyVideo search results: <a href="/details/3/123456" ...>
                const match = data.match(/"\/details\/[0-3]\/(\d+)"/);
                if (match) {
                    resolve(match[1]);
                } else {
                    // Try player link
                    const matchPlayer = data.match(/"\/player\/[0-3]\/(\d+)"/);
                    if (matchPlayer) resolve(matchPlayer[1]);
                    else resolve(null);
                }
            });
        }).on('error', (err) => {
            console.error(err);
            resolve(null);
        });
    });
}

async function main() {
    console.log('🔍 Searching MyVideo IDs (V2)...');
    for (const [key, name] of Object.entries(keywords)) {
        const id = await fetchId(name);
        if (id) {
            console.log(`${key}: ${id}`);
        } else {
            console.log(`${key}: NOT FOUND`);
        }
    }
}

main();
