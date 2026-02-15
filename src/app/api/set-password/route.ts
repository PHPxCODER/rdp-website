import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

export const dynamic = 'force-dynamic';

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

    // Use Better Auth's setPassword API to properly hash and store the password
    // This handles password creation atomically
    try {
      await auth.api.setPassword({
        body: {
          newPassword: password,
        },
        headers: await headers(),
      });

      // Check if this was a new password or if one already existed
      const credentialAccount = await prisma.account.findFirst({
        where: {
          userId: session.user.id,
          providerId: "credential",
          password: {
            not: null,
          },
        },
      });

      return NextResponse.json({
        success: true,
        alreadyExists: credentialAccount !== null
      });
    } catch (error: unknown) {
      // If setPassword fails because password already exists, treat as success
      const errorMessage = error instanceof Error ? error.message : "";
      const errorStatus = typeof error === "object" && error !== null && "status" in error ? (error as { status: number }).status : undefined;

      if (errorMessage.includes("already has a password") ||
          errorMessage.includes("credential") ||
          errorStatus === 400) {
        return NextResponse.json({
          success: true,
          alreadyExists: true
        });
      }
      // Re-throw unexpected errors
      throw error;
    }
  } catch (error) {
    console.error("Error setting password:", error);
    return NextResponse.json(
      { error: "Failed to set password" },
      { status: 500 }
    );
  }
}
