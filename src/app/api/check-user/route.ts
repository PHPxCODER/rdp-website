import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

    // Check if user exists in database and get 2FA status
    const user = await prisma.user.findFirst({
      where: { email: { equals: email } },
      select: {
        id: true,
        email: true,
        twoFactorEnabled: true,
        twoFactor: {
          select: {
            secret: true,
          },
        },
      }
    });

    if (!user) {
      return NextResponse.json({
        exists: false,
        twoFactorEnabled: false
      });
    }

    return NextResponse.json({
      exists: true,
      twoFactorEnabled: user.twoFactorEnabled && !!user.twoFactor?.secret,
      userId: user.id
    });
  } catch (error) {
    console.error("Error occurred:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}