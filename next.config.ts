import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Framework V2.4: canonical URLs end with a slash (/events/, /news/{slug}/).
  trailingSlash: true,
};

export default nextConfig;
