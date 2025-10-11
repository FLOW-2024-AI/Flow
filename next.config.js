/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 14
  output: 'export',
  basePath: '',  // Sin basePath para DreamHost
  distDir: 'out',  // Carpeta 'out' para DreamHost
  images: {
    unoptimized: true,
  },
}

module.exports = nextConfig
