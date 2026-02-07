import { getAnimeById } from '@/lib/database';
import AnimeDetailClient from './anime-detail-client';

// Generate Dynamic Metadata
export async function generateMetadata({ params }) {
    const { id } = await params;
    const anime = await getAnimeById(id);

    if (!anime) {
        return {
            title: '找不到動漫 | AniToxic',
        };
    }

    // Use Chinese title if available, fallback to default title
    const pageTitle = anime.title_chinese
        ? `${anime.title_chinese} | AniToxic`
        : `${anime.title} | AniToxic`;

    // Use Chinese synopsis if available, fallback to default
    const rawDesc = anime.synopsis_chinese || anime.synopsis || '追蹤每季最新動漫，獲取即時資訊與精彩內容';
    const description = rawDesc.substring(0, 160).replace(/\n/g, ' ');

    return {
        title: pageTitle,
        description: description,
        openGraph: {
            title: pageTitle,
            description: description,
            images: anime.image_url ? [{ url: anime.image_url }] : [],
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: pageTitle,
            description: description,
            images: anime.image_url ? [anime.image_url] : [],
        },
    };
}

// Server Component
export default async function AnimePage({ params }) {
    const { id } = await params;
    const anime = await getAnimeById(id);

    return <AnimeDetailClient initialAnime={anime} id={id} />;
}
