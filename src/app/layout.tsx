import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SmartLogixProvider } from "@/context/SmartLogixContext";
import Navbar from "@/components/shared/Navbar";
import { Toaster } from "react-hot-toast";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SmartLogix - Sistema de Gestión Logística",
  description: "Plataforma avanzada de inventario y pedidos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100 flex flex-col font-sans">
        <SmartLogixProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Toaster position="top-right" />
        </SmartLogixProvider>
      </body>
    </html>
  );
}
