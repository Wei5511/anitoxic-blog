import "./globals.css";
import { GoogleAnalytics } from '@next/third-parties/google';

export const metadata = {
    title: "【漫】性中毒 | Anime Addicts",
    description: "追蹤每季最新動漫，獲取即時資訊與精彩內容",
    icons: {
        icon: '/book.png',
    },
    keywords: ["動漫", "anime", "新番", "季番", "日本動畫"],
    metadataBase: new URL('https://anitoxic-blog.vercel.app'),
};

export default function RootLayout({ children }) {
    return (
        <html lang="zh-TW">
            <body>
                {children}
                <GoogleAnalytics gaId="G-E4J93M4E3P" />
            </body>
        </html>
    );
}
