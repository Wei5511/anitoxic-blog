import { NextResponse } from 'next/server';
import { executeQuery } from '@/lib/database';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const res = await executeQuery(`
            SELECT * FROM banners 
            WHERE is_active = 1 
            ORDER BY sort_order ASC, created_at DESC
        `);
        const banners = res.all ? res.all() : (res.rows || []);

        return NextResponse.json({ success: true, data: banners });
    } catch (error) {
        console.error('Banner API Error:', error);
        return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
    }
}
