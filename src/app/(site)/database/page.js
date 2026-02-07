'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import SearchBar from '@/components/SearchBar';
import GenreFilter from '@/components/GenreFilter';

function AnimeDatabaseContent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [animeList, setAnimeList] = useState([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('all');
    const [selectedSeason, setSelectedSeason] = useState('all');
    const [selectedYear, setSelectedYear] = useState('all');

    const [years, setYears] = useState([{ value: 'all', label: '不限年份' }]);

    // Pagination
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const LIMIT = 30;

    // Initialize from URL Params
    useEffect(() => {
        const q = searchParams.get('query') || '';
        const g = searchParams.get('genre') || 'all';
        const s = searchParams.get('season') || 'all';
        const y = searchParams.get('year') || 'all';
        const p = parseInt(searchParams.get('page')) || 1;

        setSearchQuery(q);
        setSelectedGenre(g);
        setSelectedSeason(s);
        setSelectedYear(y);
        setPage(p);
    }, [searchParams]);

    // Fetch Years on Mount
    useEffect(() => {
        const fetchYears = async () => {
            try {
                const res = await fetch('/api/seasons');
                const data = await res.json();
                if (data.success) {
                    const uniqueYears = [...new Set(data.data.map(item => item.year))];
                    const yearOptions = [
                        { value: 'all', label: '不限年份' },
                        ...uniqueYears.map(y => ({ value: y.toString(), label: `${y} 年` }))
                    ];
                    setYears(yearOptions);
                }
            } catch (error) {
                console.error('Failed to fetch years', error);
            }
        };
        fetchYears();
    }, []);

    // Fetch Anime
    useEffect(() => {
        fetchAnime();
    }, [page, selectedYear, selectedSeason, selectedGenre, searchQuery]);

    const fetchAnime = async () => {
        setLoading(true);
        try {
            let url = '/api/database';
            const params = new URLSearchParams();
            if (selectedYear !== 'all') params.append('year', selectedYear);
            if (selectedSeason !== 'all') params.append('season', selectedSeason);
            if (selectedGenre !== 'all') params.append('genre', selectedGenre);
            if (searchQuery) params.append('query', searchQuery);
            params.append('page', page);
            params.append('limit', LIMIT);

            if (params.toString()) url += '?' + params.toString();

            const response = await fetch(url);
            const data = await response.json();
            if (data.success) {
                setAnimeList(data.data);
                if (data.pagination) {
                    setTotalPages(data.pagination.totalPages);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    // Update URL Helper
    const updateUrl = (updates) => {
        const params = new URLSearchParams(searchParams);
        Object.entries(updates).forEach(([key, value]) => {
            if (value && value !== 'all') {
                params.set(key, value);
            } else {
                params.delete(key);
            }
        });
        // Reset page on filter change if not specified
        if (!updates.page) {
            params.set('page', 1);
            setPage(1);
        }
        router.push(`/database?${params.toString()}`);
    };

    const handleSearch = (val) => {
        setSearchQuery(val);
        const params = new URLSearchParams(window.location.search);
        if (val) params.set('query', val); else params.delete('query');
        params.set('page', 1);
        window.history.replaceState(null, '', `?${params.toString()}`);
    };

    const handleGenreSelect = (val) => {
        setSelectedGenre(val);
        updateUrl({ genre: val });
    };

    const handleYearSelect = (val) => {
        setSelectedYear(val);
        updateUrl({ year: val });
    };

    const handleSeasonSelect = (val) => {
        setSelectedSeason(val);
        updateUrl({ season: val });
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
            const params = new URLSearchParams(searchParams);
            params.set('page', newPage);
            router.push(`/database?${params.toString()}`);
        }
    };

    const seasons = [
        { value: 'all', label: '全部季節' },
        { value: 'winter', label: '冬季 (1-3月)' },
        { value: 'spring', label: '春季 (4-6月)' },
        { value: 'summer', label: '夏季 (7-9月)' },
        { value: 'fall', label: '秋季 (10-12月)' }
    ];

    const getSeasonDisplayName = (s) => {
        const names = { winter: '1月', spring: '4月', summer: '7月', fall: '10月' };
        return names[s] || s;
    };

    return (
        <div className="container" style={{ paddingTop: '2rem', paddingBottom: '4rem' }}>
            <h1 style={{ marginBottom: '0.5rem', fontSize: '1.75rem' }}>📚 動漫資料庫</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                探索歷年動漫作品資料
            </p>

            {/* Filter Bar */}
            <div style={{
                display: 'flex',
                gap: '1rem',
                marginBottom: '2rem',
                flexWrap: 'wrap',
                alignItems: 'center',
                background: 'var(--bg-secondary)',
                padding: '1rem',
                borderRadius: '1rem'
            }}>
                <SearchBar
                    initialValue={searchQuery}
                    onSearch={handleSearch}
                    placeholder="搜尋動漫名稱..."
                />

                <GenreFilter
                    selectedGenre={selectedGenre}
                    onSelect={handleGenreSelect}
                />

                <select
                    value={selectedYear}
                    onChange={(e) => handleYearSelect(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        outline: 'none'
                    }}
                >
                    {years.map(y => (
                        <option key={y.value} value={y.value}>{y.label}</option>
                    ))}
                </select>

                <select
                    value={selectedSeason}
                    onChange={(e) => handleSeasonSelect(e.target.value)}
                    style={{
                        padding: '0.75rem 1rem',
                        borderRadius: '0.5rem',
                        border: '1px solid var(--border-color)',
                        background: 'var(--bg-card)',
                        color: 'var(--text-primary)',
                        fontSize: '1rem',
                        cursor: 'pointer',
                        outline: 'none'
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
                        第 {page} 頁 / 共 {totalPages} 頁
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
                                    <h3 className="anime-card-title">{anime.title_chinese || anime.title}</h3>
                                    <div className="anime-card-meta">
                                        {anime.season && anime.year && (
                                            <span className="anime-card-tag">{anime.year} {getSeasonDisplayName(anime.season)}</span>
                                        )}
                                        {anime.episodes && (
                                            <span className="anime-card-tag">{anime.episodes} 集</span>
                                        )}
                                        {anime.genres && (
                                            <span className="anime-card-tag" style={{ background: 'transparent', border: '1px solid var(--border-color)', padding: '2px 6px', fontSize: '0.7em' }}>
                                                {anime.genres.split(',')[0]}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginTop: '3rem', flexWrap: 'wrap' }}>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(1)}
                            disabled={page === 1}
                        >
                            第一頁
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                        >
                            上一頁
                        </button>

                        <span style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', fontWeight: 'bold' }}>
                            {page} / {totalPages}
                        </span>

                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === totalPages}
                        >
                            下一頁
                        </button>
                        <button
                            className="btn btn-secondary"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={page === totalPages}
                        >
                            最後一頁
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default function AnimeDatabasePage() {
    return (
        <Suspense fallback={<div className="container" style={{ paddingTop: '2rem' }}><div className="loading"><div className="loading-spinner"></div></div></div>}>
            <AnimeDatabaseContent />
        </Suspense>
    );
}
