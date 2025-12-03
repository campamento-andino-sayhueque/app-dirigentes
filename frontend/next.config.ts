import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  // Solo usar export estático para producción (Firebase Hosting)
  ...(isProd && {
    output: "export",
    distDir: "out",
  }),
  // Desactivar Turbopack en desarrollo para evitar bugs conocidos
  turbopack: false,
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
