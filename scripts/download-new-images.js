const axios = require('axios');
const fs = require('fs');
const path = require('path');

const targets = [
    {
        name: 'party-outcast.jpg',
        url: 'https://ogre.natalie.mu/media/news/comic/2025/1029/kiyoubinbou_kv.jpg' // Reliable from search (Natalie often hosts clean KVs)
    },
    {
        name: 'noble-reincarnation.jpg',
        url: 'https://img1.ak.crunchyroll.com/i/spire4/c4ab12e1762c2627993355047f382a891727763784_main_wide.jpg' // Crunchyroll KV
    }
];

async function download() {
    for (const t of targets) {
        const dest = path.join(__dirname, '..', 'public', 'images', 'anime', t.name);
        console.log(`Downloading ${t.name} from ${t.url}...`);
        try {
            const response = await axios({
                url: t.url,
                method: 'GET',
                responseType: 'stream',
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)',
                    'Referer': 'https://www.google.com/'
                }
            });
            response.data.pipe(fs.createWriteStream(dest));
            await new Promise(resolve => response.data.on('end', resolve));
            console.log(`Success: ${dest}`);
        } catch (e) {
            console.error(`Failed ${t.name}:`, e.message);
        }
    }
}

download();
