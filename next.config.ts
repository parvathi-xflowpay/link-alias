import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  // Turbopack aliases: next/link -> custom Link, original-next-link -> real Next.js link
  turbopack: {
    resolveExtensions: [".mdx", ".tsx", ".ts", ".jsx", ".js", ".json"],
    resolveAlias: {
      "original-next-link": "node_modules/next/link",
      "next/link": "src/components/Link.tsx",
    },
  },
};

export default nextConfig;
