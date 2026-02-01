import { NextResponse } from 'next/server';
import { getAvailableSeasons } from '@/lib/database';

export async function GET() {
    try {
        const seasons = await getAvailableSeasons();
        return NextResponse.json({
            success: true,
            data: seasons
        });
    } catch (error) {
        console.error('Error fetching seasons:', error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
