// src/app/api/admin/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(OPTIONS);

    // Check for authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Fetch all job listings
    const jobs = await prisma.jobListing.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(OPTIONS);

    // Check for authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    // Get job data from request body
    const jobData = await req.json();

    // Validate required fields
    if (!jobData.title || !jobData.department || !jobData.location || !jobData.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create new job listing
    const job = await prisma.jobListing.create({
      data: {
        title: jobData.title,
        department: jobData.department,
        location: jobData.location,
        description: jobData.description,
        requirements: jobData.requirements || [],
        isActive: jobData.isActive ?? true,
      },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Error creating job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}