/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  // Static export configuration for GitHub Pages deployment
  // This generates static HTML files that can be served from any static host
  output: 'export',
  
  // Disable image optimization for static export (not needed for static sites)
  images: {
    unoptimized: true,
  },
  
  // Base path for GitHub Pages (if repo name is not 'username.github.io')
  // Uncomment and set if your repo name is not the same as your GitHub username
  // basePath: process.env.GITHUB_REPOSITORY ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}` : '',
  
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: true,
}

module.exports = nextConfig
