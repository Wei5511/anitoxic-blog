const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🔍 Starting Full Content Audit...');

// 1. Load Library
const lib = db.prepare("SELECT title, url FROM myvideo_library").all();
const libMap = new Map();
const libUrlMap = new Map();

// Manual Mappings (Sync with fix_all_listicles.js)
const mappings = [
    { k: '影子籃球員', v: '黑子的籃球' },
    { k: '排球少年', v: '排球少年!! 第四季' },
    { k: '藍色監獄', v: '藍色監獄 VS. 日本代表 U-20' },
    { k: '飆速宅男', v: '飆速宅男 第五季' },
    { k: '進擊的巨人', v: '進擊的巨人 The Final Season' },
    { k: '輝夜姬想讓人告白', v: '輝夜姬想讓人告白？' },
    { k: '咒術迴戰', v: '咒術迴戰 (第1季)' },
    { k: '咒術迴戰', v: '咒術迴戰 死滅迴游 前篇' },
    { k: '無職轉生', v: '無職轉生~到了異世界就拿出真本事~ (第2季)' },
    { k: 'Re：從零開始的異世界生活', v: 'Re:從零開始的異世界生活 第1季' },
    // Add fuzzy mappings as reverse lookups if needed, but here we Map Article Title -> Library URL
];

lib.forEach(item => {
    libMap.set(item.title, item.url);
    libUrlMap.set(item.url, item.title);

    // Add manual reverses
    if (item.title === '影子籃球員') libMap.set('黑子的籃球', item.url);
    if (item.title === '排球少年') libMap.set('排球少年!! 第四季', item.url);
    if (item.title === '藍色監獄') libMap.set('藍色監獄 VS. 日本代表 U-20', item.url);
    if (item.title === '飆速宅男') libMap.set('飆速宅男 第五季', item.url);
    if (item.title === '進擊的巨人') libMap.set('進擊的巨人 The Final Season', item.url);
    if (item.title === '輝夜姬想讓人告白') libMap.set('輝夜姬想讓人告白？', item.url);
    if (item.title === '咒術迴戰') {
        libMap.set('咒術迴戰 (第1季)', item.url);
        libMap.set('咒術迴戰 死滅迴游 前篇', item.url);
    }
    if (item.title === '無職轉生') libMap.set('無職轉生~到了異世界就拿出真本事~ (第2季)', item.url);
    if (item.title === 'Re：從零開始的異世界生活') libMap.set('Re:從零開始的異世界生活 第1季', item.url);
});

const articles = db.prepare("SELECT * FROM articles").all();

let validCount = 0;
let invalidCount = 0;
let report = '# 完整文章檢測報告 (Full Audit Report)\n\n';
report += `Generated at: ${new Date().toLocaleString()}\n\n`;

for (const article of articles) {
    const issues = [];

    // --- Rule 1: Single Anime Articles (Title must exist in library) ---
    if (article.category === '動畫介紹' || article.category === '集數更新') {
        const cleanTitle = article.title.replace(/《|》/g, '');
        let officialUrl = null;

        // Exact match
        if (libMap.has(cleanTitle)) {
            officialUrl = libMap.get(cleanTitle);
        } else {
            // Fuzzy match (starts with)
            // e.g. "Frieren S2" matches "Frieren"
            for (const [libTitle, url] of libMap.entries()) {
                if (cleanTitle.startsWith(libTitle)) {
                    officialUrl = url;
                    break;
                }
            }
        }

        if (!officialUrl) {
            // issues.push(`❓ 單篇動畫標題未在 MyVideo 資料庫中找到 (可能為缺漏或名稱不一致)`);
            // Actually, if it's not in DB, we can't strict check it. But user asked for correctness.
            // If it's not in DB, it's a "Problem" for import.
            issues.push(`❓ Title Not Found in Library`);
        } else {
            // Check Link
            if (article.myvideo_url !== officialUrl) {
                issues.push(`❌ URL Mismatch: Current [${article.myvideo_url}] != Official [${officialUrl}]`);
            }
        }

        // Quality
        if (article.content.length < 500) issues.push(`📉 Content too short (<500)`);
        if (!article.image_url && !article.content.includes('<img') && !article.content.includes('![')) issues.push(`🖼️ Missing Image`);
    }

    // --- Rule 2: Listicles (Sections must match library) ---
    if (article.category === '編輯精選' || article.category === '綜合報導') {
        const sections = article.content.split('## ');
        if (sections.length < 2) {
            issues.push(`⚠️ Listicle format error (No '##' sections found)`);
        } else {
            for (let i = 1; i < sections.length; i++) {
                const section = sections[i];
                if (section.length < 20) continue; // Skip empty/short noise

                const titleLine = section.split('\n')[0].trim();
                let cleanTitle = titleLine
                    .replace(/^\d+\.\s*/, '')
                    .replace(/《/g, '')
                    .replace(/》/g, '')
                    .split('｜')[0]
                    .trim();

                if (cleanTitle.startsWith('Re:')) cleanTitle = cleanTitle.replace('Re:', 'Re：');

                // Resolve URL
                let officialUrl = libMap.get(cleanTitle);

                // Fuzzy fallback
                if (!officialUrl) {
                    const baseTitle = cleanTitle
                        .replace(/[\(（]第\d+季[\)）]|第二季|第三季|S2|S3|Part\s*\d+|第.+季|參之章|貳之章|死滅迴游篇/g, '')
                        .trim();
                    officialUrl = libMap.get(baseTitle);
                }

                if (officialUrl) {
                    // Check internal link
                    const linkMatch = section.match(/href="(https:\/\/www\.myvideo\.net\.tw\/details\/[^"]+)"/);
                    if (linkMatch) {
                        const currentUrl = linkMatch[1];
                        if (currentUrl !== officialUrl) {
                            issues.push(`❌ Section [${cleanTitle}] Link Wrong: ${currentUrl} -> Should be ${officialUrl}`);
                        }
                    } else {
                        // User Rule: "Remove if no link"? No, user said "Remove if no MyVideo".
                        // If we have Official URL but NO link in text, that's a "Missing Link" issue.
                        issues.push(`⚠️ Section [${cleanTitle}] Missing Link (We have it in DB!)`);
                    }
                } else {
                    // Title NOT in Library
                    // Since I ran "Remove Missing", if this still exists, it's a problem!
                    issues.push(`❓ Section [${cleanTitle}] Not in Library (Should have been removed?)`);
                }
            }
        }
    }

    if (issues.length === 0) {
        validCount++;
    } else {
        invalidCount++;
        report += `### [${article.id}] ${article.title}\n`;
        issues.forEach(iss => report += `- ${iss}\n`);
        report += '\n';
    }
}

report += `\n---\nSummary:\n✅ Correct Articles: ${validCount}\n❌ Articles with Issues: ${invalidCount}\nTotal: ${articles.length}`;
const reportFile = path.join(__dirname, '..', 'audit_report.md');
fs.writeFileSync(reportFile, report);
console.log(`Audit Complete. Report saved to ${reportFile}`);
