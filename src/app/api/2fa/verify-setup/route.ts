// /api/2fa/verify-setup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyTwoFactorToken } from "@/lib/twoFactorUtils";

export async function POST(req: NextRequest) {
  try {
    const { secret, token } = await req.json();

    if (!secret || !token) {
      return NextResponse.json(
        { error: "Secret and token are required" },
        { status: 400 }
      );
    }

    const isValid = verifyTwoFactorToken(token, secret);

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid token" },
        { status: 400 }
      );
    }

    return NextResponse.json({ valid: true });
  } catch (error) {
    console.error("Error verifying 2FA setup:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}