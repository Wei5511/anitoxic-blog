import { executeQuery } from '@/lib/database';
import RecommendationListClient from './recommendation-list-client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RecommendationsPage() {
    // Fetch recommended articles
    const res = await executeQuery(`
        SELECT id, title, image_url, category, published_at, sort_order 
        FROM articles 
        WHERE is_recommended = 1
        ORDER BY sort_order ASC, published_at DESC
    `);
    const articles = res.all ? res.all() : (res.rows || []);

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>編輯推薦管理 (Editor's Picks)</h1>
                <Link href="/admin/articles" style={{
                    background: '#2563eb',
                    color: '#fff',
                    padding: '0.6rem 1.2rem',
                    borderRadius: '4px',
                    textDecoration: 'none',
                    fontWeight: '600',
                    fontSize: '0.9rem'
                }}>
                    + 從文章列表新增
                </Link>
            </div>

            <div style={{ marginBottom: '1.5rem', background: '#e0f2fe', padding: '1rem', borderRadius: '8px', color: '#0369a1', fontSize: '0.9rem' }}>
                💡 說明：此處管理的文章會顯示在首頁側邊欄的「編輯推薦」區塊。您可以在此調整排序或移除。若要新增，請至「文章管理」將文章設為推薦。
            </div>

            <RecommendationListClient articles={articles} />
        </div>
    );
}
