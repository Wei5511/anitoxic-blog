'use client';

import { toggleArticlePin, deleteArticle, updateArticleOrder, toggleArticleRecommendation } from '@/app/actions/articles';
import { useState } from 'react';
import Link from 'next/link';

export default function ArticleListClient({ articles }) {
    const [isDeleting, setIsDeleting] = useState(null);
    const [updatingOrder, setUpdatingOrder] = useState(null);

    const handleDelete = async (id) => {
        if (!confirm('確定要刪除這篇文章嗎？此動作無法復原。')) return;

        setIsDeleting(id);
        const res = await deleteArticle(id);
        setIsDeleting(null);

        if (!res.success) alert(res.message);
    };

    const handleTogglePin = async (id, currentVal) => {
        const res = await toggleArticlePin(id, currentVal);
        if (!res.success) alert(res.message);
    };

    const handleToggleRecommendation = async (id, currentVal) => {
        const res = await toggleArticleRecommendation(id, currentVal);
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
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>精選</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#6b7280' }}>推薦</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#6b7280' }}>發布日期</th>
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
                                    // Make sure hitting enter triggers blur/change if needed, or just let onBlur handle it
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
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleTogglePin(article.id, article.is_pinned)}
                                    title={article.is_pinned ? "取消精選" : "設為精選"}
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        width: '40px',
                                        height: '24px',
                                        borderRadius: '999px',
                                        background: article.is_pinned ? '#10b981' : '#e5e7eb',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: article.is_pinned ? '18px' : '2px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: '#fff',
                                        transition: 'left 0.2s',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }} />
                                </button>
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                                <button
                                    onClick={() => handleToggleRecommendation(article.id, article.is_recommended)}
                                    title={article.is_recommended ? "取消推薦" : "設為推薦"}
                                    style={{
                                        position: 'relative',
                                        display: 'inline-block',
                                        width: '40px',
                                        height: '24px',
                                        borderRadius: '999px',
                                        background: article.is_recommended ? '#3b82f6' : '#e5e7eb',
                                        border: 'none',
                                        cursor: 'pointer',
                                        transition: 'background 0.2s'
                                    }}
                                >
                                    <span style={{
                                        position: 'absolute',
                                        top: '2px',
                                        left: article.is_recommended ? '18px' : '2px',
                                        width: '20px',
                                        height: '20px',
                                        borderRadius: '50%',
                                        background: '#fff',
                                        transition: 'left 0.2s',
                                        boxShadow: '0 1px 2px rgba(0,0,0,0.2)'
                                    }} />
                                </button>
                            </td>
                            <td style={{ padding: '12px 16px', color: '#6b7280' }}>
                                {new Date(article.published_at).toLocaleDateString()}
                            </td>
                            <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                                <Link href={`/admin/articles/${article.id}`} style={{
                                    display: 'inline-block',
                                    marginRight: '8px',
                                    color: '#2563eb',
                                    fontWeight: '500',
                                    textDecoration: 'none'
                                }}>
                                    編輯
                                </Link>
                                <button
                                    onClick={() => handleDelete(article.id)}
                                    disabled={isDeleting === article.id}
                                    style={{
                                        background: 'transparent',
                                        border: 'none',
                                        color: '#ef4444',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        opacity: isDeleting === article.id ? 0.5 : 1
                                    }}
                                >
                                    {isDeleting === article.id ? '...' : '刪除'}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {articles.length === 0 && (
                        <tr>
                            <td colSpan="6" style={{ padding: '24px', textAlign: 'center', color: '#6b7280' }}>
                                這裡還沒有文章。
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
