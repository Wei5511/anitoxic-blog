import { NextResponse } from 'next/server';
import { fetchCurrentSeason, fetchSeasonAnime, getCurrentSeasonInfo } from '@/lib/jikanService';
import { upsertAnime, getSeasonAnime } from '@/lib/database';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const year = searchParams.get('year');
        const season = searchParams.get('season');
        const forceRefresh = searchParams.get('refresh') === 'true';

        let targetYear, targetSeason;

        if (year && season) {
            targetYear = parseInt(year);
            targetSeason = season;
        } else {
            const current = getCurrentSeasonInfo();
            targetYear = current.year;
            targetSeason = current.season;
        }

        // 先檢查資料庫是否有資料
        let animeList = await getSeasonAnime(targetYear, targetSeason);

        // 如果沒有資料或強制刷新，從 API 取得
        if (animeList.length === 0 || forceRefresh) {
            console.log(`Fetching from Jikan API: ${targetYear} ${targetSeason}`);
            const apiData = await fetchSeasonAnime(targetYear, targetSeason);

            // 儲存到資料庫
            for (const anime of apiData) {
                try {
                    await upsertAnime(anime);
                } catch (error) {
                    console.error(`Error upserting anime ${anime.mal_id}:`, error);
                }
            }

            animeList = await getSeasonAnime(targetYear, targetSeason);
        }

        return NextResponse.json({
            success: true,
            year: targetYear,
            season: targetSeason,
            count: animeList.length,
            data: animeList
        });
    } catch (error) {
        console.error('Sync error:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
