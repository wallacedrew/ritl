import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export — `next build` emits an `out/` directory of plain
  // HTML/CSS/JS suitable for Cloudflare Pages (or any static host).
  // Every route is already prerendered via generateStaticParams, so
  // nothing dynamic is lost.
  output: "export",
  // Required when output: "export". We don't use next/image anywhere
  // (only the favicon, which is served as a plain asset).
  images: { unoptimized: true },
};

export default nextConfig;
