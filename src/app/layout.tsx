import type { Metadata } from "next";
import { Outfit, DM_Sans, Saira_Condensed } from "next/font/google";
import "./globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const sairaCondensed = Saira_Condensed({
  variable: "--font-logo",
  subsets: ["latin", "latin-ext"],
  weight: ["700", "800"],
});

export const metadata: Metadata = {
  title: "Klíma Plus | Légkondicionáló szerelés - Celldömölk",
  description: "Professzionális klímamegoldások Celldömölkön. Teljeskörű klímaszolgáltatás Vas, Veszprém, Győr-Moson-Sopron és Zala megyében. 10 év garancia, rejtett költségek nélkül.",
  keywords: ["klíma", "légkondicionáló", "klímaszerelés", "klíma telepítés", "klíma karbantartás", "Celldömölk", "Vas megye", "klíma tisztítás"],
  authors: [{ name: "Klíma Plus Cell Kft." }],
  openGraph: {
    title: "Klíma Plus | Légkondicionáló szerelés - Celldömölk",
    description: "Professzionális klímamegoldások Celldömölkön. 10 év garancia, rejtett költségek nélkül, rövid határidővel!",
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
      <body className={`${outfit.variable} ${dmSans.variable} ${sairaCondensed.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
