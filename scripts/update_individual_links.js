
const path = require('path');
const Database = require('better-sqlite3');

const dbPath = path.join(process.cwd(), 'anime.db');
const db = new Database(dbPath);

const MAPPINGS = [
    { title: "咒術迴戰", id: "32428" },
    { title: "判處勇者刑", id: "32447" },
    { title: "公主殿下", id: "32446" },
    { title: "我的英雄學院", id: "31673" },
    { title: "正義使者", id: "32421" },
    { title: "相反的你和我", id: "32423" },
    { title: "Fate/strange Fake", id: "29508" },
    { title: "安逸領主", id: "32342" },
    { title: "單人房", id: "27122" },
    { title: "SHY", id: "24883" },
    { title: "我家的英雄", id: "23249" },
    { title: "魔都精兵", id: "32343" },
    { title: "金牌得主", id: "32168" }, // General guess for recent titles
    { title: "MF Ghost", id: "31671" },
];

const updateStmt = db.prepare("UPDATE articles SET myvideo_url = ? WHERE title LIKE ?");

MAPPINGS.forEach(m => {
    const url = `https://www.myvideo.net.tw/details/3/${m.id}`;
    const result = updateStmt.run(url, `%${m.title}%`);
    console.log(`Updated ${m.title} articles with URL: ${url} (Changes: ${result.changes})`);
});

console.log('Individual links updated.');
