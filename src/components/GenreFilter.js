'use client';

export default function GenreFilter({ selectedGenre, onSelect }) {
    const genres = [
        'Action', 'Adventure', 'Comedy', 'Drama', 'Slice of Life',
        'Fantasy', 'Sci-Fi', 'Mystery', 'Supernatural', 'Romance',
        'Sports', 'Horror', 'Suspense', 'Award Winning'
    ];

    return (
        <select
            value={selectedGenre}
            onChange={(e) => onSelect(e.target.value)}
            style={{
                padding: '0.75rem 1rem',
                borderRadius: '0.5rem',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-primary)',
                fontSize: '1rem',
                cursor: 'pointer',
                outline: 'none',
                minWidth: '150px'
            }}
        >
            <option value="all">所有類型</option>
            {genres.map(genre => (
                <option key={genre} value={genre}>
                    {genre}
                </option>
            ))}
        </select>
    );
}
