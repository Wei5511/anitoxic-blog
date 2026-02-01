const fs = require('fs');
const path = require('path');
const https = require('https');
const Database = require('better-sqlite3');
const db = new Database('anime.db');

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'picks');
if (!fs.existsSync(ASSETS_DIR)) fs.mkdirSync(ASSETS_DIR, { recursive: true });

// Standard button HTML - DO NOT CHANGE
const BUTTON_HTML = (url) => `<a href="${url}" class="btn-orange-small" target="_blank">前往MyVideo線上觀看</a>`;

// Delay helper
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Download image helper
function downloadImage(url, filename) {
    return new Promise((resolve, reject) => {
        const filepath = path.join(ASSETS_DIR, filename);
        const file = fs.createWriteStream(filepath);
        https.get(url, (response) => {
            response.pipe(file);
            file.on('finish', () => {
                file.close();
                resolve(`/assets/picks/${filename}`);
            });
        }).on('error', (err) => {
            fs.unlink(filepath, () => { });
            reject(err);
        });
    });
}

// Jikan Search helper
async function getAnimeImage(title) {
    try {
        console.log(`  Searching Jikan for: ${title}`);
        await delay(1200); // Rate limit
        const searchUrl = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(title)}&limit=1`;

        return new Promise((resolve, reject) => {
            https.get(searchUrl, (res) => {
                let data = '';
                res.on('data', chunk => data += chunk);
                res.on('end', () => {
                    try {
                        const json = JSON.parse(data);
                        if (json.data && json.data.length > 0) {
                            resolve(json.data[0].images.jpg.large_image_url);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        resolve(null);
                    }
                });
            }).on('error', (e) => resolve(null));
        });
    } catch (e) {
        return null;
    }
}

// Data Definition
const articles = [
    {
        title: '【編輯精選】5部雖然冷門但絕對好看的運動番推薦',
        slug: 'sports-picks-top5',
        intro: '除了《灌籃高手》和《排球少年》，還有很多優秀的運動動畫值得一看！這裡精選了5部或許你錯過的熱血佳作。',
        items: [
            { title: '強風吹拂', url: 'https://www.myvideo.net.tw/details/3/17384', desc: '這不是關於跑步的故事，而是關於如何在逆風中奔跑。10個性格迥異的大學生，為了箱根驛傳這個看似不可能的夢想而集結。沒有超能力，只有汗水、傷痛與真實的自我超越。' },
            { title: '足球風雲！Goal to the Future', url: 'https://www.myvideo.net.tw/details/3/20786', desc: '經典作品的現代續篇！當過去的傳奇遇上現代的足球少年，會擦出什麼樣的火花？對於老粉絲來說是情懷，對於新觀眾來說則是熱血的傳承。' },
            { title: '網球王子', url: 'https://www.myvideo.net.tw/details/3/31153', desc: '還需要多做介紹嗎？殺人網球的始祖！雖然現在看來充滿了超現實的招式，但那種「還差得遠呢」的自信與帥氣，依然是無可取代的經典。' },
            { title: '白領羽球部', url: 'https://www.myvideo.net.tw/details/3/19321', desc: '社畜與運動員的雙重生活！描寫成年人在工作與夢想之間的平衡，比一般校園運動番多了一份現實的重量與成熟的魅力。' },
            { title: '蜻蛉高球', url: 'https://www.myvideo.net.tw/details/3/27046', desc: '在高爾夫這個看似優雅的運動中，隱藏著原始的野性與天賦。看著主角如何用本能去征服球場，是一種純粹的享受。' }
        ]
    },
    {
        title: '【編輯精選】異世界轉生看膩了？這5部絕對讓你耳目一新',
        slug: 'isekai-picks-unique',
        intro: '異世界題材氾濫，但這幾部作品用獨特的切入點打破了套路！',
        items: [
            { title: '轉生賢者的異世界生活', url: 'https://www.myvideo.net.tw/details/3/21049', desc: '不僅是無雙，更是連史萊姆都能變成最強戰力的故事！看著主角一臉淡定地用外掛解決世界危機，有種說不出的舒壓感。' },
            { title: '轉生成蜘蛛又怎樣！', url: 'https://www.myvideo.net.tw/details/3/14640', desc: '轉生成魔物已經不稀奇，但轉生成最弱小的蜘蛛？女主單口相聲般的內心戲與極限求生的緊張感完美融合，絕對是異世界中的異類！' },
            { title: '異世界藥局', url: 'https://www.myvideo.net.tw/details/3/20885', desc: '不靠魔法轟炸，而是靠現代醫學知識拯救異世界！在充滿魔法的世界裡講究科學與藥理，展現了知識就是力量的真諦。' },
            { title: '異世界迷宮裡的後宮生活', url: 'https://www.myvideo.net.tw/details/3/21011', desc: '雖然標題聽起來很勸退，但其實意外地硬核？對於迷宮探索、裝備獲取以及在這個殘酷世界生存的描寫相當細膩。' },
            { title: '轉生貴族的異世界冒險錄', url: 'https://www.myvideo.net.tw/details/3/23245', desc: '標準的爽番配置，但爽得恰到好處！看著主角被神眷顧到過頭，無意間破壞常識的日常，是放鬆大腦的最佳選擇。' }
        ]
    },
    {
        title: '【編輯精選】生活太累？5部治癒系動畫幫你充電',
        slug: 'healing-picks-relax',
        intro: '放慢腳步，感受生活中的微小幸福。這些作品是給靈魂的熱湯。',
        items: [
            { title: '比宇宙更遠的地方', url: 'https://www.myvideo.net.tw/details/3/12704', desc: '「青春」的代名詞！四個女高中生為了去南極而踏上旅程。那種不顧一切追逐夢想的耀眼光芒，會讓你想起自己曾經也有過的衝動。準備好紙巾，這是一趟會讓你淚流滿面的旅程。' },
            { title: '房間露營△', url: 'https://www.myvideo.net.tw/details/3/12703', desc: '雖然只是短篇，但《搖曳露營》的精髓一點都沒少！看著她們在社辦裡胡鬧、幻想露營的樣子，瞬間就能忘記工作的煩惱。' },
            { title: '雙人單身露營', url: 'https://www.myvideo.net.tw/details/3/31281', desc: '不同於一群人的熱鬧，這部作品展現了「獨處」與「共處」的微妙平衡。兩個喜歡獨自露營的人，如何在保持距離的同時互相尊重，是一種成熟的大人式浪漫。' },
            { title: '異世界悠閒農家', url: 'https://www.myvideo.net.tw/details/3/22427', desc: '在異世界從零開始打造農場！沒有魔王要打，只有種田、蓋房子、解決村民的民生問題。看著村莊一點點繁榮起來，有種玩模擬經營遊戲的成就感。' },
            { title: '名湯「異世界溫泉」開拓記', url: 'https://www.myvideo.net.tw/details/3/26203', desc: '溫泉就是正義！不管是人類還是異種族，在溫暖的泉水面前都是平等的。一部充滿熱氣與和諧的放鬆番。' }
        ]
    },
    {
        title: '【編輯精選】燒腦神作！5部讓你停不下來的懸疑動畫',
        slug: 'suspense-picks-thriller',
        intro: '猜不到的結局，反轉再反轉的劇情。請確保你有足夠的時間，因為一旦開始就停不下來！',
        items: [
            { title: '朋友遊戲', url: 'https://www.myvideo.net.tw/details/3/31432', desc: '友情在金錢面前值多少錢？一場考驗人性的殘酷遊戲，揭露了每個人心中最黑暗的秘密。看著主角如何用瘋狂的邏輯玩弄這場遊戲，令人不寒而慄。' },
            { title: '怪物事變', url: 'https://www.myvideo.net.tw/details/3/14624', desc: '雖然是妖怪題材，但探討的卻是關於「歸屬」與「身分」的深刻議題。在尋找父母的過程中，主角們面對的不只是怪物，還有醜惡的人心。' },
            { title: '風都偵探', url: 'https://www.myvideo.net.tw/details/3/21157', desc: '《假面騎士W》的正統續篇！如果你喜歡硬漢偵探風格與超能力犯罪的結合，這部絕對不能錯過。作畫精良，動作場面流暢，即便沒看過特攝版也能享受其中。' },
            { title: '偵探已經，死了。', url: 'https://www.myvideo.net.tw/details/3/16763', desc: '標題即是劇透，也是謎題的開始。在名偵探死去後，身為助手的男主角該如何面對留下的謎團與新的挑戰？這是一個關於失去與繼承的故事。' },
            { title: '異世界自殺突擊隊', url: 'https://www.myvideo.net.tw/details/3/27855', desc: 'DC反派穿越異世界？這本身就是個瘋狂的點子！小丑女哈莉·奎茵在這個充滿劍與魔法的世界裡依然瘋癲。動作戲爽快，美術風格獨特，是一場視覺盛宴。' }
        ]
    },
    {
        title: '【編輯精選】笑出腹肌！5部紓壓必看的搞笑動畫',
        slug: 'comedy-picks-lol',
        intro: '生活太苦悶？需要一點笑聲來拯救？點開這幾部，保證讓你笑到鄰居來敲門。',
        items: [
            { title: '孤獨搖滾！', url: 'https://www.myvideo.net.tw/details/3/21772', desc: '雖然主角有社交恐懼症，但她的內心戲和顏藝絕對是奧斯卡等級！把陰鬱的性格變成笑點，同時用頂級的音樂演出燃爆全場，這就是波奇醬的魅力。' },
            { title: '輝夜姬想讓人告白？', url: 'https://www.myvideo.net.tw/details/3/32347', desc: '戀愛就是戰爭！兩個高傲的天才為了讓對方先告白，無所不用其極。明明是雙向暗戀，卻能搞得像諜報片一樣緊張刺激又好笑。' },
            { title: '銀魂', url: 'https://www.myvideo.net.tw/details/3/31733', desc: '吐槽系的頂點，毫無下限的惡搞！不管是想看熱血戰鬥還是感人故事，或者是單純的低級笑話，《銀魂》全都能滿足你。' },
            { title: '鹿乃子乃子乃子虎視眈眈', url: 'https://www.myvideo.net.tw/details/3/27905', desc: '這在演什麼？不要問，去感受！充滿了魔性與混沌的新番，大腦放空觀看的最佳選擇。小心那些鹿，牠們無所不在。' },
            { title: '肌肉魔法使', url: 'https://www.myvideo.net.tw/search/肌肉魔法使', desc: '在這個魔法至上的世界，主角選擇用肌肉解決一切！各種物理破防的橋段讓人笑到噴飯。哈利波特的世界觀加上<strong>一拳超人</strong>的設定，你說這怎麼輸？' }
        ]
    }
];

// Execution
(async () => {
    try {
        console.log('🚀 Generating 5 New Editor\'s Pick Articles...');

        // Prepare INSERT statement
        const insertStmt = db.prepare(`
            INSERT INTO articles (title, content, category, slug, published_at, image_url)
            VALUES (?, ?, ?, ?, ?, ?)
        `);

        for (const article of articles) {
            console.log(`\n📄 Processing: ${article.title}`);
            let contentMarkdown = `${article.intro}\n\n`;

            let firstImage = '';

            for (const [index, item] of article.items.entries()) {
                console.log(`  > Item ${index + 1}: ${item.title}`);

                // Download Image
                const imageUrl = await getAnimeImage(item.title);
                let localImagePath = '';

                if (imageUrl) {
                    try {
                        const filename = `pick_${article.slug}_${index + 1}.jpg`;
                        localImagePath = await downloadImage(imageUrl, filename);
                        console.log(`    Image saved: ${localImagePath}`);
                        if (index === 0) firstImage = localImagePath;
                    } catch (e) {
                        console.error('    Image download failed:', e.message);
                    }
                } else {
                    console.warn('    No image found on Jikan.');
                }

                // Create Section Markdown
                contentMarkdown += `## ${index + 1}. ${item.title}\n\n`;
                if (localImagePath) {
                    contentMarkdown += `![${item.title}](${localImagePath})\n\n`;
                }
                contentMarkdown += `${item.desc}\n\n`;
                contentMarkdown += `${BUTTON_HTML(item.url)}\n\n`;
                contentMarkdown += `---\n\n`;
            }

            // Insert into DB
            try {
                const today = new Date().toISOString().split('T')[0];
                const views = Math.floor(Math.random() * 5000) + 500;

                // Check if exists
                const existing = db.prepare('SELECT id FROM articles WHERE slug = ?').get(article.slug);
                if (existing) {
                    console.log(`  ⚠️ Article ${article.slug} already exists. Skipping insertion.`);
                } else {
                    insertStmt.run(article.title, contentMarkdown, '編輯精選', article.slug, today, firstImage || '/assets/placeholder.jpg');
                    console.log(`  ✅ Inserted article: ${article.title}`);
                }
            } catch (e) {
                console.error(`  ❌ Failed to insert article: ${e.message}`);
            }
        }

        console.log('\n🎉 All articles generated successfully!');
    } catch (err) {
        console.error('\n💥 FATAL ERROR:', err);
    }
})();
