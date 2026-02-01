const fs = require('fs');
const path = require('path');

const scriptFiles = [
    'user_urls_1.txt', 'user_urls_2.txt', 'user_urls_3.txt', 'user_urls_4.txt'
];

const all = [];

scriptFiles.forEach(file => {
    const filePath = path.join(__dirname, 'scripts', file);
    if (!fs.existsSync(filePath)) return;
    const content = fs.readFileSync(filePath, 'utf-8');
    content.split('\n').forEach(line => {
        if (!line.includes('\t')) return;
        const [title, url] = line.split('\t').map(s => s.trim());
        const id = url.split('/').pop();
        all.push({ title, id, url });
    });
});

const cats = {
    ISEKAI: [],
    HEALING: [],
    SUSPENSE: [],
    COMEDY: []
};

all.forEach(item => {
    const t = item.title;
    if (t.includes('異世界') || t.includes('轉生') || t.includes('魔王') || t.includes('賢者') || t.includes('後宮') || t.includes('召喚')) {
        cats.ISEKAI.push(item);
    }
    if (t.includes('悠閒') || t.includes('治癒') || t.includes('慢生活') || t.includes('日常') || t.includes('家') || t.includes('露營') || t.includes('天使') || t.includes('精靈') || t.includes('溫泉')) {
        cats.HEALING.push(item);
    }
    if (t.includes('偵探') || t.includes('死') || t.includes('殺') || t.includes('遊戲') || t.includes('病') || t.includes('影') || t.includes('心理') || t.includes('破案') || t.includes('咒術')) {
        cats.SUSPENSE.push(item);
    }
    if (t.includes('搞笑') || t.includes('笑') || t.includes('喜劇') || t.includes('梗') || t.includes('嚕') || t.includes('鹿')) {
        cats.COMEDY.push(item);
    }
});

// Remove duplicates across categories if needed, but let's just see 10 for each
console.log('ISEKAI:', JSON.stringify(cats.ISEKAI.slice(0, 15), null, 2));
console.log('HEALING:', JSON.stringify(cats.HEALING.slice(0, 15), null, 2));
console.log('SUSPENSE:', JSON.stringify(cats.SUSPENSE.slice(0, 15), null, 2));
console.log('COMEDY:', JSON.stringify(cats.COMEDY.slice(0, 15), null, 2));
