const https = require('https');

const urls = [
    'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx178697-3y6X0t8a0Z0x.jpg', // Oshi no Ko
    'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154587-n1qX7Q4X5X6Y.jpg', // Fate
    'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx170953-j7C96T5200m1.jpg', // Fire Force
    'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx164244-kswq8d3gC3j1.jpg', // Sentenced
    'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx154391-JmP4w3jK6Vk2.jpg', // Polar
    'https://s4.anilist.co/file/anilistcdn/media/anime/cover/large/bx141349-f5YdE70Xg13n.jpg'  // Executioner
];

function checkUrl(url) {
    return new Promise((resolve) => {
        https.get(url, { method: 'HEAD' }, (res) => {
            console.log(`${res.statusCode} | ${url.split('/').pop()}`);
            resolve();
        }).on('error', (e) => {
            console.log(`ERR | ${url.split('/').pop()}`);
            resolve();
        });
    });
}

(async () => {
    for (const url of urls) {
        await checkUrl(url);
    }
})();
