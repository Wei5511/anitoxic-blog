'use server';

import { executeQuery } from '@/lib/database';
import { revalidatePath } from 'next/cache';

export async function toggleArticlePin(id, currentStatus) {
    const newStatus = currentStatus === 1 ? 0 : 1;

    try {
        await executeQuery('UPDATE articles SET is_pinned = ? WHERE id = ?', [newStatus, id]);
        revalidatePath('/admin/articles');
        revalidatePath('/'); // Refresh homepage too
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Failed to toggle pin' };
    }
}

export async function deleteArticle(id) {
    try {
        await executeQuery('DELETE FROM articles WHERE id = ?', [id]);
        revalidatePath('/admin/articles');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Failed to delete article' };
    }
}

export async function saveArticle(formData) {
    const id = formData.get('id');
    const title = formData.get('title');
    const image_url = formData.get('image_url');
    const category = formData.get('category');
    const content = formData.get('content');
    const myvideo_url = formData.get('myvideo_url');
    const is_pinned = formData.get('is_pinned') === 'on' ? 1 : 0;

    // Basic validation
    if (!title) return { success: false, message: 'Title is required' };

    try {
        if (id && id !== 'new') {
            // Update
            await executeQuery(`
                UPDATE articles 
                SET title = ?, image_url = ?, category = ?, content = ?, myvideo_url = ?, is_pinned = ?, published_at = CURRENT_TIMESTAMP
                WHERE id = ?
            `, [title, image_url, category, content, myvideo_url, is_pinned, id]);
        } else {
            // Create
            await executeQuery(`
                INSERT INTO articles (title, image_url, category, content, myvideo_url, is_pinned, published_at)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `, [title, image_url, category, content, myvideo_url, is_pinned]);
        }

        revalidatePath('/admin/articles');
        revalidatePath('/');
        return { success: true };
    } catch (e) {
        console.error(e);
        return { success: false, message: 'Failed to save article: ' + e.message };
    }
}
