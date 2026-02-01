import { executeQuery } from '@/lib/database';
import BannerListClient from './banner-list-client';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BannersPage() {
    const res = await executeQuery('SELECT * FROM banners ORDER BY sort_order ASC, created_at DESC');
    const banners = res.all ? res.all() : res.rows;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>橫幅管理 (Banners)</h1>
                <Link href="/admin/banners/new" style={{ background: '#111827', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold' }}>
                    + 新增橫幅
                </Link>
            </div>
            <BannerListClient banners={banners} />
        </div>
    );
}
