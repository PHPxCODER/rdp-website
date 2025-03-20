import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import Redis from "ioredis";
import { RateLimiterRedis, RateLimiterRes } from "rate-limiter-flexible";

const [hostPort, password] = process.env.REDIS_URL!.split("@");
const [host, port] = hostPort.split(":");

// Initialize Redis connection
const redis = new Redis({
  host,
  port: Number(port),
  password,
  enableOfflineQueue: false, // Allow queueing commands if Redis is temporarily unreachable
});

// Log successful Redis connection
redis.on("connect", () => console.log("✅ Redis connected successfully"));
redis.on("error", (err) => console.error("❌ Redis connection error:", err));

// Configure rate limiter (5 requests per 60s)
const ratelimit = new RateLimiterRedis({
  storeClient: redis,
  points: 3, // Allow 5 requests
  duration: 60, // Per 60 seconds
});

export async function POST(req: NextRequest) {
  const ip = req.ip ?? req.headers.get("x-forwarded-for") ?? "unknown";

  try {
    // Consume 1 request point from rate limiter
    const rateLimitResponse: RateLimiterRes = await ratelimit.consume(ip);
    const remaining = rateLimitResponse.remainingPoints;

    const body = await req.json();
    const { email } = body;

    // Check if user exists in database
    const exists = await prisma.user.findFirst({
      where: { email: { equals: email } },
    });

    return NextResponse.json({ exists: !!exists, remaining });
  } catch (error) {
    if (error instanceof RateLimiterRes) {
      return NextResponse.json(
        { error: "Too many requests", remaining: 0 },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
