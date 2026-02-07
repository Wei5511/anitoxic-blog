'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateAnime } from '@/app/actions/anime';

export default function AnimeEditForm({ anime }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: anime.title || '',
        title_chinese: anime.title_chinese || '',
        content: anime.content || '',
        is_published: !!anime.is_published
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await updateAnime(anime.mal_id, formData);
            if (res.success) {
                alert('更新成功！');
                router.refresh();
            } else {
                alert('更新失敗：' + res.error);
            }
        } catch (error) {
            console.error(error);
            alert('發生錯誤');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '800px', background: 'white', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    標題 (English / Default)
                </label>
                <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    中文標題
                </label>
                <input
                    type="text"
                    name="title_chinese"
                    value={formData.title_chinese}
                    onChange={handleChange}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem' }}
                />
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '500', color: '#374151' }}>
                    內容 / 評價 (Content)
                </label>
                <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    rows={10}
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', resize: 'vertical' }}
                    placeholder="輸入動漫詳細介紹或評價..."
                />
            </div>

            <div style={{ marginBottom: '2rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                    <input
                        type="checkbox"
                        name="is_published"
                        checked={formData.is_published}
                        onChange={handleChange}
                        style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.75rem' }}
                    />
                    <span style={{ fontWeight: '500', color: '#374151' }}>發布狀態 (Is Published)</span>
                </label>
                <p style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280', marginLeft: '2rem' }}>
                    勾選後，此動漫將顯示為「已發布」。(目前前台邏輯尚未強制過濾，僅供標記使用)
                </p>
            </div>

            <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        cursor: disabled => disabled ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? '儲存中...' : '儲存變更'}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    style={{
                        padding: '0.75rem 1.5rem',
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '0.375rem',
                        fontWeight: '500',
                        cursor: 'pointer'
                    }}
                >
                    取消
                </button>
            </div>
        </form>
    );
}
