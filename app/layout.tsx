import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navbar } from "@/components/site/navbar";
import { Footer } from "@/components/site/footer";
import { SupportWidget } from "@/components/site/support-widget";
import { MobileDock } from "@/components/site/mobile-dock";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: "Mo.jrk | منصة خدمات رقمية",
    template: "%s | Mo.jrk"
  },
  description: siteConfig.description,
  openGraph: {
    title: "Mo.jrk",
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: "Mo.jrk",
    locale: "ar_SY",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mo.jrk",
    description: siteConfig.description
  }
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <Navbar />
        <main className="pb-24 md:pb-0">{children}</main>
        <Footer />
        <SupportWidget />
        <MobileDock />
      </body>
    </html>
  );
}
