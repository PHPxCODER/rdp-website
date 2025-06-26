// src/app/api/2fa-callback/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyTwoFactorToken, verifyAndConsumeBackupCode } from "@/lib/twoFactorUtils";
import { encode } from "next-auth/jwt";

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
        name: true,
        role: true,
        phoneNumber: true,
        image: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
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

    // Create JWT token manually for NextAuth session
    const token = await encode({
      token: {
        sub: user.id,
        name: user.name || user.email, // Fallback to email if name is null
        email: user.email,
        picture: user.image, // For standard JWT
        image: user.image, // For NextAuth JWT interface
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
        // Include all user data that NextAuth session callback expects
        id: user.id,
        role: user.role,
        phoneNumber: user.phoneNumber,
        emailVerified: user.emailVerified,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
        twoFactorEnabled: user.twoFactorEnabled,
        twoFactorSecret: user.twoFactorSecret,
        backupCodes: updatedBackupCodes,
      },
      secret: process.env.NEXTAUTH_SECRET!,
    });

    // Set the session cookie name based on environment
    const sessionCookieName = process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token' 
      : 'next-auth.session-token';

    // Create response
    const response = NextResponse.json({
      valid: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      remainingBackupCodes: isBackupCode ? updatedBackupCodes.length : user.backupCodes.length
    });

    // Set the session cookie with proper NextAuth configuration
    response.cookies.set(sessionCookieName, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: '/',
      // Add domain if in production
      ...(process.env.NODE_ENV === 'production' && {
        domain: process.env.NEXTAUTH_URL ? new URL(process.env.NEXTAUTH_URL).hostname : undefined
      })
    });

    return response;

  } catch (error) {
    console.error("Error in 2FA callback:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}