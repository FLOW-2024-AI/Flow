/** @type {import('next').NextConfig} */
const nextConfig = {
  // App Router is enabled by default in Next.js 14
  output: 'export',
  basePath: '',  // Sin basePath para dominio raíz o subdominio
  distDir: 'out',  // Carpeta 'out' para DreamHost
  images: {
    unoptimized: true,
  },
  trailingSlash: true,  // Añade / al final de las URLs
}

module.exports = nextConfig
