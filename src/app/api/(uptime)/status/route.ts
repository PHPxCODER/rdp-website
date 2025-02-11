import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; 

const BETTERSTACK_API_URL = "https://betteruptime.com/api/v2/status-pages/196085";

export async function GET() {
  try {
    const response = await fetch(BETTERSTACK_API_URL, {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${process.env.BETTERSTACK_API_KEY}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch status: ${response.statusText}`);
    }

    const data = await response.json();
    const aggregateState = data?.data?.attributes?.aggregate_state || "unknown";

    return NextResponse.json({ status: aggregateState });
  } catch (error) {
    console.error("Error fetching BetterStack status:", error);
    return NextResponse.json({ error: "Failed to fetch status" }, { status: 500 });
  }
}
