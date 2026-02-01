/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
      },
      {
        protocol: 'https',
        hostname: 'img.myvideo.net.tw',
      },
      {
        protocol: 'https',
        hostname: '*', // Fallback for various sources if needed, or specific domains
      }
    ],
  },
  // 允許 better-sqlite3 原生模組
  serverExternalPackages: ['better-sqlite3'],
  output: 'standalone',
};

export default nextConfig;

