import "./globals.css";

export const metadata = {
    title: "【漫】性中毒 | Anime Addicts",
    description: "追蹤每季最新動漫，獲取即時資訊與精彩內容",
    keywords: ["動漫", "anime", "新番", "季番", "日本動畫"],
};

import Script from "next/script";
import { executeQuery } from "@/lib/database";

export const dynamic = 'force-dynamic'; // To fetch settings dynamically

export default async function RootLayout({ children }) {
    let gaId = null;
    try {
        const res = await executeQuery("SELECT value FROM settings WHERE key = 'next_public_ga_id'");
        const row = res.get ? res.get() : (res.rows ? res.rows[0] : null);
        if (row && row.value) gaId = row.value;
    } catch (e) {
        // console.error("Failed to load settings:", e);
        // Silent fail on build or if table missing
    }

    return (
        <html lang="zh-TW">
            <body>
                {gaId && (
                    <>
                        <Script
                            src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
                            strategy="afterInteractive"
                        />
                        <Script id="google-analytics" strategy="afterInteractive">
                            {`
                                window.dataLayer = window.dataLayer || [];
                                function gtag(){dataLayer.push(arguments);}
                                gtag('js', new Date());
                                gtag('config', '${gaId}');
                            `}
                        </Script>
                    </>
                )}
                {children}
            </body>
        </html>
    );
}
