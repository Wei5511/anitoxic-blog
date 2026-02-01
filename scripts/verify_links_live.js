const Database = require('better-sqlite3');
const https = require('https');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🌐 Starting Live Link Verification (HTTP Check)...');

// 1. Gather all links
const articles = db.prepare("SELECT id, title, content FROM articles").all();
const linksToCheck = new Map(); // URL -> Array of Article Titles

const addLink = (url, title) => {
    if (!url || !url.includes('myvideo.net.tw')) return;
    if (!linksToCheck.has(url)) {
        linksToCheck.set(url, []);
    }
    linksToCheck.get(url).push(title);
};

articles.forEach(article => {
    // Extract from content
    const regex = /href="(https:\/\/www\.myvideo\.net\.tw\/details\/[^"]+)"/g;
    let match;
    while ((match = regex.exec(article.content)) !== null) {
        addLink(match[1], `[Art:${article.id}] ${article.title}`);
    }
});

console.log(`Found ${linksToCheck.size} unique links to verify.`);

// 2. Check function
const checkUrl = (url) => {
    return new Promise((resolve) => {
        const req = https.request(url, {
            method: 'HEAD',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
            }
        }, (res) => {
            // MyVideo might redirect (301/302). Follow redirects? 
            // Usually details page should be 200.
            if (res.statusCode >= 200 && res.statusCode < 400) {
                resolve({ ok: true, status: res.statusCode });
            } else {
                resolve({ ok: false, status: res.statusCode });
            }
        });

        req.on('error', (e) => resolve({ ok: false, error: e.message }));
        req.on('timeout', () => resolve({ ok: false, error: 'Timeout' }));
        req.setTimeout(5000); // 5s timeout
        req.end();
    });
};

// 3. Run Checks (Batching)
const batchSize = 5;
const urls = Array.from(linksToCheck.keys());

(async () => {
    let passed = 0;
    let failed = 0;
    const failures = [];

    for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const promises = batch.map(async (url) => {
            const result = await checkUrl(url);
            process.stdout.write(result.ok ? '.' : 'x');
            return { url, result };
        });

        const results = await Promise.all(promises);

        for (const { url, result } of results) {
            if (result.ok) {
                passed++;
            } else {
                failed++;
                const affectedArticles = linksToCheck.get(url);
                failures.push({ url, status: result.status || result.error, articles: affectedArticles });
            }
        }
    }

    console.log('\n\n--- Live Verification Report ---');
    console.log(`✅ Alive: ${passed}`);
    console.log(`❌ Dead/Error: ${failed}`);

    if (failures.length > 0) {
        console.log('\nFAILED LINKS:');
        failures.forEach(f => {
            console.log(`[${f.status}] ${f.url}`);
            console.log(`   Found in: ${f.articles.join(', ')}`);
        });
    } else {
        console.log('\n✨ All checked links are accessible!');
    }
})();
