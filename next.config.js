/** @type {import('next').NextConfig} */
const objectStorageURL = new URL(process.env.NEXT_PUBLIC_OBJECT_STORAGE_URL);

const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: objectStorageURL.hostname,
        protocol: objectStorageURL.protocol.slice(0, -1),
        port: objectStorageURL.port,
        pathname: objectStorageURL.pathname + "/**",
      },
    ],
  },
};

module.exports = nextConfig;
