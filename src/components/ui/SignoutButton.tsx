"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {

  const handleSignOut = () => {
    localStorage.removeItem("hasSeenConfetti"); // Clear confetti session flag
    signOut({ callbackUrl: "/auth" }); // Redirect to auth page after sign out
  };

  return (
    <Button variant="destructive" className="mt-6" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
};

export default SignOutButton;
