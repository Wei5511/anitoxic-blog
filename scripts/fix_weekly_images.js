const db = require('better-sqlite3')('anime.db');

// Define the 4 target articles and their item keywords
const weeks = [
    {
        title: '2026年1月【第一週】新番進度 (播出區間：1/1 – 1/7)',
        items: ['咒術迴戰', '燃油車鬥魂', '判處勇者刑', '泛而不精', '安逸領主']
    },
    {
        title: '2026年1月【第二週】新番進度 (播出區間：1/8 – 1/14)',
        items: ['我推的孩子', '相反的你和我', 'Fate', '公主殿下', '皎潔深宵之月']
    },
    {
        title: '2026年1月【第三週】新番進度 (播出區間：1/15 – 1/21)',
        items: ['葬送的芙莉蓮', '咒術迴戰', '我推的孩子', '燃油車鬥魂', '花樣少年少女']
    },
    {
        title: '2026年1月【第四週】新番進度 (播出區間：1/22 – 1/31)',
        items: ['葬送的芙莉蓮', '咒術迴戰', '我推的孩子', '判處勇者刑', '相反的你和我']
    }
];

// Helper to find best image
const getBestImage = (keyword) => {
    // 1. Try myvideo_library with image
    // Prefer shorter titles if possible? OR just any that has an image.
    // Actually our sync script probably put the good images on the "Season" titles like "xxx 2nd Season".
    const row = db.prepare(`SELECT image_url FROM myvideo_library WHERE title LIKE ? AND image_url IS NOT NULL AND image_url LIKE 'http%' LIMIT 1`).get(`%${keyword}%`);
    if (row) return row.image_url;

    // 2. Fallback to existing logic if needed (e.g. other tables)
    return null;
};

weeks.forEach(week => {
    const article = db.prepare("SELECT id, content FROM articles WHERE title = ?").get(week.title);
    if (!article) {
        console.log(`❌ Article not found: ${week.title}`);
        return;
    }

    let validCover = null;
    let newContent = article.content;

    week.items.forEach(keyword => {
        const img = getBestImage(keyword);
        if (img) {
            console.log(`   Found match for ${keyword}: ${img.substring(0, 40)}...`);
            if (!validCover) validCover = img;

            // Replace image in content
            // Regex: Look for ![*keyword*](...) or similar? 
            // Or just search by the Title used in the article.
            // The content is: "## 🎯 Title\n\n**Progress**\n\n![Title 劇照](...)"
            // It's safer to loop lines or using a loose regex.

            // Note: The keyword is '咒術迴戰', content header might be '咒術迴戰 死滅迴游 前篇'.
            // Let's replace ANY image link that follows a header containing the keyword.
            // This is complex to regex. 

            // Simpler approach: partial match on the alt text?
            // "![Title 劇照]"
            // "![咒術迴戰 死滅迴游 前篇 劇照]"
            // We can replace regex `!\[.*?${keyword}.*?劇照\]\((.*?)\)` with new url.

            const regex = new RegExp(`!\\[(.*?${keyword}.*?)\\]\\((.*?)\\)`, 'g');
            newContent = newContent.replace(regex, `![$1](${img})`);
        } else {
            console.log(`   ⚠️ No image found for ${keyword}`);
        }
    });

    if (validCover) {
        // Update DB
        db.prepare("UPDATE articles SET image_url = ?, content = ? WHERE id = ?").run(validCover, newContent, article.id);
        console.log(`✅ Updated ${week.title} (Cover + Content Images)`);
    } else {
        console.log(`⚠️ No valid images found at all for ${week.title}`);
    }
});
