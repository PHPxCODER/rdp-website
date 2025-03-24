// src/app/api/admin/jobs/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function GET(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(OPTIONS);

    // Check for authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const jobId = params.id;

    // Fetch the job with its applications
    const job = await prisma.jobListing.findUnique({
      where: {
        id: jobId,
      },
      include: {
        applications: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    return NextResponse.json(job);
  } catch (error) {
    console.error(`Error fetching job ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(OPTIONS);

    // Check for authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const jobId = params.id;
    const jobData = await req.json();

    // Validate required fields
    if (!jobData.title || !jobData.department || !jobData.location || !jobData.description) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if job exists
    const existingJob = await prisma.jobListing.findUnique({
      where: {
        id: jobId,
      },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // Update job listing
    const updatedJob = await prisma.jobListing.update({
      where: {
        id: jobId,
      },
      data: {
        title: jobData.title,
        department: jobData.department,
        location: jobData.location,
        description: jobData.description,
        requirements: jobData.requirements || [],
        isActive: jobData.isActive ?? existingJob.isActive,
      },
    });

    return NextResponse.json(updatedJob);
  } catch (error) {
    console.error(`Error updating job ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(OPTIONS);

    // Check for authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const jobId = params.id;

    // Check if job exists
    const existingJob = await prisma.jobListing.findUnique({
      where: {
        id: jobId,
      },
      include: {
        applications: true,
      },
    });

    if (!existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    // If job has applications, we need to handle them
    if (existingJob.applications.length > 0) {
      // Option 1: Prevent deletion if applications exist
      // return NextResponse.json(
      //   { error: "Cannot delete job with existing applications" },
      //   { status: 400 }
      // );

      // Option 2: Delete all associated applications
      await prisma.jobApplication.deleteMany({
        where: {
          jobId,
        },
      });
    }

    // Delete job listing
    await prisma.jobListing.delete({
      where: {
        id: jobId,
      },
    });

    return NextResponse.json({ message: "Job deleted successfully" });
  } catch (error) {
    console.error(`Error deleting job ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}