import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { generateTwoFactorSecret } from "@/lib/twoFactorUtils";

export async function POST() {
  try {
    const session = await getServerSession(OPTIONS);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const setupData = await generateTwoFactorSecret(
      session.user.email,
      session.user.name || session.user.email,
      "RDP Datacenter"
    );

    return NextResponse.json(setupData);
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    return NextResponse.json(
      { error: "Failed to setup 2FA" },
      { status: 500 }
    );
  }
}