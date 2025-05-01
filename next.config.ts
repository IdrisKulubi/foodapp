import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "utfs.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
  transpilePackages: [
    '@editorjs/editorjs',
    '@editorjs/header',
    '@editorjs/list',
    '@editorjs/paragraph',
    '@editorjs/checklist',
  ],
};

export default nextConfig;
