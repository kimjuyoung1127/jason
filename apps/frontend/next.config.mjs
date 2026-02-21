/** This file defines Next.js runtime and image configuration for the frontend app. */
const nextConfig = {
  reactStrictMode: true,
  turbopack: {
    root: "C:/Users/Windows10/Jason"
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
