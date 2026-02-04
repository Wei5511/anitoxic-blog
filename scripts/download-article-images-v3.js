const fs = require('fs');
const axios = require('axios');
const path = require('path');

const images = [
    { url: "https://i.pinimg.com/736x/21/df/b8/21dfb8584852ab11812822aefc842188.jpg", name: "jjk-s3.jpg" },
    { url: "https://img1.ak.crunchyroll.com/i/spire4/c4ab12e1762c2627993355047f382a891727763784_main_wide.jpg", name: "party-outcast.jpg" },
    { url: "https://www.animenewsnetwork.com/thumbnails/crop600x315g11/cms/news.6/204597/kizokutensei_kv_fix.jpg", name: "noble-reincarnation.jpg" }
];

async function download(url, filename) {
    if (!url) return;
    const dest = path.join(__dirname, '..', 'public', 'images', 'anime', filename);
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
            writer.on('finish', () => { console.log(`Downloaded ${filename}`); resolve(); });
            writer.on('error', reject);
        });
    } catch (e) {
        console.error(`Failed ${filename}:`, e.message);
    }
}

(async () => {
    for (const img of images) {
        await download(img.url, img.name);
    }
})();
