import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Solo usar export estático para producción (Firebase Hosting)
  ...(isProd && {
    output: "export",
    distDir: "out",
  }),
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
  // Asegurar que las variables de entorno se incluyan en el build
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || "http://192.168.0.43:8080",
  },
};

export default nextConfig;
