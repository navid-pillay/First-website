import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (for example "/First-website") when publishing
// the static export under a sub-path such as GitHub Pages.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
