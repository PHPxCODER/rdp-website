// app/layout.tsx

import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google"; // Replace with your preferred Google Font
import { ThemeProvider } from "@/components/theme-provider";
import { HeroUIProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";
import { SiteHeader } from "@/components/site-header";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Footer from "@/components/ui/Footer";

// Import Bahamas as a local font
const bahamas = localFont({
  src: "./fonts/Bahamas.woff",
  variable: "--font-bahamas",
  weight: "100 900",
});

// Import a modern Google font (e.g., Inter)
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "RDP Datacenter",
  description: "RDP Datacenter",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bahamas.variable} ${inter.variable} antialiased`}>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
            <div className="relative flex w-full flex-col items-center justify-center pb-0">
              <NextTopLoader color="#007BFF" />
              <SiteHeader />
            </div>
            {children}
            <Footer />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </HeroUIProvider>
      </body>
    </html>
  );
}
