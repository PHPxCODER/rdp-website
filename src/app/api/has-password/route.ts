import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function GET() {
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

    // Check if user has a credential account with password
    const credentialAccount = await prisma.account.findFirst({
      where: {
        userId: session.user.id,
        providerId: "credential",
        password: {
          not: null,
        },
      },
      select: {
        id: true,
      },
    });

    return NextResponse.json({
      hasPassword: !!credentialAccount,
    });
  } catch (error) {
    console.error("Error checking password:", error);
    return NextResponse.json(
      { error: "Failed to check password" },
      { status: 500 }
    );
  }
}
