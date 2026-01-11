import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  typedRoutes: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "sdfsf5s5sd.cloudfront.net",
      },
    ],
  },
  /* config options here */
};

export default nextConfig;
