/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 14
  output: 'export',
  distDir: 'out',
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
