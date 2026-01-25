import type { Metadata } from "next";
import { DM_Sans, Bebas_Neue } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const bebasNeue = Bebas_Neue({
  variable: "--font-bebas",
  subsets: ["latin", "latin-ext"],
  weight: ["400"],
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
      <body className={`${dmSans.variable} ${bebasNeue.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
