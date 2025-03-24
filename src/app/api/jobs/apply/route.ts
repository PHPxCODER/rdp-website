// src/app/api/jobs/[id]/apply/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

export async function POST(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(OPTIONS);
    const jobId = params.id;
    const applicationData = await req.json();

    // Validate required fields
    if (!applicationData.fullName || !applicationData.email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if job exists and is active
    const job = await prisma.jobListing.findUnique({
      where: {
        id: jobId,
        isActive: true, // Only allow applications for active jobs
      },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found or inactive" },
        { status: 404 }
      );
    }

    // Check if user has already applied to this job
    const existingApplication = await prisma.jobApplication.findFirst({
      where: {
        jobId,
        email: applicationData.email,
      },
    });

    if (existingApplication) {
      return NextResponse.json(
        { error: "You have already applied for this position" },
        { status: 409 }
      );
    }

    // Create the application
    const application = await prisma.jobApplication.create({
      data: {
        jobId,
        userId: session?.user?.id || null, // Link to user if logged in
        fullName: applicationData.fullName,
        email: applicationData.email,
        phone: applicationData.phone || null,
        coverLetter: applicationData.coverLetter || null,
        resumeUrl: applicationData.resumeUrl || null,
        status: "pending", // Default status for new applications
      },
    });

    return NextResponse.json(
      { 
        message: "Application submitted successfully",
        applicationId: application.id
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting application:", error);
    return NextResponse.json(
      { error: "Failed to submit application" },
      { status: 500 }
    );
  }
}