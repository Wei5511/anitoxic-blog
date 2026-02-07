'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

export default function AnimeDetailClient({ initialAnime, relatedAnime, id }) {
    const router = useRouter();
    const [anime, setAnime] = useState(initialAnime || null);
    const [loading, setLoading] = useState(!initialAnime);
    const [error, setError] = useState(null);

    // Parsed Data
    const [staff, setStaff] = useState([]);
    const [cast, setCast] = useState([]);
    const [streaming, setStreaming] = useState([]);

    useEffect(() => {
        if (initialAnime) {
            parseJsonFields(initialAnime);
        } else {
            fetchAnimeDetails();
        }
    }, [id, initialAnime]);

    const parseJsonFields = (animeData) => {
        try { if (animeData.staff) setStaff(JSON.parse(animeData.staff)); } catch (e) { }
        try { if (animeData.cast) setCast(JSON.parse(animeData.cast)); } catch (e) { }
        try { if (animeData.streaming) setStreaming(JSON.parse(animeData.streaming)); } catch (e) { }
    };

    const fetchAnimeDetails = async () => {
        try {
            const response = await fetch(`/api/anime/${id}`);
            const data = await response.json();

            if (data.success) {
                const animeData = data.data;
                setAnime(animeData);
                parseJsonFields(animeData);
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('無法載入資料');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const getSeasonDisplayName = (season) => {
        const names = {
            winter: '1月',
            spring: '4月',
            summer: '7月',
            fall: '10月'
        };
        return names[season] || season;
    };

    if (loading) {
        return (
            <div className="container">
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>正在載入動漫資訊...</p>
                </div>
            </div>
        );
    }

    if (error || !anime) {
        return (
            <div className="container">
                <div className="empty-state">
                    <div className="empty-state-icon">😔</div>
                    <p>{error || '找不到這部動漫'}</p>
                    <Link href="/" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                        返回首頁
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container anime-detail">
            {/* 返回按鈕 */}
            <button
                onClick={() => router.back()}
                className="btn btn-secondary"
                style={{ marginBottom: '1.5rem' }}
            >
                ← 返回上一頁
            </button>

            {/* 標題區域 */}
            <div className="anime-detail-header">
                <div className="anime-detail-poster">
                    {anime.image_url ? (
                        <img src={anime.image_url} alt={anime.title} />
                    ) : (
                        <div style={{
                            aspectRatio: '3/4',
                            background: 'var(--bg-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '4rem'
                        }}>
                            🎬
                        </div>
                    )}
                </div>

                <div className="anime-detail-info">
                    <h1>{anime.title_chinese || anime.title}</h1>
                    {anime.title_chinese && anime.title !== anime.title_chinese && (
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', marginBottom: '0.5rem' }}>{anime.title}</p>
                    )}
                    {anime.title_japanese && (
                        <p className="anime-detail-title-jp">{anime.title_japanese}</p>
                    )}

                    <div className="anime-detail-stats">
                        {anime.score && (
                            <div className="stat-item">
                                <div className="stat-value">⭐ {anime.score.toFixed(1)}</div>
                                <div className="stat-label">評分</div>
                            </div>
                        )}
                        {anime.episodes && (
                            <div className="stat-item">
                                <div className="stat-value">{anime.episodes}</div>
                                <div className="stat-label">集數</div>
                            </div>
                        )}
                        {anime.year && anime.season && (
                            <div className="stat-item">
                                <div className="stat-value">{anime.year}</div>
                                <div className="stat-label">{getSeasonDisplayName(anime.season)}</div>
                            </div>
                        )}
                    </div>

                    {/* 標籤 */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        {anime.status && (
                            <span className="anime-card-tag" style={{
                                background: anime.status === 'Currently Airing' ? 'var(--primary-color)' : 'var(--bg-secondary)',
                                color: anime.status === 'Currently Airing' ? 'white' : 'var(--text-secondary)'
                            }}>
                                {anime.status === 'Currently Airing' ? '🔴 放送中' :
                                    anime.status === 'Finished Airing' ? '✅ 已完結' :
                                        anime.status === 'Not yet aired' ? '📅 未放送' : anime.status}
                            </span>
                        )}
                        {anime.rating && (
                            <span className="anime-card-tag">🔞 {anime.rating}</span>
                        )}
                    </div>

                    {/* 類型 - 僅在非預設值時顯示 */}
                    {anime.genres && anime.genres !== 'Action' && anime.genres !== 'Action, Adventure' && (
                        <div style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>類型: </strong>
                            <span style={{ color: 'var(--text-secondary)' }}>{anime.genres}</span>
                        </div>
                    )}

                    {/* 製作公司 */}
                    {anime.studios && (
                        <div style={{ marginBottom: '1rem' }}>
                            <strong style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>製作: </strong>
                            <span style={{ color: 'var(--text-secondary)' }}>{anime.studios}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* YouTube 預告片嵌入 (優先使用 youtube_id) */}
            {(anime.youtube_id || anime.trailer_url) && (
                <div className="embed-container">
                    <h2 className="embed-title">🎥 官方預告片</h2>
                    <div className="video-embed">
                        <iframe
                            src={anime.youtube_id ? `https://www.youtube.com/embed/${anime.youtube_id}` : anime.trailer_url}
                            title={`${anime.title} - 官方預告片`}
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        />
                    </div>
                </div>
            )}

            {/* 台灣播出資訊 */}
            {streaming.length > 0 && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>📺 台灣播出資訊 & 觀看平台</h2>
                    <div className="streaming-grid" style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                        {streaming.map((s, idx) => (
                            <a
                                key={idx}
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="action-btn"
                                style={{
                                    textDecoration: 'none',
                                    padding: '0.4rem 0.8rem',
                                    borderRadius: '4px',
                                    background: 'var(--bg-secondary)',
                                    color: 'var(--primary-color)',
                                    fontSize: '0.9rem',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.3rem'
                                }}
                            >
                                ▶️ {s.name}
                            </a>
                        ))}
                    </div>
                </div>
            )}

            {/* 簡介 / 內容 */}
            {(anime.content || anime.synopsis) && (
                <div style={{ marginTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>📝 故事簡介</h2>
                    {anime.content ? (
                        <div className="markdown-content">
                            <ReactMarkdown>{anime.content}</ReactMarkdown>
                        </div>
                    ) : (
                        <p className="anime-detail-synopsis">{anime.synopsis_chinese || anime.synopsis}</p>
                    )}
                </div>
            )}

            {/* 製作與聲優陣容 */}
            <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>

                {/* 製作陣容 */}
                {staff.length > 0 && (
                    <div>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🎬 製作陣容</h2>
                        <ul className="staff-list" style={{ listStyle: 'none', padding: 0 }}>
                            {staff.map((s, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ fontWeight: 'bold', minWidth: '80px' }}>{s.role}</span>
                                    <span style={{ color: 'var(--text-secondary)' }}>: {s.name}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* 聲優陣容 */}
                {cast.length > 0 && (
                    <div>
                        <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🎙️ 演出聲優</h2>
                        <ul className="cast-list" style={{ listStyle: 'none', padding: 0 }}>
                            {cast.map((c, idx) => (
                                <li key={idx} style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'baseline' }}>
                                    <span style={{ fontWeight: 'bold', minWidth: '80px' }}>{c.name}</span>
                                    {c.character && <span style={{ color: 'var(--text-secondary)' }}> ({c.character})</span>}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>

            {/* 官方連結區 */}
            <div style={{ marginTop: '2rem' }}>
                <h2 style={{ marginBottom: '1rem', fontSize: '1.5rem' }}>🔗 相關連結</h2>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <a
                        href={`https://myanimelist.net/anime/${anime.mal_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                    >
                        📊 MyAnimeList
                    </a>
                    <a
                        href={`https://twitter.com/search?q=${encodeURIComponent(anime.title_japanese || anime.title)}&src=typed_query`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                    >
                        🐦 Twitter 搜尋
                    </a>
                    <a
                        href={`https://www.youtube.com/results?search_query=${encodeURIComponent((anime.title_japanese || anime.title) + ' PV アニメ')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-secondary"
                    >
                        ▶️ YouTube 搜尋
                    </a>
                </div>
            </div>

            {/* 相關推薦 (Related Anime) */}
            {relatedAnime && relatedAnime.length > 0 && (
                <div style={{ marginTop: '3rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>✨ 你可能也會喜歡...</h2>
                    <div className="anime-grid">
                        {relatedAnime.map((item) => (
                            <Link
                                href={`/anime/${item.mal_id}`}
                                key={item.mal_id}
                                className="anime-card"
                            >
                                <div className="anime-card-image">
                                    {item.image_url ? (
                                        <img
                                            src={item.image_url}
                                            alt={item.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎬</div>
                                    )}
                                    {item.score && (
                                        <div className="anime-card-score">★ {item.score}</div>
                                    )}
                                </div>
                                <div className="anime-card-content">
                                    <h3 className="anime-card-title">{item.title_chinese || item.title}</h3>
                                    <div className="anime-card-meta">
                                        {item.year && (
                                            <span className="anime-card-tag">{item.year}</span>
                                        )}
                                        {item.episodes && (
                                            <span className="anime-card-tag">{item.episodes} 集</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
