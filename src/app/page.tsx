import { CloudGlobe } from "@/components/ui/CloudGlobe";
import { Monitoring } from "@/components/ui/Map/Monitoring";
import { InstallBanner } from "@/components/ui/install-banner";
export default function Home() {
  return (
  <>
  <CloudGlobe />
  <Monitoring />
  <InstallBanner />
  </>
  );
}
