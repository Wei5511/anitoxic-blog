import { executeQuery } from '@/lib/database';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // Determine counts
    // executeQuery returns { rows: [], get: (), ... }

    // Total articles
    const articlesRes = await executeQuery('SELECT COUNT(*) as count FROM articles');
    const articlesCount = articlesRes.get().count;

    // Pinned articles
    const pinnedRes = await executeQuery('SELECT COUNT(*) as count FROM articles WHERE is_pinned = 1');
    const pinnedCount = pinnedRes.get().count;

    // Banners
    const bannersRes = await executeQuery('SELECT COUNT(*) as count FROM banners');
    const bannersCount = bannersRes.get().count;

    // Active Banners
    const activeBannersRes = await executeQuery('SELECT COUNT(*) as count FROM banners WHERE is_active = 1');
    const activeBannersCount = activeBannersRes.get().count;

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>儀表板總覽</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatsCard title="文章總數" value={articleCount} />
                <StatsCard title="精選置頂" value={pinnedCount} label="Featured" />
                <StatsCard title="橫幅總數" value={bannerCount} />
                <StatsCard title="啟用中橫幅" value={activeBannerCount} label="Live" />
            </div>

            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1rem' }}>快速操作</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <Link href="/admin/articles/new" style={{ padding: '0.75rem 1.5rem', background: '#fff', borderRadius: '8px', textDecoration: 'none', color: '#111827', fontWeight: '600', border: '1px solid #e5e7eb' }}>
                    + 新增文章
                </Link>
                <Link href="/admin/banners/new" style={{ padding: '0.75rem 1.5rem', background: '#fff', borderRadius: '8px', textDecoration: 'none', color: '#111827', fontWeight: '600', border: '1px solid #e5e7eb' }}>
                    + 新增橫幅
                </Link>
                <Link href="/admin/settings" style={{ padding: '0.75rem 1.5rem', background: '#fff', borderRadius: '8px', textDecoration: 'none', color: '#111827', fontWeight: '600', border: '1px solid #e5e7eb' }}>
                    設定 GA4
                </Link>
            </div>
        </div>
    );
}

function StatsCard({ title, value, label }) {
    return (
        <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}>
            <h3 style={{ fontSize: '0.9rem', color: '#6b7280', textTransform: 'uppercase', fontWeight: '600', letterSpacing: '0.05em' }}>{title}</h3>
            <div style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem', color: '#111827' }}>
                {value}
                {label && <span style={{ fontSize: '0.9rem', color: '#10b981', marginLeft: '0.5rem', verticalAlign: 'middle', background: '#ecfdf5', padding: '2px 6px', borderRadius: '4px' }}>{label}</span>}
            </div>
        </div>
    );
}
