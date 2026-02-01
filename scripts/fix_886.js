const db = require('better-sqlite3')('anime.db');

// 1. Fetch ALL 2026 Jan Anime from myvideo_library (populated by sync)
const animes = db.prepare("SELECT * FROM myvideo_library WHERE url IS NOT NULL").all();

console.log(`Found ${animes.length} animes with links.`);

// 2. Generate Markdown Content
let content = `
1 月新番大爆發！本季共有 **${animes.length}** 部動畫強勢開播。
這裡一次幫你整理好！

`;

animes.forEach(anime => {
    // Only include if we have minimum data (image)
    if (!anime.image_url) return;

    // Standard Layout (Matching 875)
    content += `## 📺 ${anime.title}\n\n`;

    // Explicitly using the image URL found in DB
    content += `![${anime.title} 劇照](${anime.image_url})\n\n`;

    if (anime.synopsis) {
        content += `> **劇情簡介**：\n> ${anime.synopsis.substring(0, 150)}...\n\n`;
    }

    if (anime.staff) {
        content += `**製作陣容**：\n${anime.staff.split('\n').slice(0, 3).join(', ')}...\n\n`;
    }

    if (anime.cast) {
        const castNames = anime.cast.split('\n').map(l => l.split('(')[1]?.replace(')', '')).filter(Boolean).slice(0, 4).join(', ');
        content += `**聲優**：${castNames || '詳見內文'}\n\n`;
    }

    content += `<a href="${anime.url}" class="btn-orange-small" target="_blank">立即觀看 (MyVideo)</a>\n\n`;
    content += `---\n\n`;
});

// 3. Update Article 886
const targetId = 886;
const exists = db.prepare("SELECT id FROM articles WHERE id = ?").get(targetId);

if (exists) {
    db.prepare("UPDATE articles SET content = ?, title = '【2026新番】1月動畫強力推薦總整理', category = '編輯精選' WHERE id = ?")
        .run(content, targetId);
    console.log(`✅ Updated Article ${targetId} with new single-column layout.`);
} else {
    console.log(`❌ Article ${targetId} not found!`);
}
