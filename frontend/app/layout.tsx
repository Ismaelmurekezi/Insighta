import type { Metadata } from "next";
import { Kaisei_Opti } from "next/font/google";
import { Jomolhari } from "next/font/google";
import { Kaisei_HarunoUmi } from "next/font/google";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", weight: ["400", "500", "700"] });

const kaisei = Kaisei_Opti({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-kaisei",
});

const jomolhari = Jomolhari({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-jomolhari",
});

const harunoUmi = Kaisei_HarunoUmi({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-haruno-umi",
});



export const metadata: Metadata = {
  title: "Insighta App",
  description: "This is a comprehension blog application to help person to share his insight to the world",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={harunoUmi.className}>{children}</body>
    </html>
  );
}
