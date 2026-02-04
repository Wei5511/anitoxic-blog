const axios = require('axios');
const fs = require('fs');
const path = require('path');

// Anime News Network Key Visual
const url = 'https://www.animenewsnetwork.com/thumbnails/crop600x315g11/cms/news.6/204597/kizokutensei_kv_fix.jpg';
const dest = path.join(__dirname, '..', 'public', 'images', 'anime', 'noble-reincarnation.jpg');

async function download() {
    try {
        console.log('Downloading Noble Reincarnation cover from ANN...');
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: {
                'User-Agent': 'Mozilla/5.0'
            }
        });
        response.data.pipe(fs.createWriteStream(dest));
        await new Promise(resolve => response.data.on('end', resolve));
        console.log('Download success.');
    } catch (e) {
        console.error('Download failed:', e.message);
    }
}

download();
