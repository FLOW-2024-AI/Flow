/** @type {import('next').NextConfig} */
const isExport = process.env.NEXT_OUTPUT === 'export'

const nextConfig = {
  // App Router is enabled by default in Next.js 14
  basePath: '', // Sin basePath para dominio raíz o subdominio
  images: {
    unoptimized: isExport,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com'
      }
    ]
  },
  trailingSlash: isExport, // Añade / al final de las URLs
  ...(isExport
    ? {
        output: 'export',
        distDir: 'out' // Carpeta 'out' para DreamHost
      }
    : {})
}

module.exports = nextConfig
