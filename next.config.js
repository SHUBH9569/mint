/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Warning instead of error for ESLint
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning instead of error for TypeScript
    ignoreBuildErrors: true,
  },
  output: 'standalone',
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  images: {
    domains: ['images.unsplash.com', 'assets.aceternity.com'],
  },
}

module.exports = nextConfig
