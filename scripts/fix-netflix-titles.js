const db = require('better-sqlite3')('anime.db');

const MAPPINGS = {
    // 2023 / Recent Popular
    'Dungeon Meshi': '迷宮飯',
    'Delicious in Dungeon': '迷宮飯',
    'Sousou no Frieren': '葬送的芙莉蓮',
    'Frieren: Beyond Journey\'s End': '葬送的芙莉蓮',
    'Kusuriya no Hitorigoto': '藥师少女的獨語',
    'The Apothecary Diaries': '藥师少女的獨語',
    'Shangri-La Frontier': '香格里拉·開拓異境~糞作獵手挑戰神作~',
    'Shangri-La Frontier: Kusoge Hunter, Kamige ni Idoman to su': '香格里拉·開拓異境~糞作獵手挑戰神作~',
    'Undead Unluck': '不死不運',
    'Mashle': '肌肉魔法使-MASHLE-',
    'Mashle: Magic and Muscles': '肌肉魔法使-MASHLE-',
    'Hell\'s Paradise': '地獄樂',
    'Oshi no Ko': '【我推的孩子】',
    'Zom 100: Bucket List of the Dead': '殭屍100～在成為殭屍前要做的100件事～',
    'My Happy Marriage': '我的幸福婚約',
    'Scott Pilgrim Takes Off': '歪小子史考特：火力全開',
    'Blue Eye Samurai': '藍眼武士',
    'PLUTO': 'PLUTO 冥王',
    'Cyberpunk: Edgerunners': '賽博龐克：邊緣行者',
    'Isekai Ojisan': '異世界歸來的舅舅',
    'Uncle from Another World': '異世界歸來的舅舅',
    'JoJo no Kimyou na Bouken Part 6: Stone Ocean': 'JoJo的奇妙冒險 石之海',
    'JoJo\'s Bizarre Adventure: Stone Ocean': 'JoJo的奇妙冒險 石之海',
    'Romantic Killer': '浪漫殺手',
    'Lookism': '看臉時代',
    'Tekken: Bloodline': '鐵拳：血脈',
    'Spriggan': '遺蹟守護者',
    'Thermae Romae Novae': '羅馬浴場 NOVA',
    'Kotaro Lives Alone': '小太郎一個人生活',
    'Vampire in the Garden': '花園裡的吸血鬼',
    'Bubble': '泡泡',
    'Drifting Home': '漂流家園',
    'Exception': 'Exception',
};

function applyManualMappings() {
    console.log('Applying manual Netflix/Official translations...');

    // Select mal_id and title to check for matches
    // Since we can't reliably predict if title is in 'title' or 'title_english' or neither, 
    // we iterate all known keys and search DB.

    const findStmt = db.prepare('SELECT mal_id, title FROM anime WHERE title LIKE ? OR title LIKE ?');
    const updateStmt = db.prepare('UPDATE anime SET title_chinese = ? WHERE mal_id = ?');

    let updated = 0;

    for (const [key, value] of Object.entries(MAPPINGS)) {
        // Search by exact match or substring if needed, but exact is safer for strict mapping
        // Using LIKE for case-insensitive match
        const rows = findStmt.all(key, key);

        for (const row of rows) {
            updateStmt.run(value, row.mal_id);
            console.log(`[MANUAL FIX] [${row.mal_id}] ${row.title} -> ${value}`);
            updated++;
        }
    }

    console.log(`Manual mappings applied. Total updates: ${updated}`);
}

applyManualMappings();
