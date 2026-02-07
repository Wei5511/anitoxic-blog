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

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
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
  };

  return (
    <div className="container" style={{ paddingTop: '2rem' }}>

      {/* Main Layout: Content + Sidebar */}
      <div className="home-layout-grid">

        {/* LEFT COLUMN: Latest Articles Feed */}
        <main>
          <BannerCarousel />

          {/* Header Area with Category Filters and Search */}
          <div style={{
            marginBottom: '2rem',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '1rem'
          }}>
            {/* Title and Search Row */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1rem'
            }}>
              <h1 style={{ fontSize: '1.75rem', margin: 0 }}>📝 最新文章</h1>

              {/* Search Bar */}
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="搜尋文章..."
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
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

            {/* Category Filter Buttons */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setCurrentPage(1);
                  }}
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
                onClick={() => setSearchTerm('')}
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
                    <article style={{
                      background: 'var(--bg-card)',
                      borderRadius: '1rem',
                      padding: '1.5rem',
                      border: '1px solid var(--border-color)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '1.5rem'
                    }}
                      className="anime-card"
                    >
                      {article.image_url && (
                        <div style={{
                          width: '140px',
                          minWidth: '140px',
                          height: '190px',
                          borderRadius: '0.5rem',
                          overflow: 'hidden',
                          background: '#2a2a2a',
                          flexShrink: 0
                        }}>
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
                          <h3 style={{
                            fontSize: '1.3rem',
                            margin: '0.5rem 0',
                            color: 'var(--text-primary)',
                            lineHeight: '1.4'
                          }}>
                            {article.title}
                          </h3>
                          <p style={{
                            color: 'var(--text-secondary)',
                            fontSize: '0.95rem',
                            lineHeight: '1.6',
                            marginBottom: 'auto',
                            display: '-webkit-box',
                            WebkitLineClamp: 3,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
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

              {/* Pagination Controls */}
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

        {/* RIGHT COLUMN: Sidebar (Recommendations) */}
        <aside style={{ position: 'sticky', top: '2rem' }}>
          <div style={{
            background: 'var(--bg-card)',
            padding: '1.5rem',
            borderRadius: '1rem',
            border: '1px solid var(--border-color)'
          }}>
            <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              👍 編輯推薦 (Editor's Pick)
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {articles.filter(a => a.category === '編輯精選' || a.category === '深度解析').slice(0, 5).map(article => (
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
