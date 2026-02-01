/**
 * Content Validation Script
 * 
 * Rules:
 * 1. Title Verification: Must match MyVideo library (or be in library).
 * 2. Link Verification: Must match MyVideo library URL.
 * 3. Content Quality:
 *    - Single Anime > 800 chars
 *    - Comprehensive > 500 chars (per item?) - Simplified: Total > 1000 for now or check structure.
 *    - Must have images.
 *    - No canned text.
 */

const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const dbPath = path.join(__dirname, '..', 'anime.db');
const reportPath = path.join(__dirname, '..', 'validation_report.md');

async function main() {
    console.log('🔍 Running Content Validation...');
    const db = new Database(dbPath);

    // Load library
    const lib = db.prepare("SELECT title, url FROM myvideo_library").all();
    const libMap = new Map(); // Title -> URL
    const libUrlMap = new Map(); // URL -> Title
    lib.forEach(item => {
        libMap.set(item.title, item.url);
        libUrlMap.set(item.url, item.title);
    });

    const articles = db.prepare("SELECT * FROM articles").all();
    let report = '# Content Validation Report\n\n';
    let errorCount = 0;

    for (const article of articles) {
        const issues = [];

        // --- 1. Title & Link Check ---
        // Try to match article title to library
        let officialTitle = null;
        let officialUrl = null;

        if (libMap.has(article.title)) {
            officialTitle = article.title;
            officialUrl = libMap.get(article.title);
        } else {
            // Reverse lookup by URL
            if (libUrlMap.has(article.myvideo_url)) {
                officialTitle = libUrlMap.get(article.myvideo_url);
                officialUrl = article.myvideo_url;

                // Strict check: Title must contain Official Title
                // Allow 《Official》 or Official patterns
                const normalizedArticle = article.title.replace(/《/g, '').replace(/》/g, '');

                // If article title starts with official title, we consider it valid (for subtitle support)
                // e.g. "OfficialTitle | Subtitle"
                if (!normalizedArticle.startsWith(officialTitle)) {
                    issues.push(`⚠️ Title Mismatch: Current [${article.title}] vs Official [${officialTitle}]`);
                }
            }
        }

        // Link correctness
        if (officialUrl) {
            if (article.myvideo_url !== officialUrl) {
                issues.push(`❌ Invalid Link: Current [${article.myvideo_url}] should be [${officialUrl}]`);
            }
        } else {
            // Not in library?
            // If category is '動畫介紹' (Single Anime), it SHOULD be in library if it's a known anime.
            if (article.category === '動畫介紹' || article.category === '集數更新') {
                issues.push(`❓ Title Not Found in MyVideo Library: [${article.title}]`);
            }
        }

        // --- 2. Content Quality ---
        const charCount = article.content.length;
        const hasImage = article.content.includes('![]') || article.content.includes('<img');

        if (article.category === '動畫介紹' || article.category === '集數更新') {
            if (charCount < 800) {
                issues.push(`📉 Low Word Count: ${charCount} chars (Requirement: >800)`);
            }
        } else if (article.category === '綜合報導' || article.category === '編輯精選') {
            // For listicles, maybe lower limit per item, but total should be substantial
            if (charCount < 500) {
                issues.push(`📉 Low Word Count for Listicle: ${charCount} chars (Requirement: >500)`);
            }
        }

        if (!hasImage) {
            issues.push(`🖼️ No Images Detected`);
        }

        // --- 3. Canned Text Check ---
        if (article.content.includes("Lorem ipsum") || article.content.includes("測試文章")) {
            issues.push(`🤖 Canned/Test Text Detected`);
        }

        // --- 4. Internal Link Check (Listicle Mode) ---
        // Find all MyVideo links in content
        const urlRegex = /https:\/\/www\.myvideo\.net\.tw\/details\/\d+\/\d+/g;
        const foundUrls = article.content.match(urlRegex) || [];

        if (foundUrls.length > 0) {
            const uniqueFound = [...new Set(foundUrls)];
            for (const foundUrl of uniqueFound) {
                if (!libUrlMap.has(foundUrl)) {
                    // The link exists in content but NOT in our library?
                    // It might be an old link or user typo
                    // issues.push(`⚠️ Unknown Internal Link: [${foundUrl}] - Not in library`);
                    // Actually, if it's not in library, we can't validate it against a title easily without crawling.
                    // But we can check if there's a BETTER link if we can guess the title context (hard).
                    // For now, just warn? Or maybe checking for MISMATCHED links is better.
                } else {
                    // Link is in library. Good.
                }
            }
        }

        // SPECIAL CHECK for Article 875 (User Request): Check if titles in content have correct links
        // Heuristic: specific to this listicle format if possible, or general "Title" -> Link check detection?
        // Since listicles are unstructured text, hard to map "Title" to "Link" automatically without AI.
        // BUT, we can check if the article *mentions* a title that is in our library, but provides a DIFFERENT link?
        // That's computationally expensive for 1000 titles.

        // Simplified check: If it's a "Top 10" list, does it contain at least N links from our library?
        if (article.category === '編輯精選' && foundUrls.length === 0) {
            issues.push(`⚠️ Listicle has no MyVideo links?`);
        }

        // Specific check for Listicle content integrity (ALL listicles)
        if (article.category === '編輯精選' || article.category === '綜合報導') {
            const sections = article.content.split('## ');
            for (let i = 1; i < sections.length; i++) {
                const section = sections[i];
                const titleLine = section.split('\n')[0].trim();
                // Strip "1. " and normalize
                const cleanTitle = titleLine.replace(/^\d+\.\s*/, '').replace(/《/g, '').replace(/》/g, '').split('｜')[0].trim();

                if (libMap.has(cleanTitle)) {
                    const officialUrl = libMap.get(cleanTitle);
                    const linkMatch = section.match(/href="(https:\/\/www\.myvideo\.net\.tw\/details\/[^"]+)"/);
                    if (linkMatch) {
                        const currentUrl = linkMatch[1];
                        if (currentUrl !== officialUrl) {
                            issues.push(`❌ [${cleanTitle}] Link Mismatch: Current [${currentUrl}] should be [${officialUrl}]`);
                        }
                    }
                }
            }
        }

        if (issues.length > 0) {
            report += `## ${article.slug} (${article.title})\n`;
            issues.forEach(i => report += `- ${i}\n`);
            report += '\n';
            errorCount++;
        }
    }

    if (errorCount === 0) {
        report += "✅ All articles passed validation!\n";
    } else {
        report += `\nTotal Articles with Issues: ${errorCount} / ${articles.length}`;
    }

    fs.writeFileSync(reportPath, report);
    console.log(`📝 Report generated at ${reportPath}`);
    console.log(`Found issues in ${errorCount} articles.`);
}

main();
