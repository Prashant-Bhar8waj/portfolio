import type { NextConfig } from "next";

/**
 * Static export for GitHub Pages. The deploy workflow sets NEXT_PUBLIC_BASE_PATH
 * to "/<repo>" so the site works at https://<user>.github.io/<repo>/.
 * Leave the variable unset for local dev or hosts like Vercel.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
