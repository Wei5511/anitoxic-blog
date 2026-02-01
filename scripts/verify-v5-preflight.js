const fs = require('fs');
const path = require('path');

const targets = [
    // Sports (10)
    '強風吹拂', '排球少年', '藍色監獄', '黑子的籃球', '鑽石王牌', '飆速宅男', '足球風雲', '網球王子', '白領羽球部', '蜻蛉高球',
    // Isekai (10)
    '無職轉生', '從零開始', '史萊姆', '美好的世界', '異世界溫泉', '轉生賢者', '轉生成蜘蛛', '異世界藥局', '迷宮裡的後宮', '轉生貴族',
    // Healing (10)
    '明日同學的水手服', '夏目友人帳', '水星領航員', '我們這一家', '間諜家家酒', '比宇宙更遠', '房間露營', '單身露營', '悠閒農家', '搖曳露營',
    // Suspense (10)
    '進擊的巨人', '命運石之門', '夏日重現', '藥師少女', '咒術迴戰', '朋友遊戲', '怪物事變', '風都偵探', '偵探已經', '自殺突擊隊',
    // Comedy (10)
    '孤獨搖滾', '輝夜姬', '銀魂', '鹿乃子', '蠟筆小新', '齊木楠雄', '月刊少女', '派對咖孔明', '烏龍派出所', '工作細胞'
];

const fullMap = new Map(); // ID -> Title (Raw)

function loadFile(n) {
    const filePath = path.join(__dirname, `user_urls_${n}.txt`);
    const buffer = fs.readFileSync(filePath);

    // Try both UTF-8 and UTF-16LE (some files showed 16-bit markers)
    let text = '';
    if (buffer[0] === 0xff && buffer[1] === 0xfe) {
        text = buffer.toString('utf16le');
    } else {
        text = buffer.toString('utf8');
    }

    text.split(/\r?\n/).forEach(line => {
        const parts = line.split(/\s+/);
        const url = parts.find(p => p.includes('myvideo.net.tw/details/3/'));
        if (url) {
            const id = url.split('/').pop().trim();
            const title = line.replace(url, '').trim();
            if (id && title) {
                fullMap.set(id, { title, url, file: n });
            }
        }
    });
}

[1, 2, 3, 4].forEach(loadFile);

console.log(`Total Unique IDs in Source: ${fullMap.size}`);

// Pre-define the 50 items with ABSOLUTELY VERIFIED IDs found in the map
const picksBySection = {
    'Sports': ['17384', '17393', '32386', '2361', '12695', '31206', '20786', '31153', '19321', '27046'],
    'Isekai': ['24227', '13562', '17235', '23246', '26203', '21049', '14640', '20885', '21011', '23245'],
    'Healing': ['18962', '4819', '6511', '2578', '17236', '12704', '12703', '31281', '22427', '23334'],
    'Suspense': ['2360', '4665', '17849', '24292', '13240', '31432', '14624', '21157', '16763', '27855'],
    'Comedy': ['21772', '32347', '31733', '27905', '5364', '14619', '5310', '21246', '24692', '13241']
};

console.log('\n--- FINAL VERIFICATION CHECK ---');
let totalErrors = 0;
const usedIds = new Set();

for (const [section, ids] of Object.entries(picksBySection)) {
    console.log(`\n[${section}]`);
    ids.forEach((id, i) => {
        const info = fullMap.get(id);
        const duplicate = usedIds.has(id);
        if (!info) {
            console.log(`❌ ${i + 1}. ID ${id} NOT FOUND IN SOURCE!`);
            totalErrors++;
        } else if (duplicate) {
            console.log(`❌ ${i + 1}. ID ${id} is a DUPLICATE! (${info.title})`);
            totalErrors++;
        } else {
            console.log(`✅ ${i + 1}. ${info.title} (${id}) [File ${info.file}]`);
            usedIds.add(id);
        }
    });
}

if (totalErrors === 0) {
    console.log('\n✨ ALL 50 LINKS VERIFIED AND UNIQUE! PROCEEDING TO V5 SCRIPT GENERATION.');
} else {
    console.log(`\n⚠️ FOUND ${totalErrors} ERRORS. FIX BEFORE PROCEEDING.`);
}
