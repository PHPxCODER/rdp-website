"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

const SignOutButton = () => {
  return (
    <Button
      variant="destructive"
      className="mt-6"
      onClick={() => signOut({ callbackUrl: "/auth" })}
    >
      Sign Out
    </Button>
  );
};

export default SignOutButton;
