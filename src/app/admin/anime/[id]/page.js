import { getAnimeById } from '@/lib/database';
import AnimeEditForm from './anime-edit-form';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminAnimeEditPage({ params }) {
    const { id } = await params;
    const anime = await getAnimeById(id);

    if (!anime) {
        return <div>找不到動漫 (ID: {id})</div>;
    }

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <Link href="/admin/anime" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '0.875rem', marginBottom: '0.5rem', display: 'inline-block' }}>
                    ← 返回列表
                </Link>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>編輯動漫: {anime.title_chinese || anime.title}</h1>
                <p style={{ color: '#6b7280' }}>MAL ID: {anime.mal_id}</p>
            </div>

            <AnimeEditForm anime={anime} />
        </div>
    );
}
