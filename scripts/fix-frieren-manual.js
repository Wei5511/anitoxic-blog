const db = require('better-sqlite3')('anime.db');

const targetUrl = 'https://img.myvideo.net.tw/images/MUS030/0002/4777/202601081126565979_280x400.jpg';

console.log('Updating Frieren image to user provided URL...');

const row = db.prepare('SELECT content FROM articles WHERE id = 931').get();
if (!row) {
    console.error('Article 931 not found');
    process.exit(1);
}

let content = row.content;

// Regex to find the markdown image for Frieren.
// It usually looks like ![葬送的芙莉蓮 第二季](URL)
const regex = /!\[葬送的芙莉蓮[^\]]*\]\([^\)]+\)/;

if (regex.test(content)) {
    content = content.replace(regex, `![葬送的芙莉蓮 第二季](${targetUrl})`);
    console.log('Replaced Markdown image.');
} else {
    // If exact regex fails, maybe it's the first image?
    // Or we can try to search for the specific incorrect URL if we knew it, but regex is safer.
    console.log('Could not find Frieren markdown patterns. Appending match check.');
    // Check if there is ANY image at the start sections?
    // Let's just try to brute force replace the previous Bahamut link if present
    const badLink = 'https://p2.bahamut.com.tw/B/ACG/c/32/0000133232.JPG';
    if (content.includes(badLink)) {
        content = content.replace(badLink, targetUrl);
        console.log('Replaced Bahamut link.');
    }
}

db.prepare('UPDATE articles SET content = ?, image_url = ? WHERE id = 931').run(content, targetUrl);
console.log('Database updated successfully with new URL.');
