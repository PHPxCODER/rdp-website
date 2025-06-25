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
    "The Global Cloud Datacenter. Instant Deployment. We provide seamless, one-click deployments for your apps. Auto Scaling.",
  keywords: "RDP Datacenter, cloud solutions, high-performance hosting, datacenter services",
  authors: [{ name: "RDP Datacenter" }],
  creator: "RDP Datacenter",
  publisher: "RDP Datacenter",
  applicationName: "RDP Datacenter",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "RDP Datacenter",
    description:
      "The Global Cloud Datacenter. Instant Deployment. We provide seamless, one-click deployments for your apps. Auto Scaling.",
    url: "https://rdpdatacenter.in",
    siteName: "RDP Datacenter",
    images: [
      {
        url: "https://res.cloudinary.com/ddvheihbd/image/upload/v1742735441/assets/rdp-dc.jpg",
        width: 1200,
        height: 630,
        alt: "RDP Datacenter Logo",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RDP Datacenter",
    description:
      "The Global Cloud Datacenter. Instant Deployment. We provide seamless, one-click deployments for your apps. Auto Scaling.",
    images: [
      "https://res.cloudinary.com/ddvheihbd/image/upload/v1742735441/assets/rdp-dc.jpg",
    ],
  },
  alternates: {
    canonical: "https://rdpdatacenter.in",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
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
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "name": "RDP Datacenter",
      "alternateName": ["RDP DC", "RDP Data Center"],
      "url": "https://rdpdatacenter.in",
      "description": "The Global Cloud Datacenter. Instant Deployment. We provide seamless, one-click deployments for your apps. Auto Scaling.",
      "publisher": {
        "@type": "Organization",
        "name": "RDP Datacenter"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "RDP Datacenter",
      "alternateName": ["RDP DC", "RDP Data Center"],
      "url": "https://rdpdatacenter.in",
      "logo": {
        "@type": "ImageObject",
        "url": "https://res.cloudinary.com/ddvheihbd/image/upload/v1742735441/assets/rdp-dc.jpg",
        "width": 1200,
        "height": 630
      },
      "description": "The Global Cloud Datacenter. Instant Deployment. We provide seamless, one-click deployments for your apps. Auto Scaling.",
      "foundingDate": "2024",
      "areaServed": "Worldwide",
      "serviceType": "Cloud Computing Services"
    }
  ];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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