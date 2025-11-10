import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  output: 'export', // Add this line - it completely disables server-side features during build
};

export default nextConfig;