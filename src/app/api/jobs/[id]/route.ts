// src/app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const jobId = params.id;

    // Fetch the job by ID
    const job = await prisma.jobListing.findUnique({
      where: {
        id: jobId,
        isActive: true, // Only return active jobs
      },
      select: {
        id: true,
        title: true,
        department: true,
        location: true,
        description: true,
        requirements: true,
        createdAt: true,
        updatedAt: true,
        // Don't include isActive in the response
        _count: {
          select: {
            applications: true, // Count of applications for the job
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or inactive" },
        { status: 404 }
      );
    }

    // Format the response
    const formattedJob = {
      ...job,
      applicationCount: job._count.applications,
      _count: undefined, // Remove the _count field
    };

    return NextResponse.json(formattedJob);
  } catch (error) {
    console.error(`Error fetching job ${params.id}:`, error);
    return NextResponse.json(
      { error: "Failed to fetch job details" },
      { status: 500 }
    );
  }
}