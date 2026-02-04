const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
};

async function main() {
    try {
        console.log('Downloading via axios...');
        const url = 'https://ani.gamer.com.tw/animeRef.php?sn=113693'; // Fate
        const res = await axios.get(url, { headers: HEADERS });
        const html = res.data;
        console.log('Downloaded size:', html.length);

        const $ = cheerio.load(html);
        console.log('H1:', $('h1').text().trim());

        const intro = $('.data_intro');
        console.log('.data_intro exists?', intro.length > 0);
        console.log('.data_intro text:', intro.text().substring(0, 100));

        // Find block with lot of text
        $('div, p').each((i, el) => {
            const txt = $(el).text().trim();
            // Filter out scripts/styles by checking tags mostly
            if (txt.length > 50 && txt.length < 1000) {
                // Clean newlines
                const clean = txt.replace(/\s+/g, ' ');
                if (clean.includes('冬木市') || clean.includes('聖杯')) {
                    console.log(`MATCH [${$(el).prop('tagName')} class="${$(el).attr('class')}"]: ${clean.substring(0, 50)}...`);
                }
            }
        });
    } catch (e) {
        console.error(e);
    }
}

main();
