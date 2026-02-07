'use server';

import { executeQuery } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function updateAnime(mal_id, data) {
    try {
        const { title, title_chinese, content, is_published } = data;

        // Ensure is_published is treated as integer (0 or 1) for SQLite/LibSQL
        const publishedVal = is_published ? 1 : 0;

        // We update: title, title_chinese, content, is_published
        // Note: title_chinese is actually stored in `title` if we followed previous localization logic?
        // Wait, schema has `title` (English/Default) and `title_chinese`?
        // Let's check schema.
        // `migrate-recommendation.js` used `title_chinese` column.
        // `scripts/localize-db-titles.js` used `UPDATE anime SET title = title_chinese`.
        // So `title` is displayed title. `title_chinese` is source Chinese title.
        // If user edits "Title", we should probably update `title`.
        // If user edits "Chinese Title", update `title_chinese`.
        // Content -> `content`.
        // Published -> `is_published`.

        await executeQuery(`
            UPDATE anime 
            SET title = ?, 
                title_chinese = ?, 
                content = ?, 
                is_published = ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE mal_id = ?
        `, [title, title_chinese, content, publishedVal, mal_id]);

        revalidatePath(`/anime/${mal_id}`);
        revalidatePath('/admin/anime');
        revalidatePath('/database');

        return { success: true };
    } catch (error) {
        console.error('Update Anime Error:', error);
        return { success: false, error: error.message };
    }
}
