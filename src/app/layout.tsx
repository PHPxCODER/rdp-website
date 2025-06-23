import "./globals.css";
import type { Metadata } from "next";
import localFont from "next/font/local";
import { Inter } from "next/font/google";
import SessionWrapper from "@/components/SessionWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { HeroUIProvider } from "@heroui/react";
// import NextTopLoader from "nextjs-toploader";
import TopLoader from "@/components/TopLoaderWrapper";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { PostHogProvider } from "@/components/PostHogProvider";

 export const metadata: Metadata = {
  title: {
    default: "RDP Datacenter",
    template: "%s | RDP Datacenter",
  },
  description:
    "High-performance cloud solutions from RDP Datacenter – Fast, secure, and reliable.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "RDP Datacenter",
    description:
      "High-performance cloud solutions from RDP Datacenter – Fast, secure, and reliable.",
    url: "https://rdpdatacenter.in",
    siteName: "RDP Datacenter",
    images: [
      {
        url: "https://res.cloudinary.com/ddvheihbd/image/upload/v1742735441/assets/rdp-dc.jpg",
        width: 1200,
        height: 630,
        alt: "RDP Datacenter",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RDP Datacenter",
    description:
      "High-performance cloud solutions from RDP Datacenter – Fast, secure, and reliable.",
    images: [
      "https://res.cloudinary.com/ddvheihbd/image/upload/v1742735441/assets/rdp-dc.jpg",
    ],
  },
  alternates: {
    canonical: "https://rdpdatacenter.in",
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${bahamas.variable} ${inter.variable} antialiased`}>
        <PostHogProvider>
          <SessionWrapper>
            <HeroUIProvider>
              <ThemeProvider attribute="class" defaultTheme="dark" disableTransitionOnChange>
                {/* <NextTopLoader color="#007BFF" /> */}
                <TopLoader>
                {children}
                </TopLoader>
                <Analytics />
                <SpeedInsights />
              </ThemeProvider>
            </HeroUIProvider>
          </SessionWrapper>
        </PostHogProvider>
      </body>
    </html>
  );
}