const axios = require('axios');
const fs = require('fs');
const path = require('path');
const cheerio = require('cheerio');

const queries = [
    { key: 'jjk', term: '咒術迴戰 死滅迴游' },
    { key: 'party-outcast', term: '泛而不精' },
    { key: 'noble-reincarnation', term: '貴族轉生' },
    { key: 'frieren', term: '葬送的芙莉蓮' }, // S2 usually grouped with main or has new ID
    { key: 'oshi-no-ko', term: '我推的孩子' }
];

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
};

async function searchAndScrape() {
    const results = {};

    for (const q of queries) {
        try {
            const searchUrl = `https://www.myvideo.net.tw/search/${encodeURIComponent(q.term)}`;
            console.log(`Searching for ${q.term}...`);
            const { data } = await axios.get(searchUrl, { headers });
            const $ = cheerio.load(data);

            // Find first result in search list
            // Grid items usually in .movie-list or similar. Need to guess selector or generic 'a[href*="/details/"]'
            // MyVideo search structure: .search_result_list > li > a

            let item = null;
            $('ul.search_result_list li a').each((i, el) => {
                const href = $(el).attr('href');
                if (!item && href && href.includes('/details/')) {
                    const img = $(el).find('img').attr('dataset-src') || $(el).find('img').attr('src');
                    item = { href: `https://www.myvideo.net.tw${href}`, img };
                }
            });

            // Fallback if structure different
            if (!item) {
                $('div.movie-list a').each((i, el) => {
                    const href = $(el).attr('href');
                    if (!item && href && href.includes('/details/')) {
                        const img = $(el).find('img').attr('data-src') || $(el).find('img').attr('src');
                        item = { href: `https://www.myvideo.net.tw${href}`, img };
                    }
                });
            }

            if (item) {
                console.log(`  Found: ${item.href}`);
                // Download image
                const ext = path.extname(item.img.split('?')[0]) || '.jpg';
                const filename = `${q.key}${ext}`;
                const dest = path.join(__dirname, '..', 'public', 'images', 'anime', filename);

                try {
                    const imgResp = await axios({
                        url: item.img,
                        method: 'GET',
                        responseType: 'stream',
                        headers
                    });
                    imgResp.data.pipe(fs.createWriteStream(dest));
                    item.localImg = `/images/anime/${filename}`;
                    console.log(`  Downloaded image to ${dest}`);
                } catch (e) {
                    console.error('  Image download failed:', e.message);
                }

                results[q.key] = item;
            } else {
                console.log('  No results found.');
            }

        } catch (e) {
            console.error(`Error searching ${q.term}:`, e.message);
        }
    }

    // Save results to file to be read by next step
    fs.writeFileSync('myvideo_data.json', JSON.stringify(results, null, 2));
}

searchAndScrape();
