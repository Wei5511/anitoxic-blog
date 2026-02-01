const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🔧 Fixing Article 875 Links...');

// Load correct library
const lib = db.prepare("SELECT title, url FROM myvideo_library").all();
const libMap = new Map();
lib.forEach(item => {
    libMap.set(item.title, item.url);
    // Add variations if needed (e.g. from previous steps)
    if (item.title === '影子籃球員') libMap.set('黑子的籃球', item.url);
    if (item.title === '排球少年') libMap.set('排球少年!! 第四季', item.url);
    if (item.title === '藍色監獄') libMap.set('藍色監獄 VS. 日本代表 U-20', item.url);
    if (item.title === '飆速宅男') libMap.set('飆速宅男 第五季', item.url);
});

// Load Article 875
const article = db.prepare("SELECT * FROM articles WHERE id = 875").get();

if (!article) {
    console.error('Article 875 not found');
    process.exit(1);
}

let content = article.content;
let fixedCount = 0;

// The article uses HTML button links: <a href="..." ...>
// And also maybe markdown links.
// We need to match the "CONTEXT" of the link to find the anime title.
// Inspecting content suggests structure:
// ## Title
// Description...
// <a href="bad_link">...</a>

// Strategy: Split by "## " to get sections?
const sections = content.split('## ');
let newContent = sections[0]; // Header part

for (let i = 1; i < sections.length; i++) {
    const section = sections[i];
    const lines = section.split('\n');
    const titleLine = lines[0].trim();
    // Normalize title (remove "《》", leading numbers "1. ", etc)
    const cleanTitle = titleLine.replace(/^\d+\.\s*/, '').replace(/《/g, '').replace(/》/g, '').split('｜')[0].trim();

    console.log(`Processing Section: [${cleanTitle}]`);

    // Find correct link
    const correctUrl = libMap.get(cleanTitle);

    if (correctUrl) {
        // Regex to replace href="..."
        const linkRegex = /href="https:\/\/www\.myvideo\.net\.tw\/details\/[^"]+"/;
        if (linkRegex.test(section)) {
            const oldLinkMatch = section.match(linkRegex);
            const oldLink = oldLinkMatch[0];
            const newLinkStr = `href="${correctUrl}"`;

            if (oldLink !== newLinkStr) {
                console.log(`  Mismatch! Replacing link for ${cleanTitle}`);
                console.log(`  Old: ${oldLink}`);
                console.log(`  New: ${newLinkStr}`);

                const newSection = section.replace(linkRegex, newLinkStr);
                newContent += '## ' + newSection;
                fixedCount++;
                continue;
            } else {
                console.log(`  Link Match: Correct.`);
            }
        } else {
            console.log(`  No link found in section?`);
        }
    } else {
        console.log(`  ⚠️ Title not found in library: ${cleanTitle}`);
    }

    newContent += '## ' + section; // Append original if no fix or no link
}

if (fixedCount > 0) {
    db.prepare("UPDATE articles SET content = ? WHERE id = 875").run(newContent);
    console.log(`✅ Updated Article 875. Fixed ${fixedCount} links.`);
} else {
    console.log('No links required fixing.');
}
