import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import MobileFooter from "@/components/MobileFooter";
import RegisterServiceWorker from "@/components/RegisterServiceWorker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Campamento Andino Sayhueque",
  description: "Sistema de gestión del Campamento Andino Sayhueque",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full">
      <head>
        {/* Progressive Web App: manifest and meta tags */}
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#FF6B35" />
        <link rel="icon" href="/logo-192.png" />
        <link rel="apple-touch-icon" href="/logo-192.png" />
        {/* Safari pinned tab mask icon */}
        <link rel="mask-icon" href="/logo.svg" color="#FF6B35" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
          <RegisterServiceWorker />
          {/* Estructura con Grid Layout - sin spacers huérfanos */}
          <div className="h-full grid grid-rows-[auto_1fr_auto] md:grid-rows-[auto_1fr]">
            {/* Header Desktop - fila automática */}
            <MobileFooter />

            {/* Contenido principal - ocupa el espacio restante (1fr) */}
            <main className="overflow-auto">{children}</main>

            {/* Footer Mobile se maneja dentro de MobileFooter con fixed positioning */}
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
