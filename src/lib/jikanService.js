import axios from 'axios';

const JIKAN_BASE_URL = 'https://api.jikan.moe/v4';

// 請求間隔控制（遵守 API 頻率限制：60 requests/min, 3/sec）
let lastRequestTime = 0;
const MIN_REQUEST_INTERVAL = 400; // 400ms 間隔

async function rateLimitedFetch(url) {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;

    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
        await new Promise(resolve =>
            setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest)
        );
    }

    lastRequestTime = Date.now();

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        if (error.response?.status === 429) {
            // 遇到頻率限制，等待後重試
            await new Promise(resolve => setTimeout(resolve, 2000));
            return rateLimitedFetch(url);
        }
        throw error;
    }
}

// 取得當季動漫
export async function fetchSeasonAnime(year, season) {
    const url = `${JIKAN_BASE_URL}/seasons/${year}/${season}`;
    const data = await rateLimitedFetch(url);
    return data.data.map(transformAnimeData);
}

// 取得目前季節
export async function fetchCurrentSeason() {
    const url = `${JIKAN_BASE_URL}/seasons/now`;
    const data = await rateLimitedFetch(url);
    return data.data.map(transformAnimeData);
}

// 取得即將上映
export async function fetchUpcomingSeason() {
    const url = `${JIKAN_BASE_URL}/seasons/upcoming`;
    const data = await rateLimitedFetch(url);
    return data.data.map(transformAnimeData);
}

// 取得動漫詳情
export async function fetchAnimeDetails(malId) {
    const url = `${JIKAN_BASE_URL}/anime/${malId}/full`;
    const data = await rateLimitedFetch(url);
    return transformAnimeData(data.data);
}

// 搜尋動漫
export async function searchAnimeJikan(query) {
    const url = `${JIKAN_BASE_URL}/anime?q=${encodeURIComponent(query)}&limit=20`;
    const data = await rateLimitedFetch(url);
    return data.data.map(transformAnimeData);
}

// 轉換 API 資料格式
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

// 取得季節名稱
export function getCurrentSeasonInfo() {
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

// 季節中文名稱
export function getSeasonDisplayName(season) {
    const names = {
        winter: '冬季',
        spring: '春季',
        summer: '夏季',
        fall: '秋季'
    };
    return names[season] || season;
}
