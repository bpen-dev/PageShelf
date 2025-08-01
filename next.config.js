/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // Googleアカウントのアイコン用
      },
      {
        protocol: 'https',
        hostname: 'www.google.com', // Googleのファビコン取得API用
      },
      {
        protocol: 'https',
        hostname: 'cdn.qiita.com', // 👈 [追加] Qiitaのファビコン用
      },
      // 👇 将来的に他のサイトのファビコンにも対応できるよう、ワイルドカードを追加しておくとより便利です
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

module.exports = nextConfig;