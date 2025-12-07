import type { Metadata } from "next";
import "../globals.css";
import { Geist, Geist_Mono } from "next/font/google";
import { AuthGate } from "@/components/AuthGate";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Hotel Premier",
  description: "Sistema de Gestión Hotelera",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* 🔒 Protegemos todo el layout con AuthGate */}
        <AuthGate>
          {/* 🧭 Navbar solo se muestra si hay usuario */}
          <Navbar />

          {/* 📌 Contenido principal */}
          <main style={{ padding: "20px" }}>
            {children}
          </main>
        </AuthGate>
      </body>
    </html>
  );
}