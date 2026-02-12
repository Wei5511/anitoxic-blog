import { executeQuery } from '@/lib/database';
import SeasonClient from './client';

// Server-side data fetching
async function getSeasonAnime(year, season) {
    try {
        const query = `
            SELECT * FROM anime 
            WHERE year = ? AND season = ? 
            ORDER BY score DESC NULLS LAST
        `;
        const res = await executeQuery(query, [year, season]);
        const rows = res.all ? res.all() : (res.rows || []);
        return rows;
    } catch (e) {
        console.error('Error fetching season anime:', e);
        return [];
    }
}

// Generate Dynamic Metadata
export async function generateMetadata({ params }) {
    const { year, season } = await params;

    const seasonNameMap = { winter: '1月', spring: '4月', summer: '7月', fall: '10月' };
    const seasonName = seasonNameMap[season] || season;

    const title = `${year} ${seasonName}新番列表 | 【漫】性中毒`;
    const description = `查看 ${year} 年 ${seasonName} 的最新日本動畫新番列表，包含詳細介紹、評分與播出資訊。`;

    return {
        title: title,
        description: description,
        openGraph: {
            title: title,
            description: description,
            type: 'website',
            url: `https://anitoxic-blog.vercel.app/season/${year}/${season}`,
        },
        alternates: {
            canonical: `https://anitoxic-blog.vercel.app/season/${year}/${season}`,
        },
    };
}

export default async function SeasonPage({ params }) {
    const { year, season } = await params;
    const animeList = await getSeasonAnime(year, season);

    return <SeasonClient initialAnime={animeList} year={year} season={season} />;
}
