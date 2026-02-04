const puppeteer = require('puppeteer');
const path = require('path');

(async () => {
    const browser = await puppeteer.launch({
        headless: "new",
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();

    try {
        const targetUrl = 'https://youranimes.tw/animes/1286'; // Assassination Classroom
        console.log(`Navigating to ${targetUrl}...`);
        await page.goto(targetUrl, { waitUntil: 'networkidle2' });

        console.log('Taking screenshot...');
        await page.screenshot({ path: 'youranimes_detail_1286.png' });

        // Dump text
        const text = await page.evaluate(() => document.body.innerText.substring(0, 3000));
        console.log('Detail Page Text:', text);

        // Check for MAL link
        const malLink = await page.evaluate(() => {
            const a = document.querySelector('a[href*="myanimelist"]');
            return a ? a.href : null;
        });
        console.log('MAL Link:', malLink);

        // Check for English title in h1, h2 or specific classes
        const titles = await page.evaluate(() => {
            const h1 = document.querySelector('h1') ? document.querySelector('h1').innerText : '';
            const sub = document.querySelector('.text-gray-400') ? document.querySelector('.text-gray-400').innerText : '';
            return { h1, sub };
        });
        console.log('Titles:', titles);

    } catch (e) {
        console.error('Error:', e);
    } finally {
        await browser.close();
    }
})();
