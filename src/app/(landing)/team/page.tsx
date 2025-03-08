import { GradientBackground } from "@/components/ui/GradientBackground";
import { siteConfig } from "@/config/site";
import { Team } from "./Team";

export const metadata = {
  title: `Team Members | ${siteConfig.name}`,
};

export default function TeamPage() {
  return (
    <div className="relative flex flex-col px-6 py-16">
      <GradientBackground />
      <h1 className="text-4xl font-bold text-center mb-8 relative z-10">Meet Our Team</h1>
      <Team />
    </div>
  );
}
