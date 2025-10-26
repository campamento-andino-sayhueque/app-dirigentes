import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "out",
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Asegurar que las variables de entorno se incluyan en el build
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      "localhost:8080" ||
      "https://backend-monolito-production.up.railway.app",
  },
};

export default nextConfig;
