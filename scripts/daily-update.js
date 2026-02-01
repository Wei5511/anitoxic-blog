/**
 * 動漫季刊 - 每日自動更新腳本
 * 
 * 此腳本用於每日自動從 Jikan API 取得最新動漫資料
 * 可透過 Windows Task Scheduler 或 node-cron 執行
 * 
 * 使用方式:
 *   node scripts/daily-update.js
 * 
 * 設定 Windows Task Scheduler:
 *   1. 開啟「工作排程器」
 *   2. 建立基本工作
 *   3. 設定每日執行
 *   4. 動作設為: node C:\path\to\anime-blog\scripts\daily-update.js
 */

const axios = require('axios');
const Database = require('better-sqlite3');
const path = require('path');

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';
const dbPath = path.join(__dirname, '..', 'anime.db');

// 請求間隔控制
let lastRequestTime = 0;

async function rateLimitedFetch(url) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const minInterval = 400;

    if (timeSinceLastRequest < minInterval) {
        await new Promise(resolve =>
            setTimeout(resolve, minInterval - timeSinceLastRequest)
        );
    }

    lastRequestTime = Date.now();

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (error.response?.status === 429) {
            console.log('達到頻率限制，等待 2 秒後重試...');
            await new Promise(resolve => setTimeout(resolve, 2000));
            return rateLimitedFetch(url);
        }
        throw error;
    }
}

function transformAnimeData(anime) {
    return {
        mal_id: anime.mal_id,
        title: anime.title,
        title_japanese: anime.title_japanese || null,
        synopsis: anime.synopsis || null,
        image_url: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || null,
        trailer_url: anime.trailer?.embed_url || null,
        score: anime.score || null,
        status: anime.status || null,
        season: anime.season || null,
        year: anime.year || (anime.aired?.from ? new Date(anime.aired.from).getFullYear() : null),
        episodes: anime.episodes || null,
        aired_from: anime.aired?.from || null,
        genres: anime.genres ? anime.genres.map(g => g.name).join(', ') : null,
        studios: anime.studios ? anime.studios.map(s => s.name).join(', ') : null,
        source: anime.source || null,
        rating: anime.rating || null
    };
}

function getCurrentSeasonInfo() {
    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    let season;
    if (month >= 1 && month <= 3) {
        season = 'winter';
    } else if (month >= 4 && month <= 6) {
        season = 'spring';
    } else if (month >= 7 && month <= 9) {
        season = 'summer';
    } else {
        season = 'fall';
    }

    return { year, season };
}

async function updateSeasonAnime(db, year, season) {
    console.log(`正在更新 ${year} ${season} 動漫資料...`);

    try {
        const url = `${JIKAN_BASE_URL}/seasons/${year}/${season}`;
        const data = await rateLimitedFetch(url);

        const animeList = data.data.map(transformAnimeData);

        const stmt = db.prepare(`
      INSERT INTO anime (
        mal_id, title, title_japanese, synopsis, image_url, trailer_url,
        score, status, season, year, episodes, aired_from, genres, studios, source, rating
      ) VALUES (
        @mal_id, @title, @title_japanese, @synopsis, @image_url, @trailer_url,
        @score, @status, @season, @year, @episodes, @aired_from, @genres, @studios, @source, @rating
      )
      ON CONFLICT(mal_id) DO UPDATE SET
        title = @title,
        title_japanese = @title_japanese,
        synopsis = @synopsis,
        image_url = @image_url,
        trailer_url = @trailer_url,
        score = @score,
        status = @status,
        season = @season,
        year = @year,
        episodes = @episodes,
        aired_from = @aired_from,
        genres = @genres,
        studios = @studios,
        source = @source,
        rating = @rating,
        updated_at = CURRENT_TIMESTAMP
    `);

        let updated = 0;
        for (const anime of animeList) {
            try {
                stmt.run(anime);
                updated++;
            } catch (error) {
                console.error(`更新 ${anime.title} 時發生錯誤:`, error.message);
            }
        }

        console.log(`✅ 成功更新 ${updated} 筆 ${year} ${season} 動漫資料`);
        return updated;
    } catch (error) {
        console.error(`❌ 更新 ${year} ${season} 動漫資料時發生錯誤:`, error.message);
        return 0;
    }
}

async function main() {
    console.log('======================================');
    console.log('動漫季刊 - 每日自動更新');
    console.log(`執行時間: ${new Date().toLocaleString('zh-TW')}`);
    console.log('======================================\n');

    // 開啟資料庫
    const db = new Database(dbPath);
    db.pragma('journal_mode = WAL');

    // 確保資料表存在
    db.exec(`
    CREATE TABLE IF NOT EXISTS anime (
      mal_id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      title_japanese TEXT,
      synopsis TEXT,
      image_url TEXT,
      trailer_url TEXT,
      score REAL,
      status TEXT,
      season TEXT,
      year INTEGER,
      episodes INTEGER,
      aired_from TEXT,
      genres TEXT,
      studios TEXT,
      source TEXT,
      rating TEXT,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
    CREATE INDEX IF NOT EXISTS idx_anime_season ON anime(year, season);
  `);

    const { year, season } = getCurrentSeasonInfo();

    // 更新當季動漫
    await updateSeasonAnime(db, year, season);

    // 等待 API 冷卻
    await new Promise(resolve => setTimeout(resolve, 1000));

    // 也嘗試取得即將上映的動漫
    console.log('\n正在取得即將上映的動漫...');
    try {
        const upcomingUrl = `${JIKAN_BASE_URL}/seasons/upcoming`;
        const upcomingData = await rateLimitedFetch(upcomingUrl);

        const upcomingList = upcomingData.data.map(transformAnimeData);
        console.log(`✅ 發現 ${upcomingList.length} 部即將上映動漫`);

        const stmt = db.prepare(`
      INSERT INTO anime (
        mal_id, title, title_japanese, synopsis, image_url, trailer_url,
        score, status, season, year, episodes, aired_from, genres, studios, source, rating
      ) VALUES (
        @mal_id, @title, @title_japanese, @synopsis, @image_url, @trailer_url,
        @score, @status, @season, @year, @episodes, @aired_from, @genres, @studios, @source, @rating
      )
      ON CONFLICT(mal_id) DO UPDATE SET
        title = @title,
        title_japanese = @title_japanese,
        synopsis = @synopsis,
        updated_at = CURRENT_TIMESTAMP
    `);

        for (const anime of upcomingList) {
            try {
                stmt.run(anime);
            } catch (error) {
                // 忽略個別錯誤
            }
        }
    } catch (error) {
        console.error('❌ 取得即將上映動漫時發生錯誤:', error.message);
    }

    // 統計資訊
    const totalCount = db.prepare('SELECT COUNT(*) as count FROM anime').get().count;
    const currentCount = db.prepare('SELECT COUNT(*) as count FROM anime WHERE year = ? AND season = ?').get(year, season).count;

    console.log('\n======================================');
    console.log('更新統計');
    console.log('======================================');
    console.log(`資料庫總動漫數: ${totalCount}`);
    console.log(`${year} ${season} 動漫數: ${currentCount}`);
    console.log('======================================\n');

    db.close();
    console.log('更新完成！');
}

main().catch(console.error);
