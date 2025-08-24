/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
     dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",

    remotePatterns: [
      // NEW: Add Unsplash hostname
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      // Keep your existing hostnames
      {
        protocol: 'https',
        hostname: 'loremflickr.com', // You can remove this later if you want
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dicebear.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  reactStrictMode: true, 
};

module.exports = nextConfig;