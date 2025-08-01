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
        hostname: 'www.google.com', // ファビコン取得API用
      },
    ],
  },
};

module.exports = nextConfig;