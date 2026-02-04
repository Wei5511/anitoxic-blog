const fs = require('fs');
const axios = require('axios');
const path = require('path');

const url = "https://cdn.myanimelist.net/images/anime/1121/119532.jpg";
const dest = path.join(__dirname, '..', 'public', 'images', 'anime', 'jjk-s3.jpg');

async function download() {
    try {
        const writer = fs.createWriteStream(dest);
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream',
            headers: { 'User-Agent': 'Mozilla/5.0' }
        });
        response.data.pipe(writer);
        return new Promise((resolve, reject) => {
            writer.on('finish', () => resolve());
            writer.on('error', reject);
        });
    } catch (e) {
        console.error('Download failed:', e.message);
    }
}

download().then(() => console.log('Downloaded JJK image'));
