import { executeQuery } from '@/lib/database';
import ArticleForm from '../article-form';

// Next.js 15+ needs to handle params as promise
export default async function EditArticlePage({ params }) {
    const { id } = await params;

    let article = null;

    if (id !== 'new') {
        const res = await executeQuery('SELECT * FROM articles WHERE id = ?', [id]);
        article = res.get ? res.get() : (res.rows ? res.rows[0] : null);
    }

    return (
        <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
                {id === 'new' ? '新增文章' : '編輯文章'}
            </h1>
            <ArticleForm article={article} />
        </div>
    );
}
