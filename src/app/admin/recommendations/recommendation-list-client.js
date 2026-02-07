'use client';

import { toggleArticleRecommendation, updateArticleOrder } from '@/app/actions/articles';
import { useState } from 'react';
import Link from 'next/link';

export default function RecommendationListClient({ articles }) {
    const [updatingOrder, setUpdatingOrder] = useState(null);

    const handleRemove = async (id) => {
        if (!confirm('移除推薦？此文章仍會保留在文章列表中。')) return;
        const res = await toggleArticleRecommendation(id, 1); // Current is 1 (on)
        if (!res.success) alert(res.message);
    };

    const handleOrderChange = async (id, newOrder) => {
        setUpdatingOrder(id);
        const res = await updateArticleOrder(id, parseInt(newOrder));
        setUpdatingOrder(null);
        if (!res.success) alert(res.message);
    };

    return (
        <div style={{ background: '#fff', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                    <tr>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280', width: '80px' }}>排序</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>圖片</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>標題</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>分類</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#6b7280' }}>操作</th>
                    </tr>
                </thead>
                <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                    {articles.map((article) => (
                        <tr key={article.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                            <td style={{ padding: '12px 16px' }}>
                                <input
                                    type="number"
                                    defaultValue={article.sort_order ?? 1000}
                                    onBlur={(e) => handleOrderChange(article.id, e.target.value)}
                                    // Make sure hitting enter triggers blur/change if needed
                                    onKeyDown={(e) => { if (e.key === 'Enter') e.target.blur(); }}
                                    style={{
                                        width: '60px',
                                        padding: '4px',
                                        border: '1px solid #d1d5db',
                                        borderRadius: '4px',
                                        textAlign: 'center',
                                        opacity: updatingOrder === article.id ? 0.5 : 1
                                    }}
                                />
                            </td>
                            <td style={{ padding: '12px 16px', width: '80px' }}>
                                <div style={{ width: '60px', height: '40px', background: '#eee', borderRadius: '4px', overflow: 'hidden' }}>
                                    {article.image_url ? (
                                        <img src={article.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                    ) : (
                                        <span style={{ fontSize: '0.7em', color: '#999', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>無圖</span>
                                    )}
                                </div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <div style={{ fontWeight: '500', color: '#111827' }}>{article.title}</div>
                                <div style={{ fontSize: '0.8em', color: '#6b7280' }}>ID: {article.id}</div>
                            </td>
                            <td style={{ padding: '12px 16px' }}>
                                <span style={{
                                    background: '#f3f4f6',
                                    padding: '2px 8px',
                                    borderRadius: '12px',
                                    fontSize: '0.8em',
                                    color: '#374151'
                                }}>
                                    {article.category || '未分類'}
                                </span>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <button
                                    onClick={() => handleRemove(article.id)}
                                    style={{
                                        background: '#fee2e2',
                                        border: 'none',
                                        color: '#ef4444',
                                        fontWeight: '500',
                                        padding: '4px 12px',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    移除
                                </button>
                            </td>
                        </tr>
                    ))}
                    {articles.length === 0 && (
                        <tr>
                            <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                                目前沒有推薦文章。
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
