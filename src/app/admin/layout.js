'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }) {
    const pathname = usePathname();

    // If on login page, render only children (no sidebar)
    if (pathname === '/admin/login') {
        return <>{children}</>;
    }

    const navItems = [
        { label: '總覽', href: '/admin' },
        { label: '動漫管理', href: '/admin/anime' },
        { label: '文章管理', href: '/admin/articles' },
        { label: '編輯推薦 (Picks)', href: '/admin/recommendations' },
        { label: '橫幅管理 (Banner)', href: '/admin/banners' },
        { label: '系統設定', href: '/admin/settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
            {/* Sidebar */}
            <aside style={{
                width: '250px',
                background: '#111827', // Slate-900
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                position: 'fixed',
                height: '100%',
                left: 0,
                top: 0
            }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid #374151' }}>
                    <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>後台管理系統</h1>
                    <span style={{ fontSize: '0.75rem', color: '#9ca3af', display: 'block', marginTop: '0.25rem' }}>v1.2 (Prod)</span>
                </div>

                <nav style={{ flex: 1, padding: '1rem' }}>
                    <ul style={{ listStyle: 'none', padding: 0 }}>
                        {navItems.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <li key={item.href} style={{ marginBottom: '0.5rem' }}>
                                    <Link href={item.href} style={{
                                        display: 'block',
                                        padding: '0.75rem 1rem',
                                        borderRadius: '0.375rem',
                                        color: isActive ? '#fff' : '#9ca3af',
                                        background: isActive ? '#1f2937' : 'transparent',
                                        textDecoration: 'none',
                                        fontWeight: '500'
                                    }}>
                                        {item.label}
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </nav>

                <div style={{ padding: '1rem', borderTop: '1px solid #374151' }}>
                    <a href="/" target="_blank" style={{ color: '#9ca3af', textDecoration: 'none', display: 'block', marginBottom: '1rem' }}>
                        前往前台 ↗
                    </a>
                </div>
            </aside>

            {/* Main Content */}
            <main style={{ marginLeft: '250px', flex: 1, padding: '2rem' }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    {children}
                </div>
            </main>
        </div>
    );
}
