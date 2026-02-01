import { NextResponse } from 'next/server';
import { getAllAnime, executeQuery } from '@/lib/database';

export async function GET() {
  try {
    // Was previously using getAllAnime? Or custom query?
    // Based on page.js behavior, it fetches articles.
    // I will use executeQuery to fetch articles.

    // Wait, did I implement getRecentArticles? No. 
    // Let's check what it was doing. 
    // Assuming it fetches from 'articles' table since that's what page.js uses (id, title, category, image_url, excerpt, published_at).

    const res = await executeQuery(`
            SELECT * FROM articles 
            ORDER BY is_pinned DESC, published_at DESC 
            LIMIT 50
        `);

    // Normalize: executeQuery returns { rows: ... } for Turso or { rows: ... } for local (my wrapper)
    // My wrapper creates .rows property for local too.
    let articles = res.rows || res;
    if (!Array.isArray(articles)) articles = [];

    return NextResponse.json({ success: true, data: articles });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
