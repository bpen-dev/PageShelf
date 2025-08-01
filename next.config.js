/** @type {import('next').NextConfig} */
const nextConfig = {
  // 👇 この images の設定を追加します
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

module.exports = nextConfig;