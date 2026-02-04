const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const targets = [
    { key: 'jjk-s3', url: 'https://en.wikipedia.org/wiki/Jujutsu_Kaisen' },
    { key: 'noble-reincarnation', url: 'https://en.wikipedia.org/wiki/Noble_Reincarnation' }
];

async function run() {
    for (const t of targets) {
        try {
            console.log(`Fetching ${t.url}...`);
            const { data } = await axios.get(t.url);
            const $ = cheerio.load(data);

            // Infobox image
            let src = $('.infobox img').first().attr('src');
            if (src) {
                if (src.startsWith('//')) src = 'https:' + src;
                console.log(`  Found image: ${src}`);

                // Download
                const dest = path.join(__dirname, '..', 'public', 'images', 'anime', `${t.key}.jpg`);
                const writer = fs.createWriteStream(dest);
                const resp = await axios({
                    url: src,
                    method: 'GET',
                    responseType: 'stream',
                    headers: { 'User-Agent': 'Mozilla/5.0' }
                });
                resp.data.pipe(writer);
                await new Promise(resolve => writer.on('finish', resolve));
                console.log(`  Downloaded to ${dest}`);
            } else {
                console.log('  No image found.');
            }
        } catch (e) {
            console.error(`Error processing ${t.key}:`, e.message);
        }
    }
}

run();
