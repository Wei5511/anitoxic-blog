'use client';

import { deleteBanner, toggleBannerActive } from '@/app/actions/banners';
import { useState } from 'react';
import Link from 'next/link';

export default function BannerListClient({ banners }) {
    const [isDeleting, setIsDeleting] = useState(null);

    const handleDelete = async (id) => {
        if (!confirm('確定要刪除此橫幅嗎？')) return;
        setIsDeleting(id);
        const res = await deleteBanner(id);
        setIsDeleting(null);
        if (!res.success) alert(res.message);
    };

    const handleToggle = async (id, status) => {
        const res = await toggleBannerActive(id, status);
        if (!res.success) alert(res.message);
    };

    return (
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6b7280' }}>圖片</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', color: '#6b7280' }}>標題</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#6b7280' }}>排序</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', color: '#6b7280' }}>狀態</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', color: '#6b7280' }}>操作</th>
                    </tr>
                </thead>
                <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                    {banners.map((banner) => (
                        <tr key={banner.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px 16px', width: '100px' }}>
                                <img src={banner.image_url} alt="" style={{ width: '80px', height: '45px', objectFit: 'cover', borderRadius: '4px' }} />
                            </td>
                            <td style={{ padding: '12px 16px' }}>{banner.title || '-'}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>{banner.sort_order}</td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <input
                                    type="checkbox"
                                    checked={banner.is_active === 1}
                                    onChange={() => handleToggle(banner.id, banner.is_active)}
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <Link href={`/admin/banners/${banner.id}`} style={{ marginRight: '10px', color: '#2563eb', textDecoration: 'none', fontWeight: '500' }}>編輯</Link>
                                <button onClick={() => handleDelete(banner.id)} style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: '500', cursor: 'pointer' }}>
                                    {isDeleting === banner.id ? '...' : '刪除'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {banners.length === 0 && (
                        <tr><td colSpan="5" style={{ padding: '20px', textAlign: 'center', color: '#999' }}>目前沒有橫幅。</td></tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
