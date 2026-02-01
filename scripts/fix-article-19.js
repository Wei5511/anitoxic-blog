/**
 * FIX ARTICLE 19
 * 
 * Situation: ID 19 (Polar Opposites) was accidentally overwritten with Vigilantes content.
 * Fix:
 * 1. Move the current content of ID 19 (Vigilantes) to a new row.
 * 2. Restore ID 19 with the correct Polar Opposites content.
 * 3. Ensure 'category' is correct ('動畫介紹').
 */

const Database = require('better-sqlite3');
const path = require('path');
const dbPath = path.join(__dirname, '..', 'anime.db');
const db = new Database(dbPath);

console.log('🚀 Fixing Article 19 Conflict...');

const polarContent = `在充斥著異世界轉生與超能力戰鬥的動畫市場中，《相反的你和我》就像一杯清爽的檸檬蘇打水，以其純粹、真誠且甜度爆表的校園戀愛喜劇風格，迅速俘獲了觀眾的心。這部改編自阿賀澤紅茶人氣漫畫的作品，沒有複雜的後宮關係，沒有令人胃痛的誤會糾葛，只有兩個性格截然不同的人如何慢慢靠近、互相理解的溫暖過程。它證明了簡單的故事如果講得好，依然擁有打動人心的力量。

![相反的你和我](/images/anime/polar-opposites.jpg)

## 劇情詳解與看點

故事的女主角鈴木美優是一個為了融入群體、總是察言觀色的「辣妹系」女生，她充滿活力卻也容易感到疲憊；而男主角谷悠介則是一個戴著眼鏡、沈默寡言，堅持自我步調的「書呆子」。在一般校園劇的設定中，這樣兩人通常是平行線，但在本作中，他們卻因為座位相鄰而產生了交集。美優發現了谷隱藏在冷淡外表下的溫柔與細膩，而谷也看見了美優在隨波逐流背後的真實與可愛。

本作最大的看點在於「溝通」。很多戀愛番喜歡用「不說話」來製造衝突，但美優與谷卻是典型的「直球系」情侶。當他們察覺到對方的異樣或自己的心意時，會選擇笨拙但真誠地表達出來。看著他們為了想更了解對方而努力尋找共同話題，或是因為一點點肢體接觸而臉紅心跳，觀眾會不自覺地露出姨母笑。此外，配角群的描寫也相當出色，每一位朋友都有自己的性格與故事，他們的存在不是為了推進男女主角的戀情工具，而是共同構築了一個真實且溫暖的班級生態。

動畫製作組非常尊重原作的獨特畫風，尤其是阿賀澤老師筆下那種特有的 Q 版表情與線條，在動畫中被完美還原。畫面的色彩運用大膽且繽紛，帶有一種普普藝術（Pop Art）的風格，非常符合本作輕快活潑的基調。聲優的演繹自然不做作，特別是在內心獨白的段落，將青春期少年少女那種患得患失、卻又充滿期待的小心思表現得淋漓盡致。這是一部適合在疲憊的一天結束後，放鬆心情觀看的最佳治癒劑。`;

const polarData = {
    slug: 'polar-opposites-ep1',
    title: '《相反的你和我》｜正反磁極般的甜蜜戀愛',
    excerpt: '充滿活力的辣妹與沈默寡言的書呆子，性格天差地遠卻意外合拍。',
    category: '動畫介紹',
    image: '/images/anime/polar-opposites.jpg',
    myvideo_url: 'https://www.myvideo.net.tw/search/相反的你和我'
};

// 1. Save Vigilantes (Current ID 19) to a new ID
try {
    const current19 = db.prepare('SELECT slug FROM articles WHERE id = 19').get();
    if (current19 && current19.slug.includes('vigilantes')) {
        console.log('Creating backup of Vigilantes from ID 19...');
        // Check if Vigilantes already exists elsewhere to avoid full dupe
        const existingVig = db.prepare('SELECT id FROM articles WHERE slug = ? AND id != 19').get(current19.slug);

        if (!existingVig) {
            db.prepare(`
                INSERT INTO articles (slug, title, excerpt, content, category, image_url, myvideo_url)
                SELECT slug, title, excerpt, content, category, image_url, myvideo_url
                FROM articles WHERE id = 19
            `).run();
            console.log('✅ Vigilantes saved to new ID.');
        } else {
            console.log(`⚠️ Vigilantes already exists at ID ${existingVig.id}. Skipping backup.`);
        }
    }
} catch (e) {
    console.error('Error saving Vigilantes:', e);
}

// 2. Overwrite ID 19 with Polar Opposites
try {
    const info = db.prepare(`
        UPDATE articles 
        SET slug = ?, title = ?, excerpt = ?, content = ?, category = ?, image_url = ?, myvideo_url = ?
        WHERE id = 19
    `).run(
        polarData.slug,
        polarData.title,
        polarData.excerpt,
        polarContent,
        polarData.category,
        polarData.image,
        polarData.myvideo_url
    );
    console.log(`✅ ID 19 restored to Polar Opposites. Changes: ${info.changes}`);
} catch (e) {
    console.error('Error updating ID 19:', e);
}

// 3. Cleanup any other duplicates of Polar Opposites (if they exist)
const dupes = db.prepare('SELECT id FROM articles WHERE slug = ? AND id != 19').all(polarData.slug);
for (const row of dupes) {
    db.prepare('DELETE FROM articles WHERE id = ?').run(row.id);
    console.log(`🗑️ Deleted duplicate Polar Opposites at ID ${row.id}`);
}

console.log('🎉 Fix Complete!');
