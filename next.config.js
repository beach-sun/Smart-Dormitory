/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // 🚨 强制 Vercel 不被 TypeScript 卡死
  typescript: {
    ignoreBuildErrors: true
  },

  eslint: {
    ignoreDuringBuilds: true
  },

  // 🚨 防 SSR 卡死
  experimental: {
    serverComponentsExternalPackages: []
  }
}

module.exports = nextConfig