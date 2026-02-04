import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';
import { getChineseTitle, sleep } from '@/lib/tmdb';

export async function POST(request) {
    try {
        console.log('=== Batch Update Chinese Titles Started ===');

        // Step 1: Fetch 20 anime without Chinese titles
        const sql = `
      SELECT mal_id, title, title_japanese, title_chinese
      FROM anime 
      WHERE (title_chinese IS NULL OR title_chinese = '')
      AND title IS NOT NULL
      LIMIT 20
    `;

        const result = await executeQuery(sql);
        const animeList = result.rows || result.all();

        console.log(`Found ${animeList.length} anime to process`);

        if (animeList.length === 0) {
            return NextResponse.json({
                success: true,
                message: 'No anime to update',
                updated: 0,
                failed: 0
            });
        }

        let updated = 0;
        let failed = 0;
        const results = [];

        // Step 2: Process each anime
        for (const anime of animeList) {
            try {
                // Use English title for search (TMDB primarily uses English)
                const searchQuery = anime.title;

                console.log(`[${updated + failed + 1}/${animeList.length}] Processing: ${searchQuery}`);

                // Get Chinese title from TMDB
                const chineseTitle = await getChineseTitle(searchQuery, 'tv');

                if (chineseTitle) {
                    // Update database
                    const updateSql = `
            UPDATE anime 
            SET title_chinese = ?
            WHERE mal_id = ?
          `;

                    await executeQuery(updateSql, [chineseTitle, anime.mal_id]);

                    updated++;
                    results.push({
                        mal_id: anime.mal_id,
                        title: anime.title,
                        chinese_title: chineseTitle,
                        status: 'success'
                    });

                    console.log(`  ✅ Updated: ${chineseTitle}`);
                } else {
                    failed++;
                    results.push({
                        mal_id: anime.mal_id,
                        title: anime.title,
                        status: 'not_found'
                    });

                    console.log(`  ⚠️  Not found in TMDB`);
                }

                // CRITICAL: Rate limiting - wait 300ms between API calls
                await sleep(300);

            } catch (error) {
                console.error(`  ❌ Error processing ${anime.title}:`, error);
                failed++;
                results.push({
                    mal_id: anime.mal_id,
                    title: anime.title,
                    status: 'error',
                    error: error.message
                });
            }
        }

        console.log('=== Batch Update Complete ===');
        console.log(`Updated: ${updated}, Failed: ${failed}`);

        return NextResponse.json({
            success: true,
            message: `Processed ${animeList.length} anime`,
            updated,
            failed,
            results
        });

    } catch (error) {
        console.error('Batch update error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            { status: 500 }
        );
    }
}

// GET endpoint to check status
export async function GET() {
    try {
        const sql = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN title_chinese IS NOT NULL AND title_chinese != '' THEN 1 ELSE 0 END) as with_chinese,
        SUM(CASE WHEN title_chinese IS NULL OR title_chinese = '' THEN 1 ELSE 0 END) as without_chinese
      FROM anime
    `;

        const result = await executeQuery(sql);
        const stats = result.get ? result.get() : result.rows[0];

        return NextResponse.json({
            success: true,
            stats: {
                total: stats.total,
                with_chinese: stats.with_chinese,
                without_chinese: stats.without_chinese,
                percentage: ((stats.with_chinese / stats.total) * 100).toFixed(2) + '%'
            }
        });
    } catch (error) {
        return NextResponse.json(
            {
                success: false,
                error: error.message
            },
            { status: 500 }
        );
    }
}
