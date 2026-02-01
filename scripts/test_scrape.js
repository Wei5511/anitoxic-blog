const https = require('https');
const cheerio = require('cheerio');

const url = 'https://youranimes.tw/bangumi/202510';

https.get(url, (res) => {
    let data = '';
    res.on('data', (chunk) => data += chunk);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        const $ = cheerio.load(data);
        const title = $('title').text();
        console.log('Page Title:', title);

        // Check finding articles
        const articles = $('article'); // The 2026 file used 'article' tags
        // If live site uses different structure, we need to find it.
        // In the read_url_content output (markdown), we saw links.
        // Let's print the length of articles found.
        console.log('Articles found:', articles.length);

        if (articles.length === 0) {
            // Try generic selectors if article not found
            console.log('No articles found. Dumping first 500 chars of body:');
            console.log($('body').text().substring(0, 500));
            // Check for list items
            const listItems = $('.anime-list li, .list-item'); // Guessing classes
            console.log('Checking generic classes...');
        } else {
            const firstTitle = articles.first().find('h3 a').text().trim();
            console.log('First Anime Title:', firstTitle);
        }
    });
}).on('error', (e) => {
    console.error(e);
});
