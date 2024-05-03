/** @type {import('next').NextConfig} */
import withPWAInit from "@ducanh2912/next-pwa";

const withPWA = withPWAInit({
  dest: "public",
});

const nextConfig = withPWA({
  images: {
    remotePatterns: [{ hostname: "*" }],
  },
});

export default nextConfig;
