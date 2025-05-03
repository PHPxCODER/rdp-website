"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { GradientBackground } from "@/components/ui/GradientBackground";

export default function UpdateProfileError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Update profile error:", error);
  }, [error]);

  return (
    <div className="relative min-h-[calc(100vh-8rem)] flex items-center justify-center p-4">
      <GradientBackground />
      
      <div className="relative z-10 bg-black/10 backdrop-blur-md border border-white/20 rounded-lg p-8 max-w-lg w-full space-y-6 text-center">
        <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-red-100/10">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-white">Profile Update Error</h1>
        
        <p className="text-white/80">
          {error.message || "Something went wrong while updating your profile. Please try again."}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center">
          <Button onClick={reset} variant="outline">
            Try Again
          </Button>
          
          <Button onClick={() => router.push("/dash")}>
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
}