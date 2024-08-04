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
      {
        hostname: "tlphffjtjooejpyrndxg.supabase.co",
        protocol: "https",
        pathname: "**",
      },
    ],
  },
};

module.exports = nextConfig;
