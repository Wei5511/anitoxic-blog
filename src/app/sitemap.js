import { executeQuery } from '@/lib/database';

export default async function sitemap() {
    const baseUrl = 'https://anitoxic-blog.vercel.app';

    // 1. Static Routes
    const staticRoutes = [
        '',
        '/about',
        '/database',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
    }));

    // 2. Articles (Blog Posts)
    let articles = [];
    try {
        const res = await executeQuery('SELECT id, updated_at FROM articles');
        const rows = res.all ? res.all() : (res.rows || []);
        articles = rows.map((article) => ({
            url: `${baseUrl}/articles/${article.id}`,
            lastModified: new Date(article.updated_at || new Date()),
            changeFrequency: 'weekly',
            priority: 0.8,
        }));
    } catch (e) {
        console.error('Sitemap Article Error:', e);
    }

    // 3. Anime Database Entries
    let animeList = [];
    try {
        const res = await executeQuery('SELECT mal_id FROM anime');
        const rows = res.all ? res.all() : (res.rows || []);
        animeList = rows.map((a) => ({
            url: `${baseUrl}/anime/${a.mal_id}`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.6,
        }));
    } catch (e) {
        console.error('Sitemap Anime Error:', e);
    }

    // 4. Seasons
    let seasonList = [];
    try {
        const res = await executeQuery('SELECT DISTINCT year, season FROM anime WHERE year IS NOT NULL AND season IS NOT NULL');
        const rows = res.all ? res.all() : (res.rows || []);
        seasonList = rows.map((s) => ({
            url: `${baseUrl}/season/${s.year}/${s.season}`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        }));
    } catch (e) {
        console.error('Sitemap Season Error:', e);
    }

    return [...staticRoutes, ...articles, ...animeList, ...seasonList];
}
