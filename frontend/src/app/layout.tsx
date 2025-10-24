import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import MobileFooter from "@/components/MobileFooter";

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
      >
        <AuthProvider>
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
