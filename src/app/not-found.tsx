import { siteConfig } from "@/config/site";
import { SiteHeader } from "@/components/site-header";
import { Footer } from "@/components/ui/Footer";
import ErrorPage from "@/components/ErrorPage";

export const metadata = {
  title: `Page Not Found | ${siteConfig.name}`,
};

const NotFound = async () => {
  return (
    <>
    <SiteHeader />
    <ErrorPage />
    <Footer />
    </>
  );
};

export default NotFound;