import path from "path";
import { fileURLToPath } from "url";
import type { NextConfig } from "next";

const configDir = path.dirname(fileURLToPath(import.meta.url));

const nextConfig: NextConfig = {
  // Avoid inferring the monorepo parent (/home/goshell) when multiple lockfiles exist.
  turbopack: {
    root: configDir,
  },
};

export default nextConfig;
