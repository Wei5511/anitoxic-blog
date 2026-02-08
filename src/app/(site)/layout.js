import Link from 'next/link';

export default function SiteLayout({ children }) {
  return (
    <>
      <header className="header">
        <div className="container header-content">
          {/* Use standard a tag or onClick navigation to force full reload and reset state */}
          <a href="/" className="logo" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <span className="logo-main">漫性中毒</span>
            <span className="logo-tagline">你的二次元病歷報告</span>
            <span className="logo-icon">📖</span>
          </a>
          <nav className="nav">
            <a href="/" className="nav-link" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>首頁</a>
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
