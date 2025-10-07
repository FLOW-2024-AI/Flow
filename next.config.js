/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 14
  output: 'export',
  distDir: 'docs',
  basePath: process.env.NODE_ENV === 'production' ? '/Flow' : '',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
