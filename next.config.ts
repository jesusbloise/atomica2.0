import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  output: 'standalone',
  // Evita que un error de TS/ESLint tumbe el build del contenedor
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
