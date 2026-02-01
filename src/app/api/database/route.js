import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = searchParams.get('query');
        const year = searchParams.get('year') || '2025';
        const season = searchParams.get('season');

        let query = 'SELECT * FROM anime WHERE 1=1';
        const params = [];

        // Keyword Search (Overrides Year default if year not explicitly all, but let's be flexible)
        if (queryParam) {
            query += ` AND (title LIKE ? OR title_japanese LIKE ? OR genres LIKE ? OR synopsis LIKE ?)`;
            const likeQuery = `%${queryParam}%`;
            params.push(likeQuery, likeQuery, likeQuery, likeQuery);

            // If searching, we default year to ALL unless specified
            if (searchParams.get('year')) {
                query += ` AND year = ?`;
                params.push(parseInt(year));
            }
        } else {
            // Default behavior: Filter by year
            if (year !== 'all') {
                query += ` AND year = ?`;
                params.push(parseInt(year));
            } else {
                // If viewing 'all' years, exclude 2026
                query += ` AND year != 2026`;
            }
        }

        if (season && season !== 'all') {
            query += ` AND LOWER(season) = ?`;
            params.push(season.toLowerCase());
        }

        query += ` ORDER BY score DESC NULLS LAST, title ASC LIMIT 100`;

        const res = await executeQuery(query, params);
        const animeList = res.all ? res.all() : res.rows;

        return NextResponse.json({
            success: true,
            count: animeList.length,
            data: animeList
        });
    } catch (error) {
        console.error('Error fetching anime database:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
