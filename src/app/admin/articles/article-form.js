'use client';

import { saveArticle } from '@/app/actions/articles';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticleForm({ article }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showReference, setShowReference] = useState(false);
    const contentRef = useRef(null);

    const insertMarkdown = (type) => {
        const textarea = contentRef.current;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = textarea.value.substring(start, end);
        const beforeText = textarea.value.substring(0, start);
        const afterText = textarea.value.substring(end);

        let insertText = '';
        let cursorOffset = 0;

        switch (type) {
            case 'image':
                const imageUrl = prompt('請輸入圖片網址 (例如: https://d28s5ztqvkii64.cloudfront.net/...)');
                if (imageUrl) {
                    const altText = prompt('請輸入圖片替代文字 (描述)') || '圖片';
                    insertText = `![${altText}](${imageUrl})`;
                    cursorOffset = insertText.length;
                }
                break;

            case 'link':
                const linkUrl = prompt('請輸入連結網址');
                if (linkUrl) {
                    const linkText = selectedText || prompt('請輸入連結文字') || '連結';
                    insertText = `[${linkText}](${linkUrl})`;
                    cursorOffset = insertText.length;
                }
                break;

            case 'bold':
                insertText = selectedText ? `**${selectedText}**` : `**文字**`;
                cursorOffset = selectedText ? insertText.length : 2;
                break;

            case 'italic':
                insertText = selectedText ? `*${selectedText}*` : `*文字*`;
                cursorOffset = selectedText ? insertText.length : 1;
                break;

            case 'heading':
                insertText = selectedText ? `## ${selectedText}` : `## 標題`;
                cursorOffset = selectedText ? insertText.length : 3;
                break;
        }

        if (insertText) {
            textarea.value = beforeText + insertText + afterText;
            textarea.focus();
            textarea.setSelectionRange(
                start + cursorOffset,
                start + cursorOffset
            );
        }
    };

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

            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>文章副標題 (Subtitle/Excerpt)</label>
                <textarea
                    name="excerpt"
                    defaultValue={article?.excerpt}
                    rows={3}
                    placeholder="簡短描述文章內容，將顯示於列表卡片中..."
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px', fontFamily: 'inherit' }}
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

                {/* Markdown Toolbar */}
                <div style={{
                    background: '#f9fafb',
                    padding: '0.75rem',
                    borderRadius: '4px 4px 0 0',
                    border: '1px solid #d1d5db',
                    borderBottom: 'none',
                    display: 'flex',
                    gap: '0.5rem',
                    flexWrap: 'wrap'
                }}>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('image')}
                        style={toolbarButtonStyle}
                        title="插入圖片"
                    >
                        🖼️ 圖片
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('link')}
                        style={toolbarButtonStyle}
                        title="插入連結"
                    >
                        🔗 連結
                    </button>
                    <div style={{ width: '1px', background: '#d1d5db', margin: '0 0.25rem' }}></div>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('bold')}
                        style={toolbarButtonStyle}
                        title="粗體"
                    >
                        <strong>B</strong>
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('italic')}
                        style={toolbarButtonStyle}
                        title="斜體"
                    >
                        <em>I</em>
                    </button>
                    <button
                        type="button"
                        onClick={() => insertMarkdown('heading')}
                        style={toolbarButtonStyle}
                        title="標題"
                    >
                        H2
                    </button>
                    <div style={{ width: '1px', background: '#d1d5db', margin: '0 0.25rem' }}></div>
                    <button
                        type="button"
                        onClick={() => setShowReference(!showReference)}
                        style={{ ...toolbarButtonStyle, marginLeft: 'auto' }}
                        title="Markdown 參考"
                    >
                        📖 參考
                    </button>
                </div>

                {/* Markdown Reference Panel */}
                {showReference && (
                    <div style={{
                        background: '#fffbeb',
                        border: '1px solid #fbbf24',
                        borderTop: 'none',
                        padding: '1rem',
                        fontSize: '0.85rem',
                        fontFamily: 'monospace',
                        lineHeight: '1.6'
                    }}>
                        <strong>Markdown 快速參考：</strong><br />
                        <strong>圖片：</strong> ![替代文字](圖片網址)<br />
                        <strong>連結：</strong> [連結文字](網址)<br />
                        <strong>粗體：</strong> **文字** 或 __文字__<br />
                        <strong>斜體：</strong> *文字* 或 _文字_<br />
                        <strong>標題：</strong> ## 標題文字<br />
                        <strong>分隔線：</strong> ---
                    </div>
                )}

                <textarea
                    ref={contentRef}
                    name="content"
                    defaultValue={article?.content}
                    rows={15}
                    style={{
                        width: '100%',
                        padding: '0.75rem',
                        border: '1px solid #d1d5db',
                        borderRadius: showReference ? '0' : '0 0 4px 4px',
                        borderTop: showReference ? 'none' : '1px solid #d1d5db',
                        fontFamily: 'monospace',
                        fontSize: '0.9rem',
                        lineHeight: '1.6'
                    }}
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

// Toolbar button styles
const toolbarButtonStyle = {
    padding: '0.5rem 1rem',
    background: '#fff',
    border: '1px solid #d1d5db',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#374151',
    transition: 'all 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '0.25rem'
};
