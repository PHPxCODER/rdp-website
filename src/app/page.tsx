import { CloudGlobe } from "@/components/ui/CloudGlobe";
// import { Monitoring } from "@/components/ui/Map/Monitoring";
import { PrettyBanner } from "@/components/ui/PrettyBanner";
import Marquee from "@/components/Marquee";
export default function Home() {
  return (
  <>
  <CloudGlobe />
  {/* <Monitoring /> */}
  <Marquee/>
  <PrettyBanner />
  </>
  );
}
