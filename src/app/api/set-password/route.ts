import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(100, "Password must be less than 100 characters")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

export async function POST(request: NextRequest) {
  try {
    // Get current session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate password with Zod
    const validation = passwordSchema.safeParse(body);

    if (!validation.success) {
      const errors = validation.error.errors.map((err) => err.message);
      return NextResponse.json(
        { error: errors[0] }, // Return first error
        { status: 400 }
      );
    }

    const { password } = validation.data;

    // Check if user already has a credential account
    const existingAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
        password: {
          not: null,
        },
      },
    });

    if (existingAccount) {
      // User already has a password, just return success
      return NextResponse.json({
        success: true,
        alreadyExists: true
      });
    }

    // Use Better Auth's setPassword API to properly hash and store the password
    await auth.api.setPassword({
      body: {
        newPassword: password,
      },
      headers: await headers(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json(
      { error: "Failed to set password" },
      { status: 500 }
    );
  }
}
