import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

// GET /api/articles/[id] - Get single article
export async function GET(request, context) {
    try {
        const db = getDb();
        const params = await context.params;
        const { id } = params;

        const article = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);

        if (!article) {
            return NextResponse.json({ error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, data: article });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// PUT /api/articles/[id] - Update article
export async function PUT(request, { params }) {
    try {
        const db = getDb();
        const { id } = params;
        const body = await request.json();
        const { title, slug, content, category, image_url, myvideo_url, is_pinned } = body;

        const excerpt = content ? content.replace(/[#*`]/g, '').slice(0, 100) + '...' : '';

        const stmt = db.prepare(`
            UPDATE articles 
            SET title = ?, slug = ?, content = ?, category = ?, is_pinned = ?, image_url = ?, myvideo_url = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `);

        const result = stmt.run(
            body.title,
            body.slug || body.title,
            body.content,
            body.category,
            body.is_pinned ? 1 : 0,
            body.image_url,
            body.myvideo_url,
            id
        );

        if (result.changes === 0) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Updated successfully' });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}

// DELETE /api/articles/[id] - Delete article
export async function DELETE(request, context) {
    try {
        const db = getDb();
        const params = await context.params;
        const { id } = params;

        const result = db.prepare('DELETE FROM articles WHERE id = ?').run(id);

        if (result.changes === 0) {
            return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
