/**
 * Better Auth Client
 *
 * This is the client-side instance for Better Auth.
 * Use this in all client components for authentication operations.
 *
 * Usage:
 * - const { data: session } = authClient.useSession();
 * - await authClient.signIn.social({ provider: "google" });
 * - await authClient.signOut();
 * - await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
 * - await authClient.twoFactor.enable({ password });
 */

"use client";

import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";
import { emailOTPClient } from "better-auth/client/plugins";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",

  plugins: [
    // 2FA Client Plugin
    twoFactorClient({
      // Automatically redirect to 2FA page when 2FA is required
      onTwoFactorRedirect() {
        if (typeof window !== "undefined") {
          window.location.href = "/authflow?step=twoFactor";
        }
      },
    }),

    // Email OTP Client Plugin
    emailOTPClient(),
  ],
});

// Export type-safe hooks and methods
export const { useSession, signIn, signOut, signUp } = authClient;
