import Link from 'next/link';
import { executeQuery } from '@/lib/database';

export const dynamic = 'force-dynamic';

export default async function AdminAnimePage({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const limit = 20;
    const offset = (page - 1) * limit;
    const search = searchParams.search || '';

    // Build Query
    let whereClause = 'WHERE 1=1';
    const params = [];

    if (search) {
        whereClause += ` AND (title LIKE ? OR title_chinese LIKE ?)`;
        params.push(`%${search}%`, `%${search}%`);
    }

    // Get Count
    const countRes = await executeQuery(`SELECT COUNT(*) as total FROM anime ${whereClause}`, params);
    const total = countRes.rows ? countRes.rows[0].total : countRes.all()[0].total;
    const totalPages = Math.ceil(total / limit);

    // Get Data
    const dataRes = await executeQuery(`
        SELECT * FROM anime 
        ${whereClause} 
        ORDER BY updated_at DESC, year DESC, season ASC 
        LIMIT ? OFFSET ?
    `, [...params, limit, offset]);

    const animeList = dataRes.rows || dataRes.all();

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold' }}>動漫管理 ({total})</h1>

                {/* Search Form */}
                <form style={{ display: 'flex', gap: '0.5rem' }}>
                    <input
                        type="text"
                        name="search"
                        placeholder="搜尋動漫..."
                        defaultValue={search}
                        style={{
                            padding: '0.5rem 1rem',
                            border: '1px solid #d1d5db',
                            borderRadius: '0.375rem',
                            minWidth: '250px'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '0.5rem 1rem',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '0.375rem',
                        cursor: 'pointer'
                    }}>
                        搜尋
                    </button>
                    {search && (
                        <Link href="/admin/anime" style={{
                            padding: '0.5rem 1rem',
                            background: '#9ca3af',
                            color: 'white',
                            textDecoration: 'none',
                            borderRadius: '0.375rem',
                            display: 'inline-block'
                        }}>
                            清除
                        </Link>
                    )}
                </form>
            </div>

            <div style={{ background: 'white', borderRadius: '0.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <tr>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>ID</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>標題</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>季節</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>評分</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>狀態</th>
                            <th style={{ padding: '0.75rem 1.5rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase' }}>操作</th>
                        </tr>
                    </thead>
                    <tbody style={{ divideY: '1px solid #e5e7eb' }}>
                        {animeList.map((anime) => (
                            <tr key={anime.mal_id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: '1rem 1.5rem', whiteSpace: 'nowrap', color: '#6b7280' }}>
                                    {anime.mal_id}
                                </td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        {anime.image_url && (
                                            <img
                                                src={anime.image_url}
                                                alt=""
                                                style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px', marginRight: '1rem' }}
                                            />
                                        )}
                                        <div>
                                            <div style={{ fontWeight: '500', color: '#111827' }}>{anime.title_chinese || anime.title}</div>
                                            <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>{anime.title}</div>
                                        </div>
                                    </div>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: '#6b7280' }}>
                                    {anime.year} {anime.season}
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.125rem 0.5rem',
                                        borderRadius: '9999px',
                                        background: '#fef3c7',
                                        color: '#d97706',
                                        fontWeight: '500',
                                        fontSize: '0.875rem'
                                    }}>
                                        {anime.score}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                    <span style={{
                                        padding: '0.125rem 0.625rem',
                                        borderRadius: '9999px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500',
                                        background: anime.is_published ? '#d1fae5' : '#f3f4f6',
                                        color: anime.is_published ? '#059669' : '#6b7280'
                                    }}>
                                        {anime.is_published ? '發布' : '草稿'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                                    <Link
                                        href={`/admin/anime/${anime.mal_id}`}
                                        style={{
                                            color: '#4f46e5',
                                            fontWeight: '500',
                                            textDecoration: 'none'
                                        }}
                                    >
                                        編輯
                                    </Link>
                                    <span style={{ margin: '0 0.5rem', color: '#e5e7eb' }}>|</span>
                                    <a
                                        href={`/anime/${anime.mal_id}`}
                                        target="_blank"
                                        style={{
                                            color: '#6b7280',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem'
                                        }}
                                    >
                                        預覽
                                    </a>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem' }}>
                <div style={{ color: '#6b7280', fontSize: '0.875rem' }}>
                    顯示 {(page - 1) * limit + 1} 到 {Math.min(page * limit, total)} 筆，共 {total} 筆
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {page > 1 && (
                        <Link
                            href={`/admin/anime?page=${page - 1}${search ? `&search=${search}` : ''}`}
                            style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: 'white', color: '#374151', textDecoration: 'none' }}
                        >
                            上一頁
                        </Link>
                    )}
                    {page < totalPages && (
                        <Link
                            href={`/admin/anime?page=${page + 1}${search ? `&search=${search}` : ''}`}
                            style={{ padding: '0.5rem 1rem', border: '1px solid #d1d5db', borderRadius: '0.375rem', background: 'white', color: '#374151', textDecoration: 'none' }}
                        >
                            下一頁
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
