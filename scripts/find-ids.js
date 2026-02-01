/**
 * Find MyVideo IDs script
 * Fetches search pages and extracts IDs.
 */

const https = require('https');

const keywords = {
    'oshi-no-ko': '我推的孩子',
    'fire-force': '炎炎消防隊',
    'polar-opposites': '相反的你和我',
    'torture-princess': '公主殿下', // Shortened for better match
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

function fetchId(name) {
    return new Promise((resolve) => {
        const url = `https://www.myvideo.net.tw/search?keyword=${encodeURIComponent(name)}`;
        https.get(url, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                // Look for /details/0/xxxx or /details/3/xxxx
                // Regex to find href="/details/3/12345"
                const match = data.match(/href="\/details\/[0-3]\/(\d+)"/);
                if (match) {
                    resolve(match[1]);
                } else {
                    resolve(null);
                }
            });
        }).on('error', (err) => {
            console.error(err);
            resolve(null);
        });
    });
}

async function main() {
    console.log('🔍 Searching MyVideo IDs...');
    for (const [key, name] of Object.entries(keywords)) {
        const id = await fetchId(name);
        if (id) {
            console.log(`${key}: ${id} (Found for '${name}')`);
        } else {
            console.log(`${key}: NOT FOUND (Searching '${name}')`);
        }
    }
}

main();
