/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // REQUIRED for GitHub Pages (static hosting)
  output: 'export',

  // GitHub Pages repo name
  basePath: '/production-rag-llm-platform',
  assetPrefix: '/production-rag-llm-platform/',

  // Required for static export
  images: {
    unoptimized: true,
  },

  // GitHub Pages compatibility
  trailingSlash: true,
};

module.exports = nextConfig;
