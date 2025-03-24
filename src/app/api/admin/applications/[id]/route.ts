// src/app/api/admin/applications/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { OPTIONS } from "@/auth.config";
import { prisma } from "@/lib/prisma";

interface Params {
  params: {
    id: string;
  };
}

// Valid application statuses
const VALID_STATUSES = ["pending", "reviewed", "interviewed", "rejected", "accepted"];

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

    const applicationId = params.id;

    // Fetch the application with job information
    const application = await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },
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
    });

    if (!application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error(`Error fetching application ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const session = await getServerSession(OPTIONS);

    // Check for authentication and authorization
    if (!session) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MGMT") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const applicationId = params.id;
    const updateData = await req.json();

    // If status is provided, validate it
    if (updateData.status && !VALID_STATUSES.includes(updateData.status)) {
      return NextResponse.json(
        { error: "Invalid status value" },
        { status: 400 }
      );
    }

    // Check if application exists
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!existingApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Update application status
    const updatedApplication = await prisma.jobApplication.update({
      where: {
        id: applicationId,
      },
      data: {
        status: updateData.status || existingApplication.status,
      },
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
    });

    return NextResponse.json(updatedApplication);
  } catch (error) {
    console.error(`Error updating application ${params.id}:`, error);
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

    const applicationId = params.id;

    // Check if application exists
    const existingApplication = await prisma.jobApplication.findUnique({
      where: {
        id: applicationId,
      },
    });

    if (!existingApplication) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    // Delete the application
    await prisma.jobApplication.delete({
      where: {
        id: applicationId,
      },
    });

    return NextResponse.json({ message: "Application deleted successfully" });
  } catch (error) {
    console.error(`Error deleting application ${params.id}:`, error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}