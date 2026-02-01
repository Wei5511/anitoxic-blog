const db = require('better-sqlite3')('anime.db');

// 1. Fetch ALL 2026 Jan Anime from myvideo_library (populated by sync)
const animes = db.prepare("SELECT * FROM myvideo_library WHERE url IS NOT NULL").all();

// 2. Generate Markdown Content
let content = `
1 月新番大爆發！本季共有 **${animes.length}** 部動畫強勢開播。
無論是備受期待的續作，還是話題滿滿的新作，這裡一次幫你整理好！

`;

// Group by some logic? Or just list all?
// Let's list Top 10 by some metric (or just first 10) then a list of others?
// User said "Update 2026 Jan content... complete... chinese".
// Let's try to group them or list them nicely.
// For now, simple list of *Highlights* (with images) then a Table?
// Actually, let's just do a big list of cards like the weekly ones but for ALL (or top 20?).
// "2026 1月新番推薦總整理" -> usually implies a curated list or a full list.
// Given "补齐" (fill up/complete), I should try to include many.

animes.forEach(anime => {
    // Only include if we have minimum data
    if (!anime.image_url) return;

    content += `## 📺 [${anime.title}](${anime.url})\n\n`;
    content += `![${anime.title} Key Visual](${anime.image_url})\n\n`;

    if (anime.synopsis) {
        content += `> **劇情簡介**：\n> ${anime.synopsis.substring(0, 150)}...\n\n`;
    }

    if (anime.staff) {
        content += `**製作陣容**：\n${anime.staff.split('\n').slice(0, 3).join(', ')}...\n\n`;
    }

    if (anime.cast) {
        // Parse "Role (Name)" -> just names?
        // cast is "Role (Name)" lines.
        const castNames = anime.cast.split('\n').map(l => l.split('(')[1]?.replace(')', '')).filter(Boolean).slice(0, 4).join(', ');
        content += `**聲優**：${castNames || '詳見內文'}\n\n`;
    }

    content += `<a href="${anime.url}" class="btn-orange-small" target="_blank">立即觀看 (MyVideo)</a>\n\n`;
    content += `---\n\n`;
});

// 3. Update Pinned Article
// Find the pinned one (or create if missing)
const pinned = db.prepare("SELECT id FROM articles WHERE is_pinned = 1").get();

if (pinned) {
    db.prepare("UPDATE articles SET content = ?, title = '【2026新番】1月動畫強力推薦總整理' WHERE id = ?")
        .run(content, pinned.id);
    console.log(`Updated Pinned Article ${pinned.id}`);
} else {
    console.log('No pinned article found to update, creating one...');
    db.prepare("INSERT INTO articles (title, content, category, slug, published_at, is_pinned, image_url) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP, 1, '/assets/placeholder.jpg')")
        .run('【2026新番】1月動畫強力推薦總整理', content, '編輯精選', 'jan-2026-pinned');
}
