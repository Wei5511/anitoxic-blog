'use client';

import { useState } from 'react';
import Link from 'next/link';
import RenderMarkdown from '@/components/RenderMarkdown';

export default function ArticleDetailClient({ article }) {
    if (!article) return <EmptyState />;

    const content = article.content;
    const isPinned = article.is_pinned === 1;
    const hasDetailedInfo = article.name_jp || article.studio;

    // Helper to format date
    const formatDate = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, ' / ');
    };

    // --- 佈局邏輯分流 ---

    // 1. 置頂文章或編輯精選佈局 (IncG Style)
    if (isPinned || article.category === '編輯精選' || article.category === '動畫介紹') {
        return (
            <div style={styles.pinnedContainer}>
                {/* 頂部導航 */}
                <div style={styles.breadcrumb}>
                    <Link href="/" style={styles.breadcrumbLink}>首頁</Link>
                    <span style={styles.breadcrumbSep}>/</span>
                    <span style={styles.breadcrumbCurrent}>{article.category || '編輯精選'}</span>
                </div>

                <div style={styles.pinnedHeader}>
                    <h1 style={styles.pinnedTitle}>{article.title}</h1>
                    <div style={styles.pinnedMeta}>
                        <span style={styles.date}>{formatDate(article.published_at)}</span>
                    </div>
                </div>

                {/* Subtitle / Excerpt Display if exists */}
                {article.excerpt && (
                    <div style={styles.excerpt}>
                        {article.excerpt}
                    </div>
                )}

                <div style={styles.pinnedContent}>
                    {content.trim().startsWith('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <RenderMarkdown content={content} isPinned={true} />
                    )}
                </div>

                {/* MyVideo Link */}
                {article.myvideo_url && (
                    <div style={{ textAlign: 'center', margin: '4rem 0' }}>
                        <a
                            href={article.myvideo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={styles.btnMyVideoLarge}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                        >
                            🎬 前往 MyVideo 線上觀看
                        </a>
                    </div>
                )}

                <div style={styles.footerNav}>
                    <button
                        onClick={() => window.history.back()}
                        style={{ ...styles.btnBack, cursor: 'pointer' }}
                    >
                        ← 返回上一頁
                    </button>
                </div>
            </div>
        );
    }

    // 2. 單集文章佈局 (Standard Style)
    return (
        <div style={styles.container}>
            {/* 頂部導航 */}
            <div style={styles.breadcrumb}>
                <Link href="/" style={styles.breadcrumbLink}>首頁</Link>
                <span style={styles.breadcrumbSep}>/</span>
                <Link href="/" style={styles.breadcrumbLink}>{article.title.split(' ')[0]}</Link>
                <span style={styles.breadcrumbSep}>/</span>
                <span style={styles.breadcrumbCurrent}>{article.title}</span>
            </div>

            <div style={styles.mainGrid}>
                {/* 左側資訊欄 (Sidebar) */}
                <div style={styles.sidebar}>
                    {hasDetailedInfo && (
                        <div style={styles.infoCard}>
                            <h3 style={styles.infoTitle}>作品資訊 / INFO</h3>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>原名</span>
                                <span style={styles.infoValue}>{article.name_jp || '-'}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>製作</span>
                                <span style={styles.infoValue}>{article.studio || '-'}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>更新</span>
                                <span style={styles.infoValue}>{article.update_time || '-'}</span>
                            </div>
                            <div style={styles.infoRow}>
                                <span style={styles.infoLabel}>集數</span>
                                <span style={styles.infoValue}>{article.total_episodes ? `${article.total_episodes} 話` : '-'}</span>
                            </div>

                            {article.tags && article.tags.length > 0 && (
                                <div style={styles.tagsContainer}>
                                    {article.tags.map((tag, i) => (
                                        <span key={i} style={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            )}

                            <div style={styles.actionArea}>
                                {article.myvideo_url && (
                                    <a href={article.myvideo_url} target="_blank" rel="noopener noreferrer" style={styles.btnMyVideo}>
                                        MyVideo線上看
                                    </a>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* 右側內容欄 */}
                <div style={styles.contentArea}>
                    <header style={styles.articleHeader}>
                        {(article.season || article.category) && (
                            <span style={styles.seasonBadge}>{article.season || article.category}</span>
                        )}
                        <h1 style={styles.title}>{article.title}</h1>
                        <div style={styles.meta}>
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                    </header>

                    {article.excerpt && (
                        <div style={styles.excerpt}>
                            {article.excerpt}
                        </div>
                    )}

                    <div style={styles.articleBody}>
                        <div style={styles.markdownContent}>
                            {content.trim().startsWith('<') ? (
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                                <RenderMarkdown content={content} isPinned={false} />
                            )}
                        </div>
                    </div>

                    {article.myvideo_url && (
                        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
                            <a
                                href={article.myvideo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={styles.btnMyVideoLarge}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                🎬 前往 MyVideo 線上觀看
                            </a>
                        </div>
                    )}

                    {/* Staff & Cast removed for brevity if empty, kept structure */}
                    {(article.staff || article.cast) && (
                        <div style={styles.creditsSection}>
                            {/* ... implementation ... */}
                        </div>
                    )}
                </div>
            </div>

            <div style={styles.footerNav}>
                <Link href="/" style={styles.btnBack}>
                    ← 返回文章列表
                </Link>
            </div>
        </div>
    );
}

const EmptyState = () => (
    <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>找不到文章</h2>
        <Link href="/">返回首頁</Link>
    </div>
);

const styles = {
    container: {
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '40px 20px',
        fontFamily: '"Helvetica Neue", Helvetica, Arial, sans-serif',
        color: '#333',
    },
    footerNav: {
        textAlign: 'center',
        marginTop: '60px',
        paddingTop: '30px',
        borderTop: '1px solid #eee',
    },
    btnBack: {
        display: 'inline-block',
        padding: '12px 30px',
        border: '1px solid #333',
        background: '#fff',
        color: '#333',
        borderRadius: '0',
        textDecoration: 'none',
        fontSize: '0.9em',
        letterSpacing: '1px',
        transition: 'all 0.2s',
    },
    pinnedContainer: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px 20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: '1.8',
        color: '#222',
    },
    pinnedHeader: {
        textAlign: 'center',
        marginBottom: '30px',
    },
    pinnedTitle: {
        fontSize: '2.8em',
        fontWeight: '800',
        marginBottom: '20px',
        lineHeight: '1.3',
        letterSpacing: '-0.5px',
    },
    pinnedMeta: {
        fontSize: '0.9em',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    pinnedContent: {
        fontSize: '1.15em',
    },
    breadcrumb: {
        marginBottom: '30px',
        fontSize: '0.85em',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    breadcrumbLink: {
        textDecoration: 'none',
        color: '#999',
        margin: '0 5px',
    },
    breadcrumbSep: { margin: '0 5px' },
    breadcrumbCurrent: { color: '#333', margin: '0 5px', fontWeight: 'bold' },
    mainGrid: {
        display: 'grid',
        gridTemplateColumns: '320px 1fr',
        gap: '60px',
        alignItems: 'start',
    },
    sidebar: {
        position: 'sticky',
        top: '40px',
    },
    infoCard: {
        padding: '30px 0',
        borderTop: '4px solid #000',
        background: '#fff',
    },
    infoTitle: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '1em',
        fontWeight: 'bold',
        letterSpacing: '2px',
        textTransform: 'uppercase',
    },
    infoRow: {
        display: 'flex',
        justifyContent: 'space-between',
        marginBottom: '12px',
        fontSize: '0.9em',
        borderBottom: '1px solid #f0f0f0',
        paddingBottom: '8px',
    },
    infoLabel: { color: '#888', flexShrink: 0, marginRight: '10px' },
    infoValue: { fontWeight: '500', textAlign: 'right', color: '#000' },
    tagsContainer: {
        marginTop: '20px',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
    },
    tag: {
        background: '#f5f5f5',
        padding: '4px 10px',
        fontSize: '0.75em',
        color: '#666',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    btnMyVideo: {
        display: 'block',
        background: '#000',
        color: '#fff',
        textAlign: 'center',
        padding: '15px',
        marginTop: '20px',
        textDecoration: 'none',
        fontWeight: 'bold',
        fontSize: '0.9em',
        letterSpacing: '1px',
        transition: 'background 0.2s',
    },
    btnMyVideoLarge: {
        display: 'inline-block',
        background: '#FF6600',
        color: '#fff',
        padding: '16px 50px',
        fontSize: '1.2rem',
        fontWeight: 'bold',
        textDecoration: 'none',
        borderRadius: '50px',
        boxShadow: '0 4px 15px rgba(255, 102, 0, 0.3)',
        transition: 'transform 0.2s',
    },
    contentArea: {},
    articleHeader: { marginBottom: '40px' },
    seasonBadge: {
        background: '#ff6600',
        color: '#fff',
        padding: '4px 8px',
        fontSize: '0.75em',
        fontWeight: 'bold',
        marginBottom: '15px',
        display: 'inline-block',
        textTransform: 'uppercase',
        letterSpacing: '1px',
    },
    title: {
        fontSize: '2.5em',
        margin: '10px 0 20px 0',
        lineHeight: '1.2',
        fontWeight: '700',
        fontFamily: '"Georgia", serif',
    },
    meta: {
        color: '#999',
        fontSize: '0.85em',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    articleBody: {
        fontSize: '1.1em',
        lineHeight: '1.9',
        marginBottom: '60px',
        color: '#222',
        fontFamily: '"Georgia", serif',
    },
    excerpt: {
        fontSize: '1.2em',
        fontStyle: 'italic',
        color: '#666',
        marginBottom: '40px',
        lineHeight: '1.6',
        borderLeft: '3px solid #ff6600',
        paddingLeft: '20px',
    },
    creditsSection: {
        background: '#f9f9f9',
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        borderTop: '1px solid #eee',
    },
};
