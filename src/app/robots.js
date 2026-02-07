export default function robots() {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: '/admin/',
        },
        sitemap: 'https://anitoxic-blog.vercel.app/sitemap.xml',
    };
}
