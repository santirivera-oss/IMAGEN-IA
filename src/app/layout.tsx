import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Imagina AI - Generador de Imágenes con IA",
  description: "Crea imágenes increíbles con inteligencia artificial. Genera desde texto, personajes consistentes, miniaturas YouTube y más.",
  keywords: ["AI", "generador de imágenes", "inteligencia artificial", "arte", "diseño", "YouTube"],
  authors: [{ name: "Imagina AI" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "Imagina AI - Generador de Imágenes con IA",
    description: "Crea imágenes increíbles con inteligencia artificial",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
