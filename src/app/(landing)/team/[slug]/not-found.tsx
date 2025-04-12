import { Button } from "@heroui/button";
import Link from "next/link";
import { GradientBackground } from "@/components/ui/GradientBackground";

export default function TeamMemberNotFound() {
  return (
    <div className="relative min-h-[calc(100vh-15rem)] flex flex-col items-center justify-center px-6 py-12">
      <GradientBackground />
      <div className="relative z-10 text-center max-w-lg mx-auto">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">404</h1>
        <h2 className="text-2xl font-bold mb-4">Team Member Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          We couldn&apos;t find the team member you&apos;re looking for. They might have moved to a different page or the URL might be incorrect.
        </p>
        <Link href="/team" passHref>
          <Button color="primary" size="lg">
            Back to Team
          </Button>
        </Link>
      </div>
    </div>
  );
}