import Link from 'next/link';

export default function SiteLayout({ children }) {
  return (
    <>
      <header className="header">
        <div className="container header-content">
          <Link href="/" className="logo" onClick={() => { sessionStorage.removeItem('homeState'); window.scrollTo({ top: 0, behavior: 'instant' }); }}>
            <span className="logo-main">漫性中毒</span>
            <span className="logo-tagline">你的二次元病歷報告</span>
            <span className="logo-icon">📖</span>
          </Link>
          <nav className="nav">
            <Link href="/" className="nav-link" onClick={() => { sessionStorage.removeItem('homeState'); window.scrollTo({ top: 0, behavior: 'instant' }); }}>首頁</Link>
            <Link href="/season/2026/winter" className="nav-link">🌸 2026 1月新番</Link>
            <Link href="/database" className="nav-link">📚 動漫資料庫</Link>
            <Link href="/about" className="nav-link">關於</Link>
          </nav>
        </div>
      </header>

      <main>{children}</main>

      <footer className="footer">
        <div className="container">
          <p>【漫】性中毒 © 2026 - 資料來源自 MyAnimeList via Jikan API</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.85rem' }}>
            本站內容僅供資訊分享，所有動漫版權歸原作者及製作公司所有
          </p>
        </div>
      </footer>
    </>
  );
}
