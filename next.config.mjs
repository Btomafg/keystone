/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: true, // Ensures TypeScript errors stop the build
  },
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
