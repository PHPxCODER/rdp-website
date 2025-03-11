import { Toaster } from "@/components/ui/toaster";
import { CloudGlobe } from "@/components/ui/CloudGlobe";
// import { Monitoring } from "@/components/ui/Map/Monitoring";
import { PrettyBanner } from "@/components/ui/PrettyBanner";
import Marquee from "@/components/Marquee";

export default function LandingPage() {
  return (
    <>
      <CloudGlobe />
      {/* <Monitoring /> */}
      <Marquee />
      <PrettyBanner />
      <Toaster />
    </>
  );
}
