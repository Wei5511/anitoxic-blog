const axios = require('axios');
const cheerio = require('cheerio');

const HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
    'Accept-Language': 'zh-TW,zh;q=0.9,en-US;q=0.8,en;q=0.7'
};

async function test() {
    console.log('Testing scraper for "Fate/strange Fake"...');
    const url = `https://ani.gamer.com.tw/search.php?keyword=${encodeURIComponent('Fate/strange Fake')}`;
    const res = await axios.get(url, { headers: HEADERS });
    const $ = cheerio.load(res.data);

    // Debug: print all links in .anime_list
    $('.anime-card-list a').each((i, el) => {
        console.log(`Link ${i}:`, $(el).attr('href'), $(el).text().trim());
    });

    // Try varied selectors for LINK
    let firstLink = $('.anime-card-list .theme-list-main').attr('href');
    if (!firstLink) firstLink = $('.anime_list a.theme-list-main').attr('href');
    if (!firstLink) firstLink = $('a.theme-list-main').attr('href');
    if (!firstLink) firstLink = $('a.theme-list-img').attr('href');

    console.log('Detected Link:', firstLink);

    if (firstLink) {
        const detailUrl = `https://ani.gamer.com.tw/${firstLink}`;
        console.log('Fetching detail:', detailUrl);
        const detailRes = await axios.get(detailUrl, { headers: HEADERS });
        const $d = cheerio.load(detailRes.data);

        console.log('--- DETAIL PAGE DEBUG ---');
        console.log('H1 Text:', $d('h1').text().trim());
        console.log('H1 Class:', $d('h1').attr('class'));

        const syn1 = $d('.data_intro').text().trim();
        const syn2 = $d('.anime_intro').text().trim();
        const syn3 = $d('p').text().substring(0, 100);

        console.log('Syn (data_intro):', syn1.substring(0, 50));
        console.log('Syn (anime_intro):', syn2.substring(0, 50));
        console.log('P Text Sample:', syn3);

    } else {
        console.log('Scraper FAILED to find link.');
    }
}

test();
