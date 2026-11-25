/** @type {import('next').NextConfig} */
const nextConfig = {
  // Keep production builds from overwriting a running dev server's cache.
  distDir: process.env.NODE_ENV === "development" ? ".next-dev" : ".next",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "office-backend.amptechnology.in",
        port: "",
        // pathname: "/uploads/**",
      },
      {
        protocol: "https",
        hostname: "cdn.amptechnology.in",
        port: "",
      },
      {
        hostname: "localhost",
        protocol: "http",
      },
    ],
  },
};

export default nextConfig;
