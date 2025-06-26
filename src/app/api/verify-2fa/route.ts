import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTwoFactorToken, verifyAndConsumeBackupCode } from "@/lib/twoFactorUtils";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, code, isBackupCode = false } = body;

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required" },
        { status: 400 }
      );
    }

    // Get user with 2FA details
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        twoFactorSecret: true,
        backupCodes: true,
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA is not enabled for this user" },
        { status: 400 }
      );
    }

    let isValid = false;
    let updatedBackupCodes = user.backupCodes;

    if (isBackupCode) {
      // Verify backup code
      const result = verifyAndConsumeBackupCode(code, user.backupCodes);
      isValid = result.isValid;
      updatedBackupCodes = result.remainingCodes;

      // Update backup codes in database if valid
      if (isValid) {
        await prisma.user.update({
          where: { id: user.id },
          data: { backupCodes: updatedBackupCodes }
        });
      }
    } else {
      // Verify TOTP token
      isValid = verifyTwoFactorToken(code, user.twoFactorSecret);
    }

    if (!isValid) {
      return NextResponse.json(
        { 
          error: isBackupCode ? "Invalid backup code" : "Invalid authenticator code",
          valid: false 
        },
        { status: 400 }
      );
    }

    // Return success with user info
    return NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
      },
      remainingBackupCodes: isBackupCode ? updatedBackupCodes.length : user.backupCodes.length
    });

  } catch (error) {
    console.error("Error verifying 2FA:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}