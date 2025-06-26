// /api/2fa/regenerate-backup-codes/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { prisma } from "@/lib/prisma";
import { generateBackupCodes } from "@/lib/twoFactorUtils";

export async function POST() {
  try {
    const session = await getServerSession(OPTIONS);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user has 2FA enabled
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { twoFactorEnabled: true }
    });

    if (!user?.twoFactorEnabled) {
      return NextResponse.json(
        { error: "2FA is not enabled" },
        { status: 400 }
      );
    }

    // Generate new backup codes
    const newBackupCodes = generateBackupCodes();

    // Update user with new backup codes
    await prisma.user.update({
      where: { id: session.user.id },
      data: { backupCodes: newBackupCodes },
    });

    return NextResponse.json({ backupCodes: newBackupCodes });
  } catch (error) {
    console.error("Error regenerating backup codes:", error);
    return NextResponse.json(
      { error: "Failed to regenerate backup codes" },
      { status: 500 }
    );
  }
}