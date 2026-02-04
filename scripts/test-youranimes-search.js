const puppeteer = require('puppeteer');

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        const query = 'ヘヴィーオブジェクト'; // Heavy Object
        console.log(`Searching for Japanese title: ${query}`);

        await page.goto(`https://youranimes.tw/search?keyword=${encodeURIComponent(query)}`, { waitUntil: 'networkidle2' });

        // Wait for results
        try {
            await page.waitForSelector('a[href^="/animes/"]', { timeout: 5000 });
        } catch (e) {
            console.log('Timeout waiting for results.');
        }

        // Extract results
        const results = await page.evaluate(() => {
            const items = [];
            // Select all links composed of card structure likely
            // In search page, usually generic grid.
            document.querySelectorAll('a').forEach(a => {
                const href = a.getAttribute('href');
                if (href && href.startsWith('/animes/')) {
                    const title = a.innerText.trim();
                    // Filter out empty or nav links if any
                    if (title) items.push({ title, href });
                }
            });
            return items;
        });

        console.log(`Found ${results.length} results.`);
        results.forEach(r => console.log(`- ${r.title} (${r.href})`));

    } catch (e) {
        console.error(e);
    } finally {
        await browser.close();
    }
})();
