const https = require('https');

const url = 'https://youranimes.tw/bangumi/201001';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36';

console.log(`Fetching ${url}...`);

const options = {
    headers: {
        'User-Agent': USER_AGENT,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'zh-TW,zh;q=0.9,en;q=0.8'
    }
};

https.get(url, options, (res) => {
    console.log(`Status Code: ${res.statusCode}`);
    console.log(`Headers:`, res.headers);

    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(`\nResponse length: ${data.length}`);
        console.log(`First 500 chars:\n${data.substring(0, 500)}`);

        const linkRegex = /animes\/(\d+)/g;
        const matches = [...data.matchAll(linkRegex)];
        console.log(`\nMatches found: ${matches.length}`);
        if (matches.length > 0) {
            console.log('Sample match:', matches[0][0]);
            const index = matches[0].index;
            console.log('Context:', data.substring(index - 50, index + 50));
        }
    });
}).on('error', (e) => {
    console.error('Error:', e);
});
