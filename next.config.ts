import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cloud-seeding.github.io",
        pathname: "/cdn/**",
      },
    ],
  },
};

export default nextConfig;
