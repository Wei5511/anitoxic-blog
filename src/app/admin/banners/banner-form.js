'use client';

import { saveBanner } from '@/app/actions/banners';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function BannerForm({ banner }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        if (banner?.id) formData.append('id', banner.id);

        const res = await saveBanner(formData);
        if (res.success) {
            router.push('/admin/banners');
            router.refresh();
        } else {
            alert(res.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>圖片網址 (Image URL)</label>
                <input name="image_url" defaultValue={banner?.image_url} required style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>標題 (選填)</label>
                <input name="title" defaultValue={banner?.title} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>連結網址 (選填)</label>
                <input name="link" defaultValue={banner?.link} style={{ width: '100%', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
            </div>
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>排序 (Sort Order)</label>
                    <input type="number" name="sort_order" defaultValue={banner?.sort_order || 0} style={{ width: '80px', padding: '0.6rem', border: '1px solid #ccc', borderRadius: '4px' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input type="checkbox" name="is_active" id="is_active" defaultChecked={banner?.is_active !== 0} style={{ width: '20px', height: '20px', marginRight: '0.5rem' }} />
                    <label htmlFor="is_active" style={{ fontWeight: '600', cursor: 'pointer' }}>啟用 (Active)</label>
                </div>
            </div>
            <div style={{ display: 'flex', gap: '1rem' }}>
                <button type="button" onClick={() => router.back()} style={{ padding: '0.6rem 1.2rem', background: '#eee', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>取消</button>
                <button type="submit" disabled={loading} style={{ padding: '0.6rem 1.2rem', background: '#111827', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', opacity: loading ? 0.7 : 1 }}>
                    {loading ? '儲存中...' : '儲存橫幅'}
                </button>
            </div>
        </form>
    );
}
