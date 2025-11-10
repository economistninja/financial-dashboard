import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // ADD THESE LINES:
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;