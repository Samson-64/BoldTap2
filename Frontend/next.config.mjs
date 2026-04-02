import path from "path";
import { fileURLToPath } from "url";

const projectRoot = fileURLToPath(new URL(".", import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: false,
    formats: ["image/webp", "image/avif"],
  },
  // Reduce development overhead
  reactStrictMode: true,
  // Disable powered-by header
  poweredByHeader: false,
  // Compress responses
  compress: true,
  turbopack: {
    root: path.resolve(projectRoot),
  },
  // Optimize webpack
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Reduce client bundle size
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: "all",
          cacheGroups: {
            ...config.optimization?.splitChunks?.cacheGroups,
            // Separate framer-motion into its own chunk
            framerMotion: {
              name: "framer-motion",
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              priority: 10,
            },
          },
        },
      };
    }
    return config;
  },
};

export default nextConfig;
