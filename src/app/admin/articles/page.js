import { executeQuery } from '@/lib/database';
import ArticleListClient from './article-list-client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArticlesPage() {
    // Fetch articles sorted by Pinned first, then Date
    const res = await executeQuery(`
        SELECT id, title, image_url, published_at, is_pinned 
        FROM articles 
        ORDER BY is_pinned DESC, published_at DESC
    `);
    // normalize: executeQuery result behaves like array iterable if needed, but .all() is safer explicit call if adapted for better-sqlite3 style
    const articles = res.all ? res.all() : (res.rows || []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>所有文章</h1>
                <Link href="/admin/articles/new" style={{
                    background: '#111827',
                    color: '#fff',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontWeight: '600'
                }}>
                    + 新增文章
                </Link>
            </div>

            <ArticleListClient articles={articles} />
        </div>
    );
}
