import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pin the workspace root to this project. Without this, Next walks up the
    // tree and mistakes a stray lockfile in the home directory for the root.
    root: import.meta.dirname,
  },
  images: {
    // Product images are served from Supabase Storage's public bucket. Only
    // that exact host + path is allowed through the image optimizer.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hggzvmzsxlvbxdecqjhr.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    // Prefer AVIF, fall back to WebP for browsers that don't support it.
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
