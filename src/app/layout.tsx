import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { HeroUIProvider } from "@heroui/react";
import NextTopLoader from "nextjs-toploader";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";

// Import Bahamas as a local font
const bahamas = localFont({
  src: "./(landing)/fonts/Bahamas.woff",
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
        <SessionWrapper>
        <HeroUIProvider>
          <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
              <NextTopLoader color="#007BFF" />
            {children}
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </HeroUIProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
