'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import RenderMarkdown from '@/components/RenderMarkdown';

export default function ArticleDetailPage({ params }) {
    const resolvedParams = use(params);
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchArticle();
    }, [resolvedParams.id]);

    const fetchArticle = async () => {
        try {
            const response = await fetch(`/api/articles/${resolvedParams.id}`);
            const data = await response.json();
            if (data.success) {
                setArticle(data.data);
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
            month: '2-digit',
            day: '2-digit'
        }).replace(/\//g, ' / ');
    };

    if (loading) return <LoadingState />;
    if (!article) return <EmptyState />;

    const content = article.content;
    const isPinned = article.is_pinned === 1;
    const hasDetailedInfo = article.name_jp || article.studio;

    // --- 佈局邏輯分流 ---

    // 1. 置頂文章或編輯精選佈局 (IncG Style): 單欄、置中、大圖、強調閱讀體驗
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
                        {/* Author removed */}
                        <span style={styles.date}>{formatDate(article.published_at)}</span>
                    </div>
                </div>

                {/* 主圖 (如果有的話，通常 markdown 第一張圖會重複這裡，所以可以選擇不顯示 header image，或者只顯示 markdown) 
                    種子腳本中 markdown 已經包含圖片，這裡就不重複顯示 cover image，除非是純文字文章。
                    為了美觀，我們依賴 markdown 內的圖片排版。
                */}

                <div style={styles.pinnedContent}>
                    {content.trim().startsWith('<') ? (
                        <div dangerouslySetInnerHTML={{ __html: content }} />
                    ) : (
                        <RenderMarkdown content={content} isPinned={true} />
                    )}
                </div>

                {/* USER REQUEST: 每一篇文章都要加上MyVideo線上看的連結 */}
                {article.myvideo_url && (
                    <div style={{ textAlign: 'center', margin: '4rem 0' }}>
                        <a
                            href={article.myvideo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                                display: 'inline-block',
                                background: '#FF6600', // MyVideo Orange
                                color: '#fff',
                                padding: '18px 60px',
                                fontSize: '1.2rem',
                                fontWeight: 'bold',
                                textDecoration: 'none',
                                borderRadius: '50px',
                                boxShadow: '0 4px 15px rgba(255, 102, 0, 0.3)',
                                transition: 'transform 0.2s',
                            }}
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

    // 2. 單集文章佈局 (Marie Claire / Review Style): 側邊欄資訊、左側內容
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
                    {/* USER UPDATE: 移除左側重複圖片，僅保留資訊卡 */}
                    {/* <div style={styles.posterContainer}>
                        <img
                            src={article.image_url}
                            alt={article.title}
                            style={styles.poster}
                            referrerPolicy="no-referrer"
                            onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML = '<div style="padding:20px;text-align:center;color:#999;background:#eee">暫無圖片</div>';
                            }}
                        />
                    </div> */}

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

                            {/* Sidebar Button (Small) */}
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

                {/* 右側內容欄 (Main Content) */}
                <div style={styles.contentArea}>
                    <header style={styles.articleHeader}>
                        {(article.season || article.category) && (
                            <span style={styles.seasonBadge}>{article.season || article.category}</span>
                        )}
                        <h1 style={styles.title}>{article.title}</h1>
                        <div style={styles.meta}>
                            {/* Editor removed */}
                            <span>{formatDate(article.published_at)}</span>
                        </div>
                    </header>

                    {/* 內文區域 */}
                    <div style={styles.articleBody}>
                        <div style={styles.markdownContent}>
                            {content.trim().startsWith('<') ? (
                                <div dangerouslySetInnerHTML={{ __html: content }} />
                            ) : (
                                <RenderMarkdown content={content} isPinned={false} />
                            )}
                        </div>
                    </div>

                    {/* USER REQUEST: 增加明顯的觀看連結按鈕 */}
                    {article.myvideo_url && (
                        <div style={{ textAlign: 'center', margin: '3rem 0' }}>
                            <a
                                href={article.myvideo_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
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
                                }}
                                onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                                onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                            >
                                🎬 前往 MyVideo 線上觀看
                            </a>
                        </div>
                    )}

                    {/* Staff & Cast 區塊 */}
                    {(article.staff || article.cast) && (
                        <div style={styles.creditsSection}>
                            {article.staff && article.staff.length > 0 && (
                                <div style={styles.creditBlock}>
                                    <h3 style={styles.creditTitle}>STAFF</h3>
                                    <ul style={styles.creditList}>
                                        {article.staff.map((s, i) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                            )}
                            {article.cast && article.cast.length > 0 && (
                                <div style={styles.creditBlock}>
                                    <h3 style={styles.creditTitle}>CAST</h3>
                                    <ul style={styles.creditList}>
                                        {article.cast.map((c, i) => <li key={i}>{c}</li>)}
                                    </ul>
                                </div>
                            )}
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


// 增強版 Markdown 渲染器移至 shared components
// import RenderMarkdown from '@/components/RenderMarkdown'; // Already imported at top

// Styles object truncated for brevity, but actually I need to KEEP the styles for the Layout itself (container, header etc)
// I only moved the Markdown-specific styles to the component.
// But wait, the component imports its own styles.
// So I should remove the MD styles from this file's styles object?
// Yes.

// ... keeping styles object ...
// Actually, I'll just keep the styles object but remove RenderMarkdown function definition.

// Wait, I need to make sure I don't delete the `styles` object which uses lines 344-626.
// I will just delete the RenderMarkdown function definition (lines 246-331).


const LoadingState = () => (
    <div style={{ padding: '100px', textAlign: 'center' }}>載入中...</div>
);

const EmptyState = () => (
    <div style={{ padding: '100px', textAlign: 'center' }}>
        <h2>找不到文章</h2>
        <Link href="/">返回首頁</Link>
    </div>
);

const styles = {
    // 共用
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

    // --- Pinned Article Styles (IncG imitation) ---
    pinnedContainer: {
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px 20px', // USER REQUEST: 減少留白 (60px -> 20px)
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        lineHeight: '1.8',
        color: '#222',
    },
    pinnedHeader: {
        textAlign: 'center',
        marginBottom: '30px', // Tightened from 50px
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
    pinnedH2: {
        fontSize: '1.6em', // Slightly smaller
        marginTop: '20px', // Tighter
        marginBottom: '15px', // Tighter
        textAlign: 'left', // More blog-like
        fontWeight: 'bold',
        position: 'relative',
        paddingBottom: '10px',
        borderBottom: '2px solid #eee', // Subtle underline
    },
    pinnedP: {
        marginBottom: '0.8em', // Tighter paragraphs
        fontSize: '1em', // Slightly smaller for readability
        textAlign: 'left', // More natural reading
        lineHeight: '1.7', // Comfortable but compact
    },
    pinnedImageContainer: {
        margin: '40px 0',
        textAlign: 'center',
    },
    pinnedImage: {
        maxWidth: '100%',
        height: 'auto',
        borderRadius: '4px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
    },

    // --- Episode Article Styles (Marie Claire imitation) ---
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
        gridTemplateColumns: '320px 1fr', // Sidebar width
        gap: '60px',
        alignItems: 'start',
    },
    // Sidebar
    sidebar: {
        position: 'sticky',
        top: '40px',
    },
    posterContainer: {
        marginBottom: '30px',
        borderRadius: '0', // Sharp corners for editorial feel
        overflow: 'hidden',
    },
    poster: {
        width: '100%',
        height: 'auto',
        display: 'block',
    },
    infoCard: {
        padding: '30px 0',
        borderTop: '4px solid #000', // Strong accent
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

    // Content Area
    contentArea: {},
    articleHeader: { marginBottom: '40px' },
    seasonBadge: {
        background: '#ff6600', // Orange accent
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
        fontFamily: '"Georgia", serif', // Editorial feel
    },
    meta: {
        color: '#999',
        fontSize: '0.85em',
        letterSpacing: '1px',
        textTransform: 'uppercase',
    },
    separator: { margin: '0 10px', color: '#ddd' },

    // Body
    articleBody: {
        fontSize: '1.1em',
        lineHeight: '1.9',
        marginBottom: '60px',
        color: '#222',
        fontFamily: '"Georgia", serif', // Editorial feel for body text
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
    imageCaption: {
        fontSize: '0.8em',
        color: '#999',
        marginTop: '10px',
        textAlign: 'center',
        fontStyle: 'italic',
    },

    // Markdown Styles
    mdH2: {
        fontSize: '1.5em',
        marginTop: '2em',
        marginBottom: '1em',
        fontWeight: 'bold',
        fontFamily: '"Helvetica Neue", sans-serif',
        textTransform: 'uppercase',
        letterSpacing: '1px',
        borderBottom: '2px solid #000',
        paddingBottom: '10px',
        display: 'inline-block',
    },
    mdH3: {
        fontSize: '1.2em',
        marginTop: '1.5em',
        marginBottom: '0.8em',
        fontWeight: 'bold',
    },
    mdP: { marginBottom: '1.5em' },
    mdLi: { marginLeft: '20px', marginBottom: '0.5em' },
    mdHr: { border: 'none', borderTop: '1px solid #eee', margin: '50px 0' },
    itemImage: { margin: '40px 0' },
    itemImageImg: {
        maxWidth: '100%',
        height: 'auto',
        display: 'block',
    },

    // Credits
    creditsSection: {
        background: '#f9f9f9',
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '40px',
        borderTop: '1px solid #eee',
    },
    creditTitle: {
        marginTop: 0,
        marginBottom: '20px',
        fontSize: '0.9em',
        color: '#999',
        textTransform: 'uppercase',
        letterSpacing: '2px',
        borderBottom: '1px solid #ddd',
        paddingBottom: '10px',
    },
    creditList: {
        listStyle: 'none',
        padding: 0,
        margin: 0,
        fontSize: '0.9em',
        color: '#333',
        lineHeight: '2',
    },
};
