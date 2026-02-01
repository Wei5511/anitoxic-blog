"use client";
import { useState, useEffect } from 'react';

export default function BannerManager() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    async function fetchArticles() {
        setLoading(true);
        try {
            const res = await fetch('/api/articles');
            const data = await res.json();
            setArticles(data.data || []);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }

    async function togglePinned(id, currentStatus) {
        // Optimistic UI update
        setArticles(articles.map(a => a.id === id ? { ...a, is_pinned: !currentStatus ? 1 : 0 } : a));

        try {
            const article = articles.find(a => a.id === id);
            await fetch(`/api/articles/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...article,
                    is_pinned: !currentStatus // Toggle
                })
            });
        } catch (err) {
            alert('更新失敗');
            fetchArticles(); // Revert
        }
    }

    const pinnedArticles = articles.filter(a => a.is_pinned === 1);
    const otherArticles = articles.filter(a => a.is_pinned !== 1);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold">Banner 管理</h2>
                <button onClick={fetchArticles} className="text-sm text-slate-400 hover:text-white">重新整理</button>
            </div>

            <p className="text-slate-400">在這裡設定顯示於首頁 Hero 區塊的精選文章。</p>

            {/* Pinned Section */}
            <div className="bg-slate-800 rounded-xl border border-orange-500/50 shadow-lg shadow-orange-500/10 overflow-hidden">
                <div className="p-4 bg-gradient-to-r from-orange-900/50 to-slate-900 border-b border-orange-500/30">
                    <h3 className="font-bold text-orange-400 flex items-center gap-2">
                        ⭐ 目前置頂 ({pinnedArticles.length})
                    </h3>
                </div>
                {pinnedArticles.length === 0 ? (
                    <div className="p-8 text-center text-slate-500">目前沒有置頂文章</div>
                ) : (
                    <ul className="divide-y divide-slate-700">
                        {pinnedArticles.map(article => (
                            <li key={article.id} className="p-4 flex justify-between items-center hover:bg-slate-700/30 transition">
                                <div className="flex items-center gap-4">
                                    <img src={article.image_url} className="w-16 h-10 object-cover rounded" alt="" />
                                    <div>
                                        <div className="font-medium text-white">{article.title}</div>
                                        <div className="text-xs text-slate-500">{new Date(article.published_at).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => togglePinned(article.id, true)}
                                    className="px-3 py-1 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded text-sm transition"
                                >
                                    移除置頂
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Others Section */}
            <div className="bg-slate-800 rounded-xl border border-slate-700 overflow-hidden">
                <div className="p-4 border-b border-slate-700">
                    <h3 className="font-bold text-slate-300">其他文章</h3>
                </div>
                <ul className="divide-y divide-slate-700 max-h-[600px] overflow-y-auto">
                    {otherArticles.map(article => (
                        <li key={article.id} className="p-4 flex justify-between items-center hover:bg-slate-700/30 transition">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-10 bg-slate-900 rounded flex items-center justify-center text-xs text-slate-600">
                                    {article.category}
                                </div>
                                <div>
                                    <div className="font-medium text-slate-300">{article.title}</div>
                                    <div className="text-xs text-slate-600">ID: {article.id}</div>
                                </div>
                            </div>
                            <button
                                onClick={() => togglePinned(article.id, false)}
                                className="px-3 py-1 bg-slate-600 hover:bg-orange-600 text-white rounded text-sm transition"
                            >
                                設為置頂
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
