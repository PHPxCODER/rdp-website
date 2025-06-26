// /api/2fa/enable/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(OPTIONS);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { secret, backupCodes } = await req.json();

    if (!secret || !backupCodes || !Array.isArray(backupCodes)) {
      return NextResponse.json(
        { error: "Secret and backup codes are required" },
        { status: 400 }
      );
    }

    // Update user with 2FA settings
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
        backupCodes: backupCodes,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error enabling 2FA:", error);
    return NextResponse.json(
      { error: "Failed to enable 2FA" },
      { status: 500 }
    );
  }
}