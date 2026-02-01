"use client";

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import RenderMarkdown from '@/components/RenderMarkdown';

export default function ArticleEditor({ params }) {
    const resolvedParams = use(params);
    const isNew = resolvedParams.id === 'new';
    const router = useRouter();

    const [form, setForm] = useState({
        title: '',
        slug: '',
        category: '編輯精選',
        image_url: '',
        myvideo_url: '',
        is_pinned: false,
        content: `## 簡介\n\n\n## 亮點\n\n\n[myvideo-btn:SEARCH_OR_ID]`
    });
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!isNew) {
            fetchArticle();
        }
    }, [resolvedParams.id]);

    async function fetchArticle() {
        try {
            const res = await fetch(`/api/articles/${resolvedParams.id}`);
            const json = await res.json();
            if (json.success) {
                const data = json.data;
                setForm({
                    title: data.title,
                    slug: data.slug,
                    category: data.category || '編輯精選',
                    image_url: data.image_url,
                    myvideo_url: data.myvideo_url || '',
                    is_pinned: data.is_pinned === 1,
                    content: data.content
                });
            }
        } catch (e) {
            console.error(e);
            alert('載入失敗');
        } finally {
            setLoading(false);
        }
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);

        const method = isNew ? 'POST' : 'PUT';
        const url = isNew ? '/api/articles' : `/api/articles/${resolvedParams.id}`;

        try {
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            if (res.ok) {
                alert('儲存成功！');
                if (isNew) {
                    router.push('/admin/articles');
                }
            } else {
                const err = await res.json();
                alert('失敗: ' + err.error);
            }
        } catch (e) {
            alert('錯誤: ' + e.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) return <div className="p-8 text-center">載入中...</div>;

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">{isNew ? '新增文章' : '編輯文章'}</h2>
                <div className="space-x-4">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 bg-slate-700 rounded hover:bg-slate-600 transition"
                    >
                        取消
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={saving}
                        className="px-6 py-2 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-bold rounded shadow-lg transition disabled:opacity-50"
                    >
                        {saving ? '儲存中...' : '發布文章'}
                    </button>
                </div>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-6 overflow-hidden">
                {/* Form & Editor Column */}
                <div className="flex flex-col gap-4 overflow-y-auto pr-2 pb-10">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">標題</label>
                            <input
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-orange-500 focus:outline-none"
                                value={form.title}
                                onChange={e => setForm({ ...form, title: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Slug (網址代碼)</label>
                            <input
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-orange-500 focus:outline-none font-mono text-sm"
                                value={form.slug}
                                onChange={e => setForm({ ...form, slug: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">分類</label>
                            <select
                                className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-orange-500"
                                value={form.category}
                                onChange={e => setForm({ ...form, category: e.target.value })}
                            >
                                <option value="動畫介紹">動畫介紹 (單一)</option>

                                <option value="編輯精選">編輯精選</option>
                            </select>
                        </div>
                        <div className="flex items-center gap-2 pt-6">
                            <input
                                type="checkbox"
                                id="is_pinned"
                                checked={form.is_pinned}
                                onChange={e => setForm({ ...form, is_pinned: e.target.checked })}
                                className="w-5 h-5 accent-orange-500"
                            />
                            <label htmlFor="is_pinned" className="text-sm font-medium text-white cursor-pointer">
                                設為首頁置頂 (Banner)
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">封面圖片 URL</label>
                        <input
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-orange-500 focus:outline-none text-sm font-mono"
                            value={form.image_url}
                            onChange={e => setForm({ ...form, image_url: e.target.value })}
                            placeholder="https://youranimes.tw/images/..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">MyVideo 按鈕連結 (選填)</label>
                        <input
                            className="w-full bg-slate-800 border border-slate-700 rounded p-2 focus:border-orange-500 focus:outline-none text-sm font-mono"
                            value={form.myvideo_url}
                            onChange={e => setForm({ ...form, myvideo_url: e.target.value })}
                            placeholder="https://www.myvideo.net.tw/..."
                        />
                    </div>

                    <div className="flex-1 flex flex-col mt-4">
                        <label className="block text-sm font-medium text-slate-400 mb-1">內文 (Markdown)</label>
                        <textarea
                            className="flex-1 w-full bg-slate-800 border border-slate-700 rounded p-4 focus:border-orange-500 focus:outline-none font-mono text-sm leading-relaxed min-h-[400px]"
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                        />
                        <div className="text-xs text-slate-500 mt-2">
                            支援 Markdown: **Bold**, ## H2, - List, ![Alt](url), [myvideo-btn:url]
                        </div>
                    </div>
                </div>

                {/* Preview Column */}
                <div className="bg-white text-black p-8 rounded-xl overflow-y-auto shadow-inner h-full border border-slate-200">
                    <div className="max-w-[800px] mx-auto">
                        <h1 className="text-3xl font-bold mb-4">{form.title || '文章標題預覽'}</h1>
                        {form.image_url && !form.is_pinned && (
                            <img src={form.image_url} alt="Cover" className="w-full h-auto rounded mb-6 max-h-[400px] object-cover" />
                        )}
                        <div className="prose lg:prose-xl">
                            <RenderMarkdown content={form.content} isPinned={form.is_pinned} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
