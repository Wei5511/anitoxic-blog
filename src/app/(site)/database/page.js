'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AnimeDatabasePage() {
    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSeason, setSelectedSeason] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');

    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        // Parse URL params on mount
        const params = new URLSearchParams(window.location.search);
        const q = params.get('query');
        if (q) {
            setSearchQuery(q);
            setSelectedYear('all'); // Clear year filter for global search
        }
    }, []);

    useEffect(() => {
        fetchAnime();
    }, [selectedYear, selectedSeason, searchQuery]);

    const fetchAnime = async () => {
        setLoading(true);
        try {
            let url = '/api/database';
            const params = new URLSearchParams();
            if (selectedYear !== 'all') params.append('year', selectedYear);
            if (selectedSeason !== 'all') params.append('season', selectedSeason);
            if (searchQuery) params.append('query', searchQuery);

            if (params.toString()) url += '?' + params.toString();

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setAnimeList(data.data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const seasons = [
        { value: 'all', label: '全部季節' },
        { value: 'winter', label: '冬季 (1-3月)' },
        { value: 'spring', label: '春季 (4-6月)' },
        { value: 'summer', label: '夏季 (7-9月)' },
        { value: 'fall', label: '秋季 (10-12月)' }
    ];

    const years = [
        { value: 'all', label: '不限年份' },
        { value: '2025', label: '2025 年' },
        { value: '2024', label: '2024 年' },
        { value: '2023', label: '2023 年' }
    ];

    const getSeasonDisplayName = (s) => {
        const names = { winter: '1月', spring: '4月', summer: '7月', fall: '10月' };
        return names[s] || s;
    };

    return (
        <div className="container" style={{ paddingTop: '2rem' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>📚 動漫資料庫</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                探索歷年動漫作品資料
            </p>

            {/* 篩選器 */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center'
            }}>
                {/* Search Input */}
                <input
                    type="text"
                    placeholder="搜尋動漫名稱/類型..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        minWidth: '250px'
                    }}
                />
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    {years.map(y => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                </select>

                <select
                    value={selectedSeason}
                    onChange={(e) => setSelectedSeason(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        cursor: 'pointer'
                    }}
                >
                    {seasons.map(s => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                </select>
            </div>

            {loading ? (
                <div className="loading">
                    <div className="loading-spinner"></div>
                    <p>正在載入動漫資料...</p>
                </div>
            ) : animeList.length === 0 ? (
                <div className="empty-state">
                    <div className="empty-state-icon">🎬</div>
                    <p>找不到符合條件的動漫</p>
                </div>
            ) : (
                <>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '1rem' }}>
                        共找到 {animeList.length} 部作品
                    </p>
                    <div className="anime-grid">
                        {animeList.map((anime) => (
                            <Link
                                href={`/anime/${anime.mal_id}`}
                                key={anime.mal_id}
                                className="anime-card"
                            >
                                <div className="anime-card-image">
                                    {anime.image_url ? (
                                        <img
                                            src={anime.image_url}
                                            alt={anime.title}
                                            loading="lazy"
                                        />
                                    ) : (
                                        <div style={{ width: '100%', height: '100%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem' }}>🎬</div>
                                    )}
                                    {anime.score && (
                                        <div className="anime-card-score">★ {anime.score}</div>
                                    )}
                                </div>
                                <div className="anime-card-content">
                                    <h3 className="anime-card-title">{anime.title}</h3>
                                    <div className="anime-card-meta">
                                        {anime.season && anime.year && (
                                            <span className="anime-card-tag">{anime.year} {getSeasonDisplayName(anime.season)}</span>
                                        )}
                                        {anime.episodes && (
                                            <span className="anime-card-tag">{anime.episodes} 集</span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
