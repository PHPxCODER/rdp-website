import { GradientBackground } from "@/components/ui/GradientBackground";
import { Team } from "./Team";

export default function TeamPage() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-12">
      <GradientBackground />
      <h1 className="text-4xl font-bold text-center mb-8 relative z-10">Meet Our Team</h1>
      <Team />
    </div>
  );
}
