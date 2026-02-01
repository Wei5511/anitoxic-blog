/**
 * 動漫季刊 - 文章自動生成腳本 v3
 * 
 * 風格：參考 MyVideo 部落格的簡潔專業風格
 * - 純文字呈現，無 Markdown 符號
 * - 中文名稱為主
 * - 完整故事介紹
 * 
 * 使用方式:
 *   node scripts/generate-articles.js
 *   node scripts/generate-articles.js --count=2
 *   node scripts/generate-articles.js --regenerate
 */

const Database = require('better-sqlite3');
const path = require('path');

const dbPath = path.join(__dirname, '..', 'anime.db');

// 動漫中文名稱對照表（擴充版）
const chineseTitleMapping = {
    // 2026冬季熱門
    'Sousou no Frieren': '葬送的芙莉蓮',
    'Frieren': '葬送的芙莉蓮',
    'Chainsaw Man': '鏈鋸人',
    'Jujutsu Kaisen': '咒術迴戰',
    'Spy x Family': '間諜家家酒',
    'Demon Slayer': '鬼滅之刃',
    'Kimetsu no Yaiba': '鬼滅之刃',
    'Attack on Titan': '進擊的巨人',
    'Shingeki no Kyojin': '進擊的巨人',
    'One Piece': '航海王',
    'My Hero Academia': '我的英雄學院',
    'Boku no Hero': '我的英雄學院',
    'Tokyo Revengers': '東京卍復仇者',
    'Bleach': '死神 BLEACH',
    'Naruto': '火影忍者',
    'Dragon Ball': '七龍珠',
    'Death Note': '死亡筆記本',
    'Fullmetal Alchemist': '鋼之鍊金術師',
    'Sword Art Online': '刀劍神域',
    'Re:Zero': 'Re:從零開始的異世界生活',
    'Konosuba': '為美好的世界獻上祝福',
    'Overlord': 'OVERLORD 不死者之王',
    'No Game No Life': '遊戲人生',
    'Mob Psycho': '路人超能100',
    'One Punch Man': '一拳超人',
    'Hunter x Hunter': '獵人',
    'Oshi no Ko': '我推的孩子',
    'Bocchi the Rock': '孤獨搖滾！',
    'Solo Leveling': '我獨自升級',
    'Kaiju No. 8': '怪獸8號',
    'Dandadan': '膽大黨',
    'Blue Lock': '藍色監獄',
    'Undead Unluck': '不死不運',
    'Mashle': '肌肉魔法使',
    'Eminence in Shadow': '陰影中的實力者',
    'Tensura': '關於我轉生變成史萊姆這檔事',
    'Slime': '關於我轉生變成史萊姆這檔事',
    'Mushoku Tensei': '無職轉生',
    'Vinland Saga': '冰海戰記',
    'Made in Abyss': '來自深淵',
    'Dungeon Meshi': '迷宮飯',
    'Delicious in Dungeon': '迷宮飯',
    'Apothecary Diaries': '藥師少女的獨語',
    'Kusuriya no Hitorigoto': '藥師少女的獨語',
    'Ousama Ranking': '國王排名',
    'Ranking of Kings': '國王排名',
    'Wind Breaker': 'WIND BREAKER 防風少年',
    // 劇場版相關
    'Movie': '劇場版',
    'Reze': '蕾塞篇',
    // 季節標記
    '2nd Season': '第二季',
    '3rd Season': '第三季',
    'Season 2': '第二季',
    'Season 3': '第三季',
    'Part 2': '第二部',
    'Part 3': '第三部',
};

// 取得季節中文名稱
function getSeasonName(season) {
    if (!season) return '';
    const names = { winter: '冬季', spring: '春季', summer: '夏季', fall: '秋季' };
    return names[season] || '';
}

