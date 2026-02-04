// TMDB API Helper for getting Chinese anime titles
const TMDB_API_KEY = '8a85aea05084693c8dbcd1c0ffbfbf85';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

/**
 * Get Chinese title from TMDB
 * @param {string} query - English title to search
 * @param {string} type - 'tv' or 'movie' (use 'tv' for anime series)
 * @returns {Promise<string|null>} Chinese title or null if not found
 */
export async function getChineseTitle(query, type = 'tv') {
    try {
        // Step 1: Search for the title
        const searchUrl = `${TMDB_BASE_URL}/search/${type}?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&language=zh-TW`;
        const searchRes = await fetch(searchUrl);

        if (!searchRes.ok) {
            console.error('TMDB search failed:', searchRes.status);
            return null;
        }

        const searchData = await searchRes.json();

        if (!searchData.results || searchData.results.length === 0) {
            return null;
        }

        // Get the first result
        const firstResult = searchData.results[0];
        const tmdbId = firstResult.id;

        // Step 2: Get details with Chinese translation
        const detailUrl = `${TMDB_BASE_URL}/${type}/${tmdbId}?api_key=${TMDB_API_KEY}&language=zh-TW`;
        const detailRes = await fetch(detailUrl);

        if (!detailRes.ok) {
            console.error('TMDB detail failed:', detailRes.status);
            return null;
        }

        const detailData = await detailRes.json();

        // Return Chinese title (for TV shows it's 'name', for movies it's 'title')
        const chineseTitle = type === 'tv' ? detailData.name : detailData.title;

        return chineseTitle || null;

    } catch (error) {
        console.error('Error fetching Chinese title:', error);
        return null;
    }
}

/**
 * Sleep helper for rate limiting
 * @param {number} ms - Milliseconds to sleep
 */
export function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
