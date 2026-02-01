'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticles();
    }, []);

    const fetchArticles = async () => {
        try {
            const response = await fetch('/api/articles');
            const data = await response.json();
            if (data.success) {
                setArticles(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ marginBottom: '0.5rem' }}>📝 新番推薦文章</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                每日精選動漫推薦，為您帶來最新新番資訊！
            </p>

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>正在載入文章...</p>
                </div>
            ) : articles.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">📰</div>
                    <p>還沒有文章，請執行文章生成腳本！</p>
                    <code style={{
                        display: 'block',
                        marginTop: '1rem',
                        background: 'var(--bg-card)',
                        padding: '1rem',
                        borderRadius: '0.5rem'
                    }}>
                        node scripts/generate-articles.js
                    </code>
                </div>
            ) : (
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {articles.map((article) => (
                        <Link
                            href={`/articles/${article.id}`}
                            key={article.id}
                            style={{ textDecoration: 'none' }}
                        >
                            <article style={{
                                background: 'var(--bg-card)',
                                borderRadius: '1rem',
                                padding: '1.5rem',
                                border: '1px solid var(--border-color)',
                                transition: 'all 0.3s ease',
                                cursor: 'pointer'
                            }}
                                className="anime-card"
                            >
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                                    {article.image_url && (
                                        <img
                                            src={article.image_url}
                                            alt={article.title}
                                            style={{
                                                width: '150px',
                                                height: '200px',
                                                objectFit: 'cover',
                                                borderRadius: '0.5rem'
                                            }}
                                        />
                                    )}
                                    <div style={{ flex: 1 }}>
                                        <span style={{
                                            background: 'var(--gradient-primary)',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '1rem',
                                            fontSize: '0.75rem',
                                            fontWeight: '600',
                                            marginBottom: '0.75rem',
                                            display: 'inline-block'
                                        }}>
                                            {article.category || '動漫推薦'}
                                        </span>
                                        <h2 style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '0.5rem',
                                            color: 'var(--text-primary)'
                                        }}>
                                            {article.title}
                                        </h2>
                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            marginBottom: '1rem',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 3,
                                            WebkitBoxOrient: 'vertical',
                                            overflow: 'hidden'
                                        }}>
                                            {article.excerpt}
                                        </p>
                                        <div style={{
                                            display: 'flex',
                                            gap: '1rem',
                                            color: 'var(--text-muted)',
                                            fontSize: '0.85rem'
                                        }}>
                                            <span>📅 {formatDate(article.published_at)}</span>
                                            <span>👤 動漫季刊編輯部</span>
                                        </div>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
}
