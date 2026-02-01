import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

// GET /api/articles/[id] - Get single article
export async function GET(request, { params }) {
    try {
        const { id } = await params;
        const res = await executeQuery('SELECT * FROM articles WHERE id = ?', [id]);
        const article = res.get ? res.get() : (res.rows ? res.rows[0] : null);

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/articles/[id] - Update article
export async function PUT(request, { params }) {
    try {
        const { id } = await params;
        const body = await request.json();
        const { title, slug, content, category, image_url, myvideo_url, is_pinned } = body;

        await executeQuery(`
            UPDATE articles 
            SET title = ?, slug = ?, content = ?, category = ?, is_pinned = ?, image_url = ?, myvideo_url = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `, [
            title,
            slug || title,
            content,
            category,
            is_pinned ? 1 : 0,
            image_url,
            myvideo_url,
            id
        ]);

        return NextResponse.json({ success: true, message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(request, { params }) {
    try {
        const { id } = await params;
        await executeQuery('DELETE FROM articles WHERE id = ?', [id]);
        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
