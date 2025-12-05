import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  webpack: (config, { isServer }) => {
    // Add resolution for react-map-gl
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        // Add any polyfills needed for react-map-gl
      };
    }
    return config;
  },
  // If you need to transpile the module (sometimes needed for ESM modules)
  transpilePackages: ["react-map-gl"],
};

export default nextConfig;