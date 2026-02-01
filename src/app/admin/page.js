import { executeQuery } from '@/lib/database';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    // 1. Env Var Check
    if (!process.env.TURSO_DATABASE_URL || !process.env.TURSO_AUTH_TOKEN) {
        return (
            <div style={{ padding: '2rem', color: '#d32f2f' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Configuration Error</h1>
                <p style={{ marginTop: '1rem' }}>
                    Missing <code>TURSO_DATABASE_URL</code> or <code>TURSO_AUTH_TOKEN</code> environment variables.
                </p>
                <div style={{ background: '#f5f5f5', padding: '1rem', marginTop: '1rem', borderRadius: '4px' }}>
                    <p>Current Status:</p>
                    <ul>
                        <li>URL: {process.env.TURSO_DATABASE_URL ? '✅ Set' : '❌ Missing'}</li>
                        <li>Token: {process.env.TURSO_AUTH_TOKEN ? '✅ Set' : '❌ Missing'}</li>
                    </ul>
                </div>
            </div>
        );
    }
    // Determine counts
    let articlesCount = 0;
    let pinnedCount = 0;
    let bannersCount = 0;
    let activeBannersCount = 0;
    let errorMsg = null;

    try {
        const articlesRes = await executeQuery('SELECT COUNT(*) as count FROM articles');
        articlesCount = articlesRes.get().count;

        const pinnedRes = await executeQuery('SELECT COUNT(*) as count FROM articles WHERE is_pinned = 1');
        pinnedCount = pinnedRes.get().count;

        const bannersRes = await executeQuery('SELECT COUNT(*) as count FROM banners');
        bannersCount = bannersRes.get().count;

        const activeBannersRes = await executeQuery('SELECT COUNT(*) as count FROM banners WHERE is_active = 1');
        activeBannersCount = activeBannersRes.get().count;
    } catch (e) {
        console.error('Dashboard Error:', e);
        errorMsg = e.message + (e.stack ? '\n' + e.stack : '');
    }

    if (errorMsg) {
        return (
            <div style={{ padding: '2rem', color: 'red' }}>
                <h1>Dashboard Error</h1>
                <pre style={{ background: '#eee', padding: '1rem', overflow: 'auto' }}>
                    {errorMsg}
                </pre>
            </div>
        );
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>儀表板總覽</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <StatsCard title="文章總數" value={articlesCount} />
                <StatsCard title="精選置頂" value={pinnedCount} label="Featured" />
                <StatsCard title="橫幅總數" value={bannersCount} />
                <StatsCard title="啟用中橫幅" value={activeBannersCount} label="Live" />
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
