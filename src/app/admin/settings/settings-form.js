'use client';

import { saveSettings } from '@/app/actions/settings';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SettingsForm({ initialGaId }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target);
        const res = await saveSettings(formData);

        if (res.success) {
            router.refresh();
            setLoading(false);
            alert('設定已儲存！');
        } else {
            alert(res.message);
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ background: '#fff', padding: '2rem', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', maxWidth: '600px' }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Google Analytics ID (GA4)</label>
                <input
                    name="next_public_ga_id"
                    defaultValue={initialGaId}
                    placeholder="G-XXXXXXXXXX"
                    style={{ width: '100%', padding: '0.75rem', border: '1px solid #d1d5db', borderRadius: '4px' }}
                />
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#6b7280' }}>
                    請輸入 Google Analytics 的 Measurement ID。留空即可停用。
                </p>
            </div>

            <button
                type="submit"
                disabled={loading}
                style={{
                    padding: '0.75rem 1.5rem',
                    background: '#111827',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    opacity: loading ? 0.7 : 1
                }}
            >
                {loading ? '儲存中...' : '儲存設定'}
            </button>
        </form>
    );
}
