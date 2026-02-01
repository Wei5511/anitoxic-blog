import { NextResponse } from 'next/server';
import { getAnimeById } from '@/lib/database';
import { fetchAnimeDetails } from '@/lib/jikanService';
import { upsertAnime } from '@/lib/database';

export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const malId = parseInt(id);

        // 先從資料庫取得
        let anime = await getAnimeById(malId);

        // 如果沒有就從 API 取得
        if (!anime) {
            const apiData = await fetchAnimeDetails(malId);
            upsertAnime(apiData);
            anime = await getAnimeById(malId);
        }

        return NextResponse.json({
            success: true,
            data: anime
        });
    } catch (error) {
        console.error('Error fetching anime:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
