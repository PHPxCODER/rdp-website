import { ProBanner } from "@/components/ProBanner";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/ui/Footer";

interface LandingLayoutProps {
  children: React.ReactNode;
}

export default async function LandingLayout({
  children,
}: LandingLayoutProps) {
  return (
    <>
      <ProBanner />
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}