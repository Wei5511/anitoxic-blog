const fs = require('fs');
const path = require('path');

// The 50 items we intended to use (simplified structure for checking)
const candidates = {
    'Sports': ['強風吹拂', '排球少年', '藍色監獄', '黑子的籃球', '鑽石王牌', '飆速宅男', '足球風雲', '網球王子', '白領羽球部', '蜻蛉高球'],
    'Isekai': ['無職轉生', '從零開始的異世界生活', '轉生變成史萊姆', '為美好的世界獻上祝福', '異世界歸來的舅舅', '轉生賢者的異世界生活', '轉生成蜘蛛又怎樣', '異世界藥局', '異世界迷宮裡的後宮生活', '轉生貴族的異世界冒險錄'],
    'Healing': ['葬送的芙莉蓮', '夏目友人帳', '水星領航員', '飛翔的魔女', '間諜家家酒', '比宇宙更遠的地方', '房間露營', '雙人單身露營', '異世界悠閒農家', '異世界溫泉'],
    'Suspense': ['進擊的巨人', '命運石之門', '夏日重現', '藥師少女的獨語', '咒術迴戰', '朋友遊戲', '怪物事變', '風都偵探', '偵探已經，死了', '異世界自殺突擊隊'],
    'Comedy': ['孤獨搖滾', '輝夜姬想讓人告白', '銀魂', '鹿乃子乃子乃子虎視眈眈', '肌肉魔法使', '齊木楠雄', '月刊少女野崎同學', '遊戲3人娘', '碧藍之海', '間諜家家酒']
};

// Load all user URLs
let urlMap = new Map();

// Helper to clean titles for fuzzy matching
const clean = (t) => t.replace(/[！!～~。，,\s]/g, '').toLowerCase();

// Read files
[1, 2, 3, 4].forEach(n => {
    const content = fs.readFileSync(path.join(__dirname, `user_urls_${n}.txt`), 'utf8');
    content.split('\n').forEach(line => {
        const parts = line.split('\t');
        if (parts.length >= 2) {
            const title = parts[0].trim();
            const url = parts[1].trim();
            if (url.includes('/details/')) { // Only accept DIRECT links
                // Store shortest title match or prefer full match?
                // Multiple entries might exist (S1, S2). We prefer S1 usually.
                // Naive approach: Store all, overwrite is fine, but we might want to prioritize specific ones.
                // Let's just store exact title key first.
                urlMap.set(title, url);

                // Also store cleaned key
                urlMap.set(clean(title), url);
            }
        }
    });
});

console.log(`Loaded ${urlMap.size} valid direct links.`);

// Check candidates
const corrections = {};
const missing = [];

Object.keys(candidates).forEach(cat => {
    console.log(`\nChecking ${cat}...`);
    candidates[cat].forEach(t => {
        let url = urlMap.get(t);
        if (!url) url = urlMap.get(clean(t));

        // Try partial match if exact failed
        if (!url) {
            for (const [k, v] of urlMap.entries()) {
                if (k.includes(clean(t)) || clean(t).includes(k)) {
                    // Primitive fuzzy: if one contains the other
                    // But be careful of false positives.
                    // Let's print potential matches for manual selection if needed, 
                    // but for this script let's just mark missing.
                }
            }
        }

        if (url) {
            console.log(`✅ ${t} -> ${url}`);
            corrections[t] = url;
        } else {
            console.log(`❌ ${t} -> MISSING`);
            missing.push({ cat, t });
        }
    });
});

console.log('\n--- SUMMARY ---');
console.log('MISSING OR NO DIRECT LINK:');
missing.forEach(m => console.log(`[${m.cat}] ${m.t}`));

console.log('\n--- POTENTIAL SUBSTITUTES (Searching for same category) ---');
// Try to find substitutes in the map for specific keywords
const keywords = {
    'Sports': ['球', '運動', '賽跑', '競'],
    'Isekai': ['轉生', '異世界'],
    'Healing': ['露營', '日常', '治癒', '悠閒'],
    'Suspense': ['偵探', '推理', '懸疑'],
    'Comedy': ['搞笑', '喜劇']
};

missing.forEach(m => {
    console.log(`\nSuggestions for ${m.t} (${m.cat}):`);
    let count = 0;
    for (const [title, url] of urlMap.entries()) {
        if (count > 5) break;
        const kws = keywords[m.cat] || [];
        for (const k of kws) {
            if (title.includes(k) && !Object.values(corrections).includes(url)) { // Don't suggest used ones
                console.log(`  - ${title}: ${url}`);
                count++;
                break;
            }
        }
    }
});
