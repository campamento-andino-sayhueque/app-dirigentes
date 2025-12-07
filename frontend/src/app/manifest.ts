import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  const env = process.env.NEXT_PUBLIC_APP_ENV;
  let name = "CAS";
  let shortName = "CAS";

  if (env === 'dev') {
    name = "CAS [DEV]";
    shortName = "CAS [DEV]";
  } else if (env === 'qa') {
    name = "CAS [QA]";
    shortName = "CAS [QA]";
  }

  return {
    name: name,
    short_name: shortName,
    description: "Sistema de gestión del Campamento Andino Sayhueque",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#FF6B35",
    icons: [
      {
        src: "/logo.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any maskable" as any
      },
      {
        src: "/logo-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any maskable" as any
      },
      {
        src: "/logo-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable" as any
      }
    ]
  };
}
