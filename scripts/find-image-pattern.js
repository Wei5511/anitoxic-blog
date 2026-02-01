const https = require('https');

const id = '5923';
const patterns = [
    `https://youranimes.tw/images/animes/${id}.jpg`,
    `https://youranimes.tw/images/anime/${id}.jpg`,
    `https://youranimes.tw/img/animes/${id}.jpg`,
    `https://youranimes.tw/upload/animes/${id}.jpg`,
    `https://youranimes.tw/uploads/animes/${id}.jpg`,
    `https://youranimes.tw/storage/animes/${id}.jpg`,
    `https://youranimes.tw/assets/animes/${id}.jpg`,
    `https://youranimes.tw/animes/${id}/cover.jpg`,
    `https://youranimes.tw/bangumi/202601` // Control: Check if we can even reach the site
];

function check(url) {
    return new Promise(resolve => {
        const req = https.request(url, { method: 'HEAD', headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
            console.log(`${res.statusCode} - ${url}`);
            resolve();
        });
        req.on('error', e => {
            console.log(`ERR - ${url}: ${e.message}`);
            resolve();
        });
        req.end();
    });
}

async function main() {
    console.log('Testing patterns...');
    for (const p of patterns) {
        await check(p);
    }
}

main();
