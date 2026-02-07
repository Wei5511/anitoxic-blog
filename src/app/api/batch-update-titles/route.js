import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { getChineseTitle, sleep } from '@/lib/tmdb';

export async function GET() {
    console.log('Starting batch update check...');

    // 1. Fetch data
    // Limit 20 to avoid timeouts
    // Select episodes to infer type since 'type' column is missing
    const db = getDb();
    const rows = db.prepare(`
        SELECT mal_id, title, episodes 
        FROM anime 
        WHERE (title_chinese IS NULL OR title_chinese = '')
        ORDER BY RANDOM()
        LIMIT 20
    `).all();

    console.log(`Found ${rows.length} titles to process.`);

    if (rows.length === 0) {
        return NextResponse.json({
            success: true,
            processed: 0,
            updated: 0,
            message: "No missing titles found"
        });
    }

    let updatedCount = 0;
    let processedCount = 0;

    // 2. Loop & Update
    // 2. Loop & Update
    const updateStmt = db.prepare('UPDATE anime SET title_chinese = ? WHERE mal_id = ?');

    // Helper: Clean title
    const cleanTitle = (t) => {
        if (!t) return t;
        return t
            .replace(/\(TV\)/gi, '')
            .replace(/\(Movie\)/gi, '')
            .replace(/\(Special\)/gi, '')
            .replace(/\(OVA\)/gi, '')
            .trim();
    };

    for (const anime of rows) {
        processedCount++;
        const queryTitle = cleanTitle(anime.title);

        // Heuristic: If episodes is 1, it's likely a Movie (or OVA/Special). 
        // TMDB 'movie' search is generally robust for these.
        // Otherwise default to 'tv'.
        const type = (anime.episodes === 1) ? 'movie' : 'tv';

        try {
            // Rate Limiting (Pre-request delay)
            await sleep(300);

            const chineseTitle = await getChineseTitle(queryTitle, type);

            if (chineseTitle) {
                updateStmt.run(chineseTitle, anime.mal_id);
                updatedCount++;
                console.log(`Updated [${anime.mal_id}] ${queryTitle} -> ${chineseTitle}`);
            } else {
                console.log(`No result for [${anime.mal_id}] ${queryTitle} (${type})`);
            }

        } catch (error) {
            console.error(`Error processing [${anime.mal_id}] ${queryTitle}:`, error);
            // Continue to next item
        }
    }

    return NextResponse.json({
        success: true,
        processed: processedCount,
        updated: updatedCount,
        message: "Batch update completed"
    });
}
