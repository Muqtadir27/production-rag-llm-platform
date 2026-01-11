/** @type {import('next').NextConfig} */
const repoName = 'production-rag-llm-platform';

const nextConfig = {
  reactStrictMode: true,

  // Required for GitHub Pages
  output: 'export',
  trailingSlash: true,

  // IMPORTANT: GitHub Pages subpath
  basePath: `/${repoName}`,
  assetPrefix: `/${repoName}/`,

  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
