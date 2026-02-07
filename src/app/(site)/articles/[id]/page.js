import { executeQuery } from '@/lib/database';
import ArticleDetailClient from './client';
import { notFound } from 'next/navigation';

// Fetch article data on server
async function getArticle(id) {
    const res = await executeQuery('SELECT * FROM articles WHERE id = ?', [id]);
    return res.get ? res.get() : (res.rows ? res.rows[0] : null);
}

// Generate Metadata for SEO
export async function generateMetadata({ params }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        return {
            title: '文章不存在',
        };
    }

    // Keyword optimization (from user request)
    const siteTitle = '【漫】性中毒';
    const title = `${article.title} | ${siteTitle}`;

    // Description: Use excerpt if available, otherwise truncate content
    const excerpt = article.excerpt || (article.content ? article.content.substring(0, 150).replace(/[#*`]/g, '') + '...' : '');

    return {
        title: title,
        description: excerpt,
        openGraph: {
            title: title,
            description: excerpt,
            type: 'article',
            url: `https://anitoxic-blog.vercel.app/articles/${id}`,
            images: [
                {
                    url: article.image_url || 'https://anitoxic-blog.vercel.app/default-og.jpg',
                    width: 1200,
                    height: 630,
                    alt: article.title,
                },
            ],
            publishedTime: article.published_at,
            authors: ['【漫】性中毒 編輯部'],
        },
        twitter: {
            card: 'summary_large_image',
            title: title,
            description: excerpt,
            images: [article.image_url || ''],
        },
        alternates: {
            canonical: `https://anitoxic-blog.vercel.app/articles/${id}`,
        },
    };
}

// Server Component
export default async function ArticlePage({ params }) {
    const { id } = await params;
    const article = await getArticle(id);

    if (!article) {
        notFound();
    }

    // Add JSON-LD Structured Data
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: article.title,
        image: [article.image_url],
        datePublished: article.published_at,
        dateModified: article.updated_at || article.published_at,
        description: article.excerpt || article.content.substring(0, 150),
        author: {
            '@type': 'Organization',
            name: '【漫】性中毒',
            url: 'https://anitoxic-blog.vercel.app'
        },
        publisher: {
            '@type': 'Organization',
            name: '【漫】性中毒',
            logo: {
                '@type': 'ImageObject',
                url: 'https://anitoxic-blog.vercel.app/logo.png' // Make sure this exists or remove
            }
        },
        mainEntityOfPage: {
            '@type': 'WebPage',
            '@id': `https://anitoxic-blog.vercel.app/articles/${id}`
        }
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <ArticleDetailClient article={article} />
        </>
    );
}