// 取得動漫中文名稱
function getChineseTitle(anime) {
    let title = anime.title;

    // 先嘗試完整對照
    for (const [eng, chi] of Object.entries(chineseTitleMapping)) {
        if (title.toLowerCase().includes(eng.toLowerCase())) {
            // 處理季節標記
            let result = chi;
            if (title.includes('2nd Season') || title.includes('Season 2')) {
                if (!result.includes('第二季')) result += ' 第二季';
            }
            if (title.includes('3rd Season') || title.includes('Season 3')) {
                if (!result.includes('第三季')) result += ' 第三季';
            }
            if (title.includes('Movie') && !result.includes('劇場版')) {
                result = '劇場版 ' + result;
            }
            return result;
        }
    }

    // 如果日文標題有中文字，使用日文標題
    if (anime.title_japanese && /[\u4e00-\u9fff]/.test(anime.title_japanese)) {
        return anime.title_japanese;
    }

    return title;
}

// 生成 MyVideo 搜尋連結
function generateMyVideoUrl(chineseTitle) {
    return `https://www.myvideo.net.tw/search?keyword=${encodeURIComponent(chineseTitle)}`;
}

// 取得故事簡介（優先使用資料庫的中文簡介，否則使用預設）
function getChineseSynopsis(anime) {
    // 如果 synopsis 是英文，返回預設描述
    if (!anime.synopsis || /^[a-zA-Z0-9\s.,!?'"()-]+$/.test(anime.synopsis.substring(0, 50))) {
        return generateDefaultSynopsis(anime);
    }
    return anime.synopsis;
}

// 生成預設故事簡介
function generateDefaultSynopsis(anime) {
    const chineseTitle = getChineseTitle(anime);
    const studios = anime.studios || '製作團隊';
    const genres = anime.genres ? anime.genres.split(', ').slice(0, 2).join('、') : '精彩';

    const templates = [
        `《${chineseTitle}》是一部${genres}題材的動畫作品，由${studios}精心製作。故事設定獨特，劇情發展引人入勝，角色塑造深刻動人，是本季不可錯過的話題作品。`,
        `由${studios}製作的《${chineseTitle}》，以其精緻的作畫品質和扣人心弦的劇情，成為本季最受矚目的動畫之一。無論是畫面表現還是故事編排，都展現了製作團隊的用心。`,
        `《${chineseTitle}》集結了${genres}等元素，在${studios}的精心製作下，呈現出極具魅力的動畫作品。精彩的故事發展和細膩的角色描寫，讓這部作品獲得觀眾的高度評價。`,
    ];

    return templates[Math.floor(Math.random() * templates.length)];
}

// 生成文章內容（純文字格式，無 Markdown 符號）
function generateArticleContent(anime) {
    const chineseTitle = getChineseTitle(anime);
    const seasonName = getSeasonName(anime.season);
    const year = anime.year || '2026';
    const studios = anime.studios || '製作團隊';
    const synopsis = getChineseSynopsis(anime);

    let content = '';

    // 播出資訊
    const broadcastInfo = [];
    if (seasonName) broadcastInfo.push(`${year}年${seasonName}新番`);
    if (anime.episodes) broadcastInfo.push(`全${anime.episodes}集`);
    if (anime.source) broadcastInfo.push(`改編自${anime.source}`);

    if (broadcastInfo.length > 0) {
        content += broadcastInfo.join(' / ') + '\n\n';
    }

    // 故事介紹
    content += synopsis + '\n\n';

    // 評分資訊
    if (anime.score) {
        if (anime.score >= 8.5) {
            content += `本作目前評分高達 ${anime.score.toFixed(1)} 分，是本季評價最高的作品之一，深受動漫迷們的喜愛與推薦。\n\n`;
        } else if (anime.score >= 7.5) {
            content += `本作目前評分 ${anime.score.toFixed(1)} 分，獲得觀眾相當不錯的評價，值得一看。\n\n`;
        }
    }

    // 製作資訊
    if (anime.genres) {
        content += `類型：${anime.genres}\n`;
    }
    content += `製作公司：${studios}\n\n`;

    // 觀看資訊
    content += `想要收看《${chineseTitle}》的觀眾，可以前往 MyVideo 等正版串流平台觀賞，支持正版讓優質動畫持續製作！`;

    return content;
}

// 生成文章標題
function generateArticleTitle(anime) {
    const chineseTitle = getChineseTitle(anime);
    const seasonName = getSeasonName(anime.season);
    const year = anime.year || '2026';

    if (seasonName) {
        const templates = [
            `${year}年${seasonName}新番推薦：《${chineseTitle}》`,
            `《${chineseTitle}》${year}${seasonName}動畫介紹`,
            `${seasonName}必追動漫：《${chineseTitle}》完整介紹`,
        ];
        return templates[Math.floor(Math.random() * templates.length)];
    } else {
        return `動漫推薦：《${chineseTitle}》完整介紹`;
    }
}

// 生成摘要
function generateExcerpt(anime) {
    const chineseTitle = getChineseTitle(anime);
    const synopsis = getChineseSynopsis(anime);

    // 取前100字作為摘要
    if (synopsis.length > 100) {
        return synopsis.substring(0, 100) + '...';
    }
    return synopsis;
}

async function main() {
    console.log('======================================');
    console.log('動漫季刊 - 文章自動生成 v3');
    console.log('風格：MyVideo 部落格風格');
    console.log(`執行時間: ${new Date().toLocaleString('zh-TW')}`);
    console.log('======================================\n');

    // 解析參數
    const args = process.argv.slice(2);
    let count = 2;
    let regenerate = false;

    for (const arg of args) {
        if (arg.startsWith('--count=')) {
            count = parseInt(arg.split('=')[1]) || 2;
        }
        if (arg === '--regenerate') {
            regenerate = true;
        }
    }

    // 開啟資料庫
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');

    // 確保 articles 資料表存在
    db.exec(`
    CREATE TABLE IF NOT EXISTS articles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      anime_id INTEGER,
      title TEXT NOT NULL,
      excerpt TEXT,
      content TEXT NOT NULL,
      image_url TEXT,
      trailer_url TEXT,
      myvideo_url TEXT,
      anime_title TEXT,
      category TEXT DEFAULT '動漫推薦',
      published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (anime_id) REFERENCES anime(mal_id)
    );
  `);

    if (regenerate) {
        console.log('正在刪除現有文章...');
        db.exec('DELETE FROM articles');
        console.log('已清除所有文章\n');
    }

    // 取得還沒寫過文章的動漫
    const existingArticleIds = db.prepare('SELECT anime_id FROM articles').all().map(a => a.anime_id);

    let animeList = db.prepare(`
    SELECT * FROM anime 
    WHERE score IS NOT NULL 
    ORDER BY score DESC
  `).all();

    animeList = animeList.filter(a => !existingArticleIds.includes(a.mal_id));

    if (animeList.length === 0) {
        console.log('所有動漫都已經有文章了！');
        console.log('提示：使用 --regenerate 參數可以重新生成所有文章');
        db.close();
        return;
    }

    console.log(`找到 ${animeList.length} 部還沒有文章的動漫\n`);

    const stmt = db.prepare(`
    INSERT INTO articles (anime_id, title, excerpt, content, image_url, trailer_url, myvideo_url, anime_title, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

    const articlesToGenerate = Math.min(count, animeList.length);

    for (let i = 0; i < articlesToGenerate; i++) {
        const anime = animeList[i];
        const chineseTitle = getChineseTitle(anime);

        const articleTitle = generateArticleTitle(anime);
        const excerpt = generateExcerpt(anime);
        const content = generateArticleContent(anime);
        const myvideoUrl = generateMyVideoUrl(chineseTitle);

        try {
            stmt.run(
                anime.mal_id,
                articleTitle,
                excerpt,
                content,
                anime.image_url,
                anime.trailer_url,
                myvideoUrl,
                chineseTitle,
                '新番推薦'
            );

            console.log(`✅ 已生成文章: ${articleTitle}`);
            console.log(`   中文名稱: ${chineseTitle}`);
            console.log(`   原始名稱: ${anime.title}`);
            console.log(`   評分: ${anime.score || 'N/A'}`);
            console.log(`   MyVideo: ${myvideoUrl}\n`);
        } catch (error) {
            console.error(`❌ 生成文章失敗: ${anime.title}`, error.message);
        }
    }

    const totalArticles = db.prepare('SELECT COUNT(*) as count FROM articles').get().count;

    console.log('======================================');
    console.log('生成完成！');
    console.log(`本次生成: ${articlesToGenerate} 篇文章`);
    console.log(`文章總數: ${totalArticles} 篇`);
    console.log('======================================\n');

    db.close();
}

main().catch(console.error);
