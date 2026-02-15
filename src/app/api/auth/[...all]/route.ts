/**
 * Better Auth API Route Handler
 *
 * This replaces the NextAuth [...nextauth] route.
 * All authentication requests go through this route.
 *
 * Supported endpoints:
 * - OAuth: /api/auth/callback/google, /api/auth/callback/github, /api/auth/callback/cognito
 * - Email OTP: /api/auth/email-otp/send, /api/auth/email-otp/verify
 * - 2FA: /api/auth/two-factor/enable, /api/auth/two-factor/verify-totp, etc.
 * - Session: /api/auth/get-session, /api/auth/sign-out
 */

import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth);

// Runtime configuration (if needed)
export const runtime = "nodejs";
