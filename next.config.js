/** @type {import('next').NextConfig} */
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  experimental: {
    turbo: {
      // Turbopack specific configurations
    },
  },

  // Webpack bundle analyzer
  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      // Development-specific webpack config
      config.devtool = "cheap-module-source-map";
    }

    return config;
  },

  // Environment variables for debugging
  env: {
    NODE_ENV: process.env.NODE_ENV,
  },

  // Logging for debugging
  logging: {
    fetches: {
      fullUrl: true,
    },
  },

  // Development specific settings
  ...(process.env.NODE_ENV === "development" && {
    onDemandEntries: {
      // period (in ms) where the server will keep pages in the buffer
      maxInactiveAge: 25 * 1000,
      // number of pages that should be kept simultaneously without being disposed
      pagesBufferLength: 2,
    },
  }),
};

module.exports = withBundleAnalyzer(nextConfig);
