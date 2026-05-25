import type { Metadata, Viewport } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";
import CookieConsent from "@/components/cookie-consent";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: "Klíma Plus | Légkondicionáló szerelés - Celldömölk",
  description: "Professzionális klímamegoldások Celldömölkön. Teljeskörű klímaszolgáltatás Vas, Veszprém, Győr-Moson-Sopron és Zala megyében.",
  keywords: ["klíma", "légkondicionáló", "klímaszerelés", "klíma telepítés", "klíma karbantartás", "Celldömölk", "Vas megye", "klíma tisztítás"],
  authors: [{ name: "Klíma Plus Cell Kft." }],
  openGraph: {
    title: "Klíma Plus | Légkondicionáló szerelés - Celldömölk",
    description: "Professzionális klímamegoldások Celldömölkön. Teljeskörű klímaszolgáltatás Vas, Veszprém, Győr-Moson-Sopron és Zala megyében.",
    locale: "hu_HU",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hu" className="scroll-smooth">
      <body className={`${dmSans.variable} ${bebasNeue.variable} antialiased overflow-x-hidden`}>
        {children}
        <CookieConsent />
      </body>
    </html>
  );
}
