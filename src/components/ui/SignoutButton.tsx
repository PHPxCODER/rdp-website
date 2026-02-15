"use client";

import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    localStorage.removeItem("hasSeenConfetti"); // Clear confetti session flag
    await authClient.signOut(); // Sign out with Better Auth
    router.push("/auth"); // Redirect to auth page after sign out
  };

  return (
    <Button variant="destructive" className="mt-6" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
