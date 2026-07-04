import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  transpilePackages: ["gsap"],
  devIndicators: false,
  images: { unoptimized: true },
};

export default nextConfig;
