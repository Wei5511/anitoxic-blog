/**
 * FIX ROMANCE PICKS V2 (Article 17)
 * 
 * Objectives:
 * 1. Revert button style to centered small orange button (User request: "Cancel large button").
 * 2. Fix Honey Lemon Soda title to "青春特調蜂蜜檸檬蘇打" and ensure valid image.
 * 3. Use direct MyVideo links where known (Yamada-kun, Dangers in My Heart) and explain others.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const Database = require('better-sqlite3');

const dbPath = path.join(__dirname, '..', 'anime.db');
const imageDir = path.join(__dirname, '..', 'public', 'images', 'anime');
const db = new Database(dbPath);

console.log('🚀 Fixing Romance Picks V2 (Buttons, Title, Links)...');

// --- Image Logic ---
async function downloadImage(query, filename) {
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=1`;
    console.log(`🔍 Searching Image for: ${query}...`);

    return new Promise((resolve) => {
        https.get(url, { headers: { 'User-Agent': 'Bot' } }, res => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    const json = JSON.parse(data);
                    if (json.data && json.data.length > 0) {
                        const img = json.data[0].images.jpg.large_image_url;
                        const file = fs.createWriteStream(path.join(imageDir, filename));
                        https.get(img, r => r.pipe(file).on('finish', () => {
                            console.log(`💾 Downloaded: ${filename}`);
                            resolve(true);
                        }));
                    } else {
                        console.log(`❌ No image found for ${query}`);
                        resolve(false);
                    }
                } catch (e) { resolve(false); }
            });
        }).on('error', () => resolve(false));
    });
}

// --- Content Generation ---
function getBtn(url) {
    if (!url) return '';
    // Reverting to the small orange button style as requested
    // Format matches RenderMarkdown.js: <a href="..." class="btn-orange-small" target="_blank">...</a>
    // We will center it via wrapper in RenderMarkdown (which we already added) or ensure newlines
    return `\n\n<a href="${url}" class="btn-orange-small" target="_blank">立即觀看</a>\n\n`;
}

const romanceItems = [
    {
        title: '1. 相反的你和我',
        img: '/images/anime/polar-opposites.jpg',
        url: 'https://www.myvideo.net.tw/search/相反的你和我', // Search link
        content: `在這部充滿活力的校園戀愛喜劇中... (略)`
    },
    {
        title: '2. 花樣少年少女',
        img: '/images/anime/hana-kimi.jpg',
        url: 'https://www.myvideo.net.tw/search/花樣少年少女', // Search link
        content: `作為少女漫畫界的殿堂級作品... (略)`
    },
    {
        title: '3. 青春特調蜂蜜檸檬蘇打', // FIXED TITLE
        img: '/images/anime/honey-lemon.jpg',
        url: 'https://www.myvideo.net.tw/search/青春特調蜂蜜檸檬蘇打', // Search link
        content: `被稱為「石頭」的內向少女石森羽花... (略)`
    },
    {
        title: '4. 輝夜姬想讓人告白～天才們的戀愛頭腦戰～',
        img: '/images/anime/kaguya.jpg',
        url: 'https://www.myvideo.net.tw/search/輝夜姬', // Search link
        content: `在這所匯集了菁英的秀知院學園... (略)`
    },
    {
        title: '5. 和山田談場Lv999的戀愛',
        img: '/images/anime/yamada-kun.jpg',
        url: 'https://www.myvideo.net.tw/details/3/23210', // DIRECT LINK FOUND!
        content: `剛被男友劈腿而失戀的大學生茜... (略)`
    },
    {
        title: '6. 堀與宮村',
        img: '/images/anime/horimiya.jpg',
        url: 'https://www.myvideo.net.tw/search/堀與宮村', // Search link
        content: `在學校是時髦人氣王... (略)`
    },
    {
        title: '7. 戀上換裝娃娃',
        img: '/images/anime/dress-up-darling.jpg',
        url: 'https://www.myvideo.net.tw/search/戀上換裝娃娃', // Search link
        content: `夢想成為「女兒節娃娃工匠」的五條新菜... (略)`
    },
    {
        title: '8. 我內心的糟糕念頭',
        img: '/images/anime/dangers-heart.jpg',
        url: 'https://www.myvideo.net.tw/details/0/327702', // DIRECT LINK FOUND!
        content: `個性陰沉、總是在腦中幻想殺人情節的中二病少年... (略)`
    },
    {
        title: '9. 知道天空有多藍的人啊',
        img: '/images/anime/her-blue-sky.jpg',
        url: 'https://www.myvideo.net.tw/search/天空', // Search link
        content: `這是一部關於「夢想」與「第二次初戀」的故事... (略)`
    },
    {
        title: '10. 櫻蘭高校男公關部',
        img: '/images/anime/ouran.jpg',
        url: 'https://www.myvideo.net.tw/search/櫻蘭', // Search link
        content: `既然提到了《花樣少年少女》... (略)`
    }
];

// Re-fetch original content texts because I truncated them above for brevity in this script file, 
// BUT to ensure I don't lose the text, I should read from DB or just paste the text again.
// To be safe and concise, I will read the current content and parse it? No, that's messy HTML/Markdown mix.
// I will just PASTE the full text again. It's safer.

// ... Full text restoration ...
romanceItems[0].content = `在這部充滿活力的校園戀愛喜劇中，平時總是察言觀色的「辣妹」鈴木美優，與沈默寡言的「書呆子」谷悠介意外走在了一起。起初看似毫無交集的兩條平行線，卻因為鄰座的緣分而產生了化學反應。美優被谷在那副嚴肅眼鏡下隱藏的溫柔所吸引，而谷也看見了美優在隨波逐流背後的真實與可愛。\n\n本作最大的亮點在於角色之間「直球式」的溝通。不同於那些充滿誤會與糾結的胃痛番，美優與谷在意識到自己的心意後，總是試著真誠地向對方表達。無論是笨拙的邀約，還是在走廊上羞澀的對視，每一個細節都充滿了青春的酸甜氣息。這是一部看了會讓人不自覺嘴角上揚，想要談一場簡單而純粹戀愛的治癒佳作。`;
romanceItems[1].content = `作為少女漫畫界的殿堂級作品，《花樣少年少女》的動畫化無疑是圓了無數老粉的夢。故事講述了在美國長大的日本僑生蘆屋瑞稀，為了鼓勵受傷放棄跳高的偶像佐野泉，毅然決然剪去長髮，女扮男裝潛入全是帥哥的男校——櫻咲學園就讀。\n\n在充滿荷爾蒙的男校生活中，瑞稀不僅要小心翼翼地隱藏自己的性別，還要應對各種突發狀況與個性鮮明的同學們：活潑單純的中津秀一、花花公子難波南、甚至是能够看到靈異現象的萱島大樹。而她與佐野之間那種「友達以上，戀人未滿」的微妙關係，更是全劇的核心。動畫版完美還原了原作華麗的畫風與青春氣息，聲優陣容更是豪華，絕對是一場視聽盛宴。`;
romanceItems[2].content = `被稱為「石頭」的內向少女石森羽花，為了改變自己，選擇進入了自由校風的高中。在那裡，她遇見了染著一頭檸檬色頭髮、外表看似難以接近但其實非常受歡迎的三浦界。對於羽花來說，界就像是汽水般清爽的存在，是他給予了她踏出改變第一步的勇氣。\n\n這是一部關於「救贖」與「成長」的王道少女漫。界雖然外表冷淡，但總是在羽花最無助的時候伸出援手，而羽花也用她的真誠與努力慢慢融化了界內心的偽裝。兩人互相扶持、共同成長的過程描寫得細膩動人。隨著劇情的推進，我們將看到羽花從一個自卑的女孩蛻變成能夠自信微笑的模樣，這種正向的轉變讓人深受感動。`;
romanceItems[3].content = `在這所匯集了菁英的秀知院學園，學生會會長白銀御行與副會長四宮輝夜，明明彼此兩情相悅，卻因為過高的自尊心而不願先開口告白！為了讓對方先說出「喜歡」二字，這兩位天才展開了一場場賭上智商與尊嚴的戀愛頭腦戰。\n\n本作將「傲嬌」屬性發揮到了極致，並巧妙地結合了心理戰與喜劇元素。觀眾將看著這兩位在學業上無所不能的天才，在戀愛這門學分上卻笨拙得可愛。動畫製作組投入了極大的熱情，從瘋狂的運鏡到高水準的作畫，以及那魔性的旁白，都讓這部作品成為了戀愛喜劇的天花板。此外，學生會其他成員如書記藤原千花的加入，更是為這場戰爭增添了無數笑料。`;
romanceItems[4].content = `剛被男友劈腿而失戀的大學生茜，為了發洩情緒而在網路遊戲中狩獵魔物，卻意外遇到了一位裝備超強但態度冷淡的高中生玩家——山田。原本只是單純的公會夥伴關係，卻因為一次線下活動而有了現實中的交集。\n\n本作精準地捕捉了現代網遊世代的戀愛模式。茜的直率與成熟，與山田的冷靜與青澀形成了絕妙的對比。看著這位對戀愛一竅不通的「絕食系男子」山田，是如何一步步被茜的溫暖所攻略，絕對會讓螢幕前的觀眾心動不已。故事中對於線上遊戲社群的描寫也非常寫實，讓人不禁回想起自己在遊戲中與朋友們熬夜練功、聊天的美好時光。`;
romanceItems[5].content = `在學校是時髦人氣王、在家卻是負責照顧弟弟的家庭主婦堀京子，與在學校是陰沉宅男、私底下卻是穿滿耳洞與刺青的帥哥宮村伊澄。這兩個擁有反差秘密的人，因為某個契機而在校外相遇，並約定保守彼此的秘密。\n\n《堀與宮村》是一部沒有反派、沒有狗血誤會的純愛群像劇。它細膩地描繪了高中生們在友情、愛情以及自我認同上的迷惘與成長。宮村因為堀的接納而逐漸打開心房，原本黑白的世界開始染上色彩；而堀也因為宮村的存在而找到了可以撒嬌的港灣。除了男女主角外，本作對於配角們的感情線描寫也相當深入，每一個角色都立體且討喜。`;
romanceItems[6].content = `夢想成為「女兒節娃娃工匠」的五條新菜，因為興趣與同齡人格格不入而總是獨來獨往。直到某天，班上的超人氣辣妹喜多川海夢發現了他製作服裝的才能，並請求他幫忙製作 Cosplay 服裝。兩個世界完全不同的人，因為對「喜愛事物」的熱情而連結在了一起。\n\n這部作品不僅僅是賣弄福利的後宮番，它對於「職人精神」與「Cosplay 文化」有著極為認真的考究與尊重。看著新菜為了做出完美的服裝而廢寢忘食，以及海夢在扮演角色時展現出的自信與快樂，觀眾會被這份純粹的熱愛所感動。當然，兩人在量尺寸、逛布料店的過程中，那種若有似無的曖昧互動，更是讓整部作品充滿了粉紅色的泡泡。`;
romanceItems[7].content = `個性陰沉、總是在腦中幻想殺人情節的中二病少年市川京太郎，卻意外發現了班上的校園女神山田杏奈不為人知的一面——她其實是個貪吃又天然呆的女孩。京太郎從一開始的想「殺死」她，變成了想「守護」她，這段地位懸殊的格差戀愛就此展開。\n\n這是近年來描寫「少年成長」最細膩的戀愛番之一。作者對於青春期男生那種自卑、敏感卻又渴望被理解的心理刻畫得入木三分。隨著劇情的發展，我們看到京太郎為了配得上山田而努力改變自己，從髮型、穿著到與人相處的態度。而山田那大膽又直球的攻勢，也讓這段關係充滿了令人窒息的甜蜜感。每一個眼神交流、每一次不經意的觸碰，都被描繪得無比動人。`;
romanceItems[8].content = `這是一部關於「夢想」與「第二次初戀」的故事。居住在群山環繞小鎮的高中生相生葵，每天都在為了能夠去東京發展音樂事業而練習貝斯。然而，曾經是姊姊戀人、為了追夢去東京卻音訊全無的吉他手慎之介，卻突然回到了小鎮。與此同時，13年前那個還在讀高中、滿懷夢想的「慎之」生靈也出現在了葵的面前。\n\n作為「秩父三部曲」的最終章，本作延續了岡田麿里一貫的胃痛與感動。當「現實中被生活磨平稜角的大人」遇上「過去那個還懷抱無限可能的自己」，兩者之間的對話充滿了殘酷的現實感。葵在與兩個慎之介的相處中，逐漸理解了姊姊的犧牲與大人的無奈。這部作品用音樂串起了過去與未來，提醒我們無論天空有多高，都不要忘記仰望那份曾經的湛藍。`;
romanceItems[9].content = `既然提到了《花樣少年少女》，就不能不提這部同樣是逆後宮題材的經典之作。庶民資優生藤岡哈希，因為打破了價值連城的花瓶，被迫加入以須王環為首的「男公關部」還債。在一群家世顯赫、性格古怪的富家少爺包圍下，哈希展開了她不可思議的校園生活。\n\n這是一部將「吐槽」與「華麗」完美結合的喜劇。每一個男公關成員都有著鮮明的角色屬性：天然呆王子、腹黑眼鏡、雙胞胎惡魔、正太甜心以及沈默野性男。他們看似玩世不恭，其實每個人背後都有著溫柔或辛酸的故事。本作在搞笑之餘，也探討了階級差距、性別認同以及家庭關係等議題。當然，看著哈希如何用她的平民智慧攻略這些不知人間疾苦的大少爺們，本身就是一大樂趣。`;

async function update() {
    // 1. Download correct Honey Lemon Soda image (Anime or Movie visual)
    await downloadImage('Honey Lemon Soda', 'honey-lemon.jpg');

    // 2. Build content
    let fullContent = `愛情總是能治癒人心，特別是那些描寫細膩、情感真摯的優秀作品。本季我們為大家盤點了 10 部風格截然不同的戀愛動畫，從青春校園的酸甜初戀，到成人世界的成熟浪漫，每一部都能喚醒你沉睡已久的少女（或少男）心。\n\n`;

    for (const item of romanceItems) {
        fullContent += `## ${item.title}\n`;
        fullContent += `![${item.title.split('. ')[1]}](${item.img})\n`;
        fullContent += `${item.content}`;
        fullContent += getBtn(item.url);
        fullContent += `\n---\n\n`;
    }

    // 3. Update DB
    const updateStmt = db.prepare('UPDATE articles SET content = ? WHERE id = 17');
    const info = updateStmt.run(fullContent);
    console.log(`✅ Updated Article 17 (V2 Fixes) with ${info.changes} change.`);
}

update();
