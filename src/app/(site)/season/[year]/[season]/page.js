'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';

export default function SeasonPage({ params }) {
    const resolvedParams = use(params);
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const year = parseInt(resolvedParams.year);
    const season = resolvedParams.season;

    useEffect(() => {
        fetchSeasonAnime();
    }, [year, season]);

    const fetchSeasonAnime = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/sync?year=${year}&season=${season}`);
            const data = await response.json();

            if (data.success) {
                setAnimeList(data.data);
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

    const getSeasonDisplayName = (s) => {
        const names = { winter: '1月', spring: '4月', summer: '7月', fall: '10月' };
        return names[s] || s;
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
                ← 返回首頁
            </Link>

            <h1 style={{ marginBottom: '0.5rem' }}>
                📺 {year} {getSeasonDisplayName(season)}新番
            </h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
                共 {animeList.length} 部動畫
            </p>

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>正在載入...</p>
                </div>
            ) : error ? (
                <div className="empty-state">
                    <div className="empty-state-icon">😔</div>
                    <p>{error}</p>
                </div>
            ) : (
                <div className="anime-grid">
                    {animeList.map((anime) => (
                        <Link href={`/anime/${anime.mal_id}`} key={anime.mal_id} style={{ textDecoration: 'none' }}>
                            <article className="anime-card">
                                <div className="anime-card-image">
                                    {anime.image_url ? (
                                        <img src={anime.image_url} alt={anime.title} loading="lazy" />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎬</div>
                                    )}
                                    {anime.score && (
                                        <div className="anime-card-score">⭐ {anime.score.toFixed(1)}</div>
                                    )}
                                </div>
                                <div className="anime-card-content">
                                    <h3 className="anime-card-title">{anime.title}</h3>
                                    <div className="anime-card-meta">
                                        {anime.episodes && <span className="anime-card-tag">📺 {anime.episodes} 集</span>}
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
