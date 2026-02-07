'use client';

import { useState, useEffect } from 'react';

export default function SearchBar({ onSearch, initialValue = '', placeholder = '搜尋...' }) {
    const [value, setValue] = useState(initialValue);

    // Sync internal state if initialValue changes
    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        onSearch(newValue);
    };

    return (
        <div className="search-bar" style={{ position: 'relative', minWidth: '250px' }}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.5rem',
                    borderRadius: '0.5rem',
                    border: '1px solid var(--border-color)',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)',
                    fontSize: '1rem',
                    outline: 'none',
                    transition: 'border-color 0.2s'
                }}
            />
            <span style={{
                position: 'absolute',
                left: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'var(--text-secondary)',
                pointerEvents: 'none'
            }}>
                🔍
            </span>
        </div>
    );
}
