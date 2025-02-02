import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: "i.guim.co.uk",
      },
      {
        hostname: "techcrunch.com",
      },
      {
        hostname: "ichef.bbci.co.uk",
      },
      {
        hostname: "via.placeholder.com",
      },
      {
        hostname: "e3.365dm.com",
      },
      {
        hostname: "cdn.arstechnica.net",
      },
      {
        hostname: "cdn.worldweatheronline.com",
      },
      {
        hostname: "assets.publishing.service.gov.uk",
      },
    ],
  },
};

export default nextConfig;
