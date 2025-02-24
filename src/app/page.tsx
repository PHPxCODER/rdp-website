import { CloudGlobe } from "@/components/ui/CloudGlobe";
import { Monitoring } from "@/components/ui/Map/Monitoring";
import { InstallBanner } from "@/components/ui/install-banner";
import Marquee from "@/components/Marquee";
export default function Home() {
  return (
  <>
  <CloudGlobe />
  <Monitoring />
  <Marquee/>
  <InstallBanner />
  </>
  );
}
