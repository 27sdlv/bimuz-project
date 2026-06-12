import type { Metadata } from "next";
import { Bebas_Neue, Manrope } from "next/font/google";
import GsapProvider from "@/components/GsapProvider";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BimUz — BIM Loyihalash Kompaniyasi",
  description:
    "BimUz — O'zbekistonning yetakchi BIM loyihalash kompaniyasi. Revit texnologiyasi asosida arxitektura, konstruktiv va muhandislik loyihalari.",
  icons: {
    icon: [{ url: "/logo.png", type: "image/png" }],
    shortcut: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uz" className={`${bebasNeue.variable} ${manrope.variable}`}>
      <body>
        <GsapProvider>{children}</GsapProvider>
      </body>
    </html>
  );
}
