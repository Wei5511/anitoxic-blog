import { NextResponse } from 'next/server';

export function middleware(request) {
    const path = request.nextUrl.pathname;

    // Protect /admin routes
    if (path.startsWith('/admin')) {
        // Exclude /admin/login from protection to avoid loop
        if (path === '/admin/login') {
            return NextResponse.next();
        }

        // Check for auth cookie
        const authCookie = request.cookies.get('admin_session');

        // If no cookie or invalid value (simple check), redirect to login
        if (!authCookie || authCookie.value !== 'true') {
            return NextResponse.redirect(new URL('/admin/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/admin/:path*',
};
