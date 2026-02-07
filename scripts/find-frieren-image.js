const fetch = require('node-fetch'); // Needs node-fetch or native fetch in Node 18+

async function findImage() {
    const urls = [
        'https://p2.bahamut.com.tw/B/ACG/c/32/0000133232.JPG', // Bahamut
        'https://cdn.myanimelist.net/images/anime/1015/138006l.jpg', // MAL S1
        'https://image.tmdb.org/t/p/original/kh0L66cvTdaCk4Njk8oZ58N27iJ.jpg', // TMDB Original
        'https://media.frieren-anime.jp/assets/img/top/kv_02.jpg' // Official
    ];

    for (const url of urls) {
        try {
            console.log(`Checking ${url}...`);
            const res = await fetch(url, { method: 'HEAD', timeout: 5000 });
            if (res.ok) {
                console.log(`[OK] Found working URL: ${url}`);
                // Update DB
                const db = require('better-sqlite3')('anime.db');
                let content = db.prepare('SELECT content FROM articles WHERE id = 931').get().content;

                // Replace any existing Frieren image in markdown
                // Regex for "![葬送的芙莉蓮...](...)"
                const regex = /!\[葬送的芙莉蓮[^\]]*\]\(([^)]+)\)/;
                if (regex.test(content)) {
                    content = content.replace(regex, `![葬送的芙莉蓮 第二季](${url})`);
                    db.prepare('UPDATE articles SET content = ? WHERE id = 931').run(content);
                } else {
                    console.log('Markdown image not found to replace.');
                }

                // Update main image
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
