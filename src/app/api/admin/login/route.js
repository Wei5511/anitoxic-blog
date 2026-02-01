import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request) {
    try {
        const { password } = await request.json();

        // Simple check against environment variable
        // Default to 'admin123' if env not set, for safety against lockouts during dev
        const validPassword = process.env.ADMIN_PASSWORD || 'admin123';

        if (password === validPassword) {
            // Set cookie
            (await cookies()).set('admin_session', 'true', {
                httpOnly: true,
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                maxAge: 60 * 60 * 24 * 7 // 1 week
            });

            return NextResponse.json({ success: true });
        }

        return NextResponse.json({ success: false, message: '密碼錯誤' }, { status: 401 });
    } catch (error) {
        return NextResponse.json({ success: false, message: '伺服器錯誤' }, { status: 500 });
    }
}
