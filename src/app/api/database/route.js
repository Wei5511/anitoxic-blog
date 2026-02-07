import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const queryParam = searchParams.get('query');
        const year = searchParams.get('year') || 'all'; // Default to all if not specified, but usually frontend sends '2025' or 'all'
        const season = searchParams.get('season');
        const page = parseInt(searchParams.get('page')) || 1;
        const limit = parseInt(searchParams.get('limit')) || 30;
        const offset = (page - 1) * limit;

        let baseQuery = ' FROM anime WHERE 1=1';
        const params = [];

        // Keyword Search
        if (queryParam) {
            baseQuery += ` AND (title LIKE ? OR title_japanese LIKE ? OR genres LIKE ? OR synopsis LIKE ?)`;
            const likeQuery = `%${queryParam}%`;
            params.push(likeQuery, likeQuery, likeQuery, likeQuery);
        }

        // Year Filter
        if (year !== 'all') {
            baseQuery += ` AND year = ?`;
            params.push(parseInt(year));
        }

        // Season Filter
        if (season && season !== 'all') {
            baseQuery += ` AND LOWER(season) = ?`;
            params.push(season.toLowerCase());
        }

        // Genre Filter
        const genre = searchParams.get('genre');
        if (genre && genre !== 'all') {
            baseQuery += ` AND genres LIKE ?`;
            params.push(`%${genre}%`);
        }

        // Get Total Count
        const countQuery = `SELECT COUNT(*) as total ${baseQuery}`;
        const countRes = await executeQuery(countQuery, params);
        const total = countRes.rows ? countRes.rows[0].total : countRes.all()[0].total;

        // Get Data
        const dataQuery = `SELECT * ${baseQuery} ORDER BY year DESC, 
            CASE season 
                WHEN 'winter' THEN 1 
                WHEN 'spring' THEN 2 
                WHEN 'summer' THEN 3 
                WHEN 'fall' THEN 4 
            END DESC, 
            score DESC NULLS LAST 
            LIMIT ? OFFSET ?`;

        const dataParams = [...params, limit, offset];
        const res = await executeQuery(dataQuery, dataParams);
        const animeList = res.all ? res.all() : res.rows;

        return NextResponse.json({
            success: true,
            data: animeList,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        console.error('Error fetching anime database:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
