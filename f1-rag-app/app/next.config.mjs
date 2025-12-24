/** @type {import('next').NextConfig} */
const nextConfig = {
  // Add your image domains here if needed
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
};

export default nextConfig;