const db = require('better-sqlite3')('anime.db');

async function findImage() {
    const urls = [
        'https://upload.wikimedia.org/wikipedia/en/d/de/Frieren_Beyond_Journey%27s_End_key_visual.jpg', // Wikipedia
        'https://p2.bahamut.com.tw/B/ACG/c/32/0000133232.JPG', // Bahamut
        'https://image.tmdb.org/t/p/original/kh0L66cvTdaCk4Njk8oZ58N27iJ.jpg', // TMDB
    ];

    for (const url of urls) {
        try {
            console.log(`Checking ${url}...`);
            const res = await fetch(url, { method: 'HEAD' });
            if (res.ok) {
                console.log(`[OK] Found working URL: ${url}`);

                let row = db.prepare('SELECT content FROM articles WHERE id = 931').get();
                let content = row.content;

                // Replace any Frieren image URL
                // Regex to match markdown image for Frieren: ![...](...)
                // We want to replace the URL part.
                // Find current image used for Frieren
                // Previous known bad URLs:
                const badUrls = [
                    'https://d28s5ztqvkii64.cloudfront.net/images/anime/5660/jH8fWyVuPX.jpg',
                    'https://image.tmdb.org/t/p/w500/kh0L66cvTdaCk4Njk8oZ58N27iJ.jpg', // User says this is bad
                    'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg'
                ];

                let replaced = false;
                for (const bad of badUrls) {
                    if (content.includes(bad)) {
                        content = content.replace(bad, url);
                        replaced = true;
                        console.log(`Replaced bad URL: ${bad}`);
                    }
                }

                // If regex needed (if exact URL match failed)
                if (!replaced) {
                    const regex = /!\[葬送的芙莉蓮[^\]]*\]\(([^)]+)\)/;
                    const match = content.match(regex);
                    if (match) {
                        content = content.replace(match[1], url);
                        console.log(`Replaced by regex: ${match[1]}`);
                    }
                }

                db.prepare('UPDATE articles SET content = ? WHERE id = 931').run(content);
                db.prepare('UPDATE articles SET image_url = ? WHERE id = 931').run(url);
                console.log('Database updated.');
                return;
            } else {
                console.log(`[FAIL] Status: ${res.status}`);
            }
        } catch (e) {
            console.log(`[ERROR] ${e.message}`);
        }
    }
    console.log('No working image found.');
}

findImage();
