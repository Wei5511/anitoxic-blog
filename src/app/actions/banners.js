'use server';

import { executeQuery } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function deleteBanner(id) {
    try {
        await executeQuery('DELETE FROM banners WHERE id = ?', [id]);
        revalidatePath('/admin/banners');
        revalidatePath('/'); // Frontend banners might be cached
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Delete failed' };
    }
}

export async function toggleBannerActive(id, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;
    try {
        await executeQuery('UPDATE banners SET is_active = ? WHERE id = ?', [newStatus, id]);
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Toggle failed' };
    }
}

export async function saveBanner(formData) {
    const id = formData.get('id');
    const title = formData.get('title');
    const image_url = formData.get('image_url');
    const link = formData.get('link');
    const sort_order = formData.get('sort_order') || 0;
    const is_active = formData.get('is_active') === 'on' ? 1 : 0;

    if (!image_url) return { success: false, message: 'Image URL is required' };

    try {
        if (id && id !== 'new') {
            await executeQuery(`
                UPDATE banners 
                SET title = ?, image_url = ?, link = ?, sort_order = ?, is_active = ?
                WHERE id = ?
            `, [title, image_url, link, sort_order, is_active, id]);
        } else {
            await executeQuery(`
                INSERT INTO banners (title, image_url, link, sort_order, is_active)
                VALUES (?, ?, ?, ?, ?)
            `, [title, image_url, link, sort_order, is_active]);
        }
        revalidatePath('/admin/banners');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Save failed: ' + e.message };
    }
}
