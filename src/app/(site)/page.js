'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import BannerCarousel from '@/components/BannerCarousel';

export default function HomePage() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search, Filter & Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('全部');
  const [currentPage, setCurrentPage] = useState(1);
  const articlesPerPage = 10;

  const categories = ['全部', '動畫介紹', '編輯精選'];

  // Restore State from Session Storage on Mount
  useEffect(() => {
    const savedState = sessionStorage.getItem('homeState');
    if (savedState) {
      const { articles, searchTerm, categoryFilter, currentPage, scrollY, timestamp } = JSON.parse(savedState);
      // Check if cache is valid (e.g. < 1 hour) or just use it?
      // For UX "Back" button, we always want the previous state.
      // But if user opens new tab? Session storage is per tab.
      setArticles(articles);
      setSearchTerm(searchTerm);
      setCategoryFilter(categoryFilter);
      setCurrentPage(currentPage);
      setLoading(false);

      // Restore Scroll after render
      setTimeout(() => {
        window.scrollTo({ top: scrollY, behavior: 'instant' });
      }, 0);
    } else {
      fetchArticles();
    }
  }, []);

  // Save State to Session Storage on Change or Unmount
  useEffect(() => {
    // We save on every change to ensure latest state is kept
    if (!loading && articles.length > 0) {
      const state = {
        articles,
        searchTerm,
        categoryFilter,
        currentPage,
        scrollY: window.scrollY,
        timestamp: Date.now()
      };
      sessionStorage.setItem('homeState', JSON.stringify(state));
    }
  }, [articles, searchTerm, categoryFilter, currentPage, loading]);

  // Save scroll position specifically before unloading/navigating?
  // The above useEffect captures scrollY at the moment of state change, which is WRONG.
  // We need to capture scrollY just before leaving.
  useEffect(() => {
    const handleScroll = () => {
      // Debounce save or just save on unmount?
      // Saving on unmount is tricky in SPAs.
      // Better: Save on Link click?
      // Or: Save regularly?
      // Let's use a "beforeunload" or just update a ref, and save in useEffect cleanup?
      // Cleanup runs on unmount.
    };

    // Actually, simply saving current state when clicking a Link is hard to orchestrate globally.
    // OPTION: We update `scrollY` in sessionStorage periodically or on scroll end.
    const onScroll = () => {
      if (!loading) {
        const current = JSON.parse(sessionStorage.getItem('homeState') || '{}');
        current.scrollY = window.scrollY;
        sessionStorage.setItem('homeState', JSON.stringify(current));
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [loading]);


  const fetchArticles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/articles');
      const data = await response.json();
      if (data.success) {
        setArticles(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
  };

  // Filter Logic (Search + Category)
  const filteredArticles = articles.filter(article => {
    const lowerTerm = searchTerm.toLowerCase();
    const matchesSearch =
      article.title.toLowerCase().includes(lowerTerm) ||
      (article.category && article.category.toLowerCase().includes(lowerTerm)) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(lowerTerm)) ||
      (article.content && article.content.toLowerCase().includes(lowerTerm));
    const matchesCategory =
      categoryFilter === '全部' ||
      article.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  // Pagination Logic
  const indexOfLastArticle = currentPage * articlesPerPage;
  const indexOfFirstArticle = indexOfLastArticle - articlesPerPage;
  const currentArticles = filteredArticles.slice(indexOfFirstArticle, indexOfLastArticle);
  const totalPages = Math.ceil(filteredArticles.length / articlesPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update storage
    const current = JSON.parse(sessionStorage.getItem('homeState') || '{}');
    current.currentPage = pageNumber;
    current.scrollY = 0;
    sessionStorage.setItem('homeState', JSON.stringify(current));
  };

  const handleSearch = (val) => {
    setSearchTerm(val);
    setCurrentPage(1);
    // Storage update handled by effect or implicit
  }

  const handleCategory = (cat) => {
    setCategoryFilter(cat);
    setCurrentPage(1);
  }

  // ... (JSX render irrelevant to change, keeping same structure) ... 
  // Wait, I need to output the FULL component or use smart replacement?
  // The tool replaces START to END.
  // I must be careful to include the JSX.

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>
      <style jsx>{`
        .home-title { font-size: 1.75rem; margin: 0; }
        .article-card {
          background: var(--bg-card);
          border-radius: 1rem;
          padding: 1.5rem;
          border: 1px solid var(--border-color);
          transition: all 0.3s ease;
          cursor: pointer;
          display: flex;
          gap: 1.5rem;
        }
        .article-image-container {
          width: 140px;
          min-width: 140px;
          height: 190px;
          border-radius: 0.5rem;
          overflow: hidden;
          background: #2a2a2a;
          flex-shrink: 0;
        }
        .article-title {
          font-size: 1.3rem;
          margin: 0.5rem 0;
          color: var(--text-primary);
          line-height: 1.4;
        }
        .article-excerpt {
          color: var(--text-secondary);
          font-size: 0.95rem;
          line-height: 1.6;
          margin-bottom: auto;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .home-title { font-size: 1.25rem; }
          .article-card { padding: 1rem; gap: 1rem; }
          .article-image-container { width: 110px; min-width: 110px; height: 150px; }
          .article-title { font-size: 1.1rem; margin: 0.25rem 0; line-height: 1.3; }
          .article-excerpt { font-size: 0.85rem; line-height: 1.5; -webkit-line-clamp: 4; }
        }
      `}</style>

      <div className="home-layout-grid">

        <main>
          <BannerCarousel />

          <div style={{
            marginBottom: '2rem',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '1rem'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h1 className="home-title">📝 最新文章</h1>

              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="搜尋文章..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                  style={{
                    padding: '0.6rem 1rem 0.6rem 2.5rem',
                    borderRadius: '2rem',
                    border: '1px solid var(--border-color)',
                    fontSize: '0.95rem',
                    width: '200px',
                    outline: 'none',
                    background: 'var(--bg-card)',
                    color: 'var(--text-primary)'
                  }}
                />
                <span style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#888'
                }}>🔍</span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => handleCategory(cat)}
                  style={{
                    padding: '0.4rem 1rem',
                    borderRadius: '2rem',
                    border: categoryFilter === cat ? '2px solid var(--primary-color)' : '1px solid var(--border-color)',
                    background: categoryFilter === cat ? 'var(--primary-color)' : 'var(--bg-card)',
                    color: categoryFilter === cat ? 'white' : 'var(--text-primary)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    fontWeight: categoryFilter === cat ? 'bold' : 'normal',
                    transition: 'all 0.2s ease'
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="loading">
              <div className="loading-spinner"></div>
              <p>正在載入文章...</p>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon">❌</div>
              <p>找不到符合「{searchTerm}」的文章</p>
              <button
                onClick={() => handleSearch('')}
                className="btn btn-primary"
                style={{ marginTop: '1rem' }}
              >
                清除搜尋
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gap: '1.5rem' }}>
                {currentArticles.map((article) => (
                  <Link
                    href={`/articles/${article.id}`}
                    key={article.id}
                    style={{ textDecoration: 'none' }}
                  >
                    <article className="anime-card article-card">
                      {article.image_url && (
                        <div className="article-image-container">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={article.image_url}
                            alt={article.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={handleImageError}
                            loading="lazy"
                          />
                        </div>
                      )}
                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                        <div>
                          <span style={{
                            color: 'var(--primary-color)',
                            fontSize: '0.8rem',
                            fontWeight: 'bold',
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            {article.category || '最新消息'}
                          </span>
                          <h3 className="article-title">
                            {article.title}
                          </h3>
                          <p className="article-excerpt">
                            {article.excerpt}
                          </p>
                        </div>
                        <div style={{ marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          {formatDate(article.published_at)}
                        </div>
                      </div>
                    </article>
                  </Link>
                ))}
              </div>

              {totalPages > 1 && (
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: '0.5rem',
                  marginTop: '3rem',
                  marginBottom: '2rem'
                }}>
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="btn"
                    style={{ opacity: currentPage === 1 ? 0.5 : 1 }}
                  >
                    ←
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                    <button
                      key={number}
                      onClick={() => handlePageChange(number)}
                      style={{
                        width: '36px',
                        height: '36px',
                        borderRadius: '0.5rem',
                        border: 'none',
                        background: currentPage === number ? 'var(--primary-color)' : 'var(--bg-secondary)',
                        color: currentPage === number ? 'white' : 'var(--text-primary)',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                      }}
                    >
                      {number}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="btn"
                    style={{ opacity: currentPage === totalPages ? 0.5 : 1 }}
                  >
                    →
                  </button>
                </div>
              )}
            </>
          )}
        </main>

        <aside style={{ position: 'sticky', top: '2rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              👍 編輯推薦
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {articles.filter(a => a.is_recommended).slice(0, 5).map(article => (
                <Link href={`/articles/${article.id}`} key={article.id} style={{ textDecoration: 'none', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '0.5rem', overflow: 'hidden', flexShrink: 0, background: '#333' }}>
                    <img src={article.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', margin: 0, color: 'var(--text-primary)', lineHeight: '1.3' }}>{article.title}</h4>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '1rem',
            marginTop: '2rem',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>🏷️ 熱門標籤</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {['異世界', '轉生', '勇者', '戰鬥', '熱血'].map(tag => (
                <Link
                  key={tag}
                  href={`/database?query=${tag}`}
                  style={{ textDecoration: 'none' }}
                >
                  <span style={{
                    background: 'var(--bg-secondary)',
                    padding: '0.3rem 0.8rem',
                    borderRadius: '2rem',
                    fontSize: '0.85rem',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'inline-block',
                    transition: 'all 0.2s'
                  }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = 'var(--primary-color)';
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = 'var(--bg-secondary)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    #{tag}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>

    </div>
  );
}
