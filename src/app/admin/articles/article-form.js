'use client';

import { saveArticle } from '@/app/actions/articles';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticleForm({ article }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const formData = new FormData(e.target);
        if (article?.id) {
            formData.append('id', article.id);
        }

        const res = await saveArticle(formData);

        if (res.success) {
            router.push('/admin/articles');
            router.refresh(); // Refresh data to show updates
        } else {
            setError(res.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            {error && <div style={{ marginBottom: '1rem', color: 'red', fontWeight: 'bold' }}>{error}</div>}

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>文章標題 (Title)</label>
                <input
                    name="title"
                    defaultValue={article?.title}
                    required
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>文章分類 (Category)</label>
                    <select
                        name="category"
                        defaultValue={article?.category || '新聞快訊'}
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    >
                        <option value="新聞快訊">新聞快訊</option>
                        <option value="編輯精選">編輯精選</option>
                        <option value="動畫介紹">動畫介紹</option>
                        <option value="每週更新">每週更新</option>
                    </select>
                </div>
                <div>
                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>MyVideo 連結</label>
                    <input
                        name="myvideo_url"
                        defaultValue={article?.myvideo_url}
                        placeholder="https://www.myvideo.net.tw/..."
                        style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    />
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>縮圖網址 (Image URL)</label>
                <input
                    name="image_url"
                    defaultValue={article?.image_url}
                    placeholder="https://..."
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '0.5rem' }}
                />
                <div style={{ fontSize: '0.85rem', color: '#6b7280' }}>
                    建議: 使用 Cloudfront 連結以獲得最佳效能。
                </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>文章內容 (Markdown)</label>
                <textarea
                    name="content"
                    defaultValue={article?.content}
                    rows={15}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: 'monospace' }}
                />
            </div>

            <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center' }}>
                <input
                    type="checkbox"
                    name="is_pinned"
                    id="is_pinned"
                    defaultChecked={article?.is_pinned === 1}
                    style={{ width: '20px', height: '20px', marginRight: '0.5rem' }}
                />
                <label htmlFor="is_pinned" style={{ fontWeight: '600', cursor: 'pointer' }}>設為精選文章 (Pin to Top)</label>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    type="button"
                    onClick={() => router.back()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#e5e7eb',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: '600',
                        cursor: 'pointer'
                    }}
                >
                    取消
                </button>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#111827',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? '儲存中...' : '儲存文章'}
                </button>
            </div>
        </form>
    );
}
