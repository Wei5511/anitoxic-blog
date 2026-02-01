'use server';

import { executeQuery } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function saveSettings(formData) {
    const ga_id = formData.get('next_public_ga_id');

    try {
        await executeQuery(`
            INSERT INTO settings (key, value, updated_at) 
            VALUES ('next_public_ga_id', ?, CURRENT_TIMESTAMP)
            ON CONFLICT(key) DO UPDATE SET 
            value = excluded.value, 
            updated_at = excluded.updated_at
        `, [ga_id]);

        revalidatePath('/admin/settings');
        revalidatePath('/'); // To update layout
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Settings save failed' };
    }
}
