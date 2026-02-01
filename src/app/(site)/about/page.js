import Link from 'next/link';

export const metadata = {
    title: '關於漫性中毒 | Anime Seasonal Blog',
    description: '了解漫性中毒的運作方式和資料來源',
};

export default function AboutPage() {
    return (
        <div className="container" style={{ paddingTop: '2rem', maxWidth: '800px' }}>
            <Link href="/" className="btn btn-secondary" style={{ marginBottom: '1.5rem' }}>
                ← 返回首頁
            </Link>

            <h1 style={{ marginBottom: '2rem' }}>📖 關於漫性中毒</h1>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                    🎯 我們的目標
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    漫性中毒是一個自動化更新的動漫資訊平台，專門追蹤每季最新動漫作品。
                    我們希望為動漫愛好者提供最即時、最全面的新番資訊。
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                    📜 資料來源與版權
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8', marginBottom: '1rem' }}>
                    本站動漫資訊來自 <a href="https://jikan.moe/" target="_blank" rel="noopener noreferrer">Jikan API</a>，
                    資料原始來源為 <a href="https://myanimelist.net/" target="_blank" rel="noopener noreferrer">MyAnimeList</a>。
                </p>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    所有動漫圖片和預告片版權歸原作者及製作公司所有。
                    本站使用嵌入方式顯示官方 YouTube 預告片，不存儲任何受版權保護的媒體內容。
                </p>
            </section>

            <section style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                    🤝 聯絡我們
                </h2>
                <p style={{ color: 'var(--text-secondary)', lineHeight: '1.8' }}>
                    如果您有任何建議或問題，歡迎透過 email 與我們聯繫。
                    <br />
                    <a href="mailto:weihuang5511@gmail.com" style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'var(--primary-color)' }}>
                        weihuang5511@gmail.com
                    </a>
                </p>
            </section>

            <div style={{
                background: 'var(--bg-card)',
                padding: '1.5rem',
                borderRadius: '1rem',
                border: '1px solid var(--border-color)',
                marginTop: '2rem'
            }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center' }}>
                    漫性中毒 © 2026 - Made with ❤️ for anime fans
                </p>
            </div>
        </div>
    );
}
