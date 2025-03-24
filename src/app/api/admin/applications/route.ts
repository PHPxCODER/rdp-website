// src/app/api/admin/applications/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(OPTIONS);

    // Check for authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Parse URL to get any query parameters
    const url = new URL(req.url);
    const jobId = url.searchParams.get("jobId");
    const status = url.searchParams.get("status");

    // Build the filter conditions
    const filter: any = {};
    
    if (jobId) {
      filter.jobId = jobId;
    }
    
    if (status) {
      filter.status = status;
    }

    // Fetch all applications with related job info
    const applications = await prisma.jobApplication.findMany({
      where: filter,
      include: {
        job: {
          select: {
            id: true,
            title: true,
            department: true,
            location: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}