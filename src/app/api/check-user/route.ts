import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.fixedWindow(3, "60s"), // 3 requests per 60 seconds
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";

  // Enforce rate limit and get remaining attempts
  const { success, remaining } = await ratelimit.limit(ip);

  if (!success) {
    return NextResponse.json(
      { error: "Too many requests", remaining },
      { status: 429 }
    );
  }

  const body = await req.json();
  const { email } = body;

  const exists = await prisma.user.findFirst({
    where: { email: { equals: email } },
  });

  return NextResponse.json({ exists: !!exists, remaining });
}
