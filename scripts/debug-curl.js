const https = require('https');

const url = "https://www.myvideo.net.tw/search?keyword=Frieren";

https.get(url, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => {
        console.log(data.slice(0, 5000)); // Print first 5000 chars to see structure
    });
}).on('error', err => console.log(err));
