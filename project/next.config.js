/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  output: 'export',

  images: {
    unoptimized: true,
  },

  // REQUIRED for GitHub Pages (repo is NOT username.github.io)
  basePath: '/production-rag-llm-platform',
  assetPrefix: '/production-rag-llm-platform/',

  trailingSlash: true,
};

module.exports = nextConfig;
