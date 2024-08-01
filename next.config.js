/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "127.0.0.1",
        protocol: "http",
        port: "54321",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
