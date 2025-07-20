/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: ['@tailwindcss/typography'],
  },
  // Ensure consistent rendering between server and client
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Static export configuration
  ...(process.env.EXPORT === 'true' && {
    output: 'export',
    distDir: 'out',
    images: {
      unoptimized: true,
    },
  }),
}

module.exports = nextConfig