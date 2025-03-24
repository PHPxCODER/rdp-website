// src/app/api/jobs/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const departmentParam = url.searchParams.get("department");
    const searchParam = url.searchParams.get("search");

    // Build filter conditions
    const filter: any = {
        department: departmentParam,
      isActive: true, // Only return active jobs
    };

    if (departmentParam) {
      filter.department = departmentParam;
    }

    if (searchParam) {
      filter.OR = [
        {
          title: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
        {
          description: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
        {
          department: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
        {
          location: {
            contains: searchParam,
            mode: "insensitive",
          },
        },
      ];
    }

    // Fetch active jobs
    const jobs = await prisma.jobListing.findMany({
      where: filter,
      orderBy: {
        createdAt: "desc",
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
            applications: true, // Count of applications for each job
          },
        },
      },
    });

    // Transform the response to format the application count
    const formattedJobs = jobs.map(job => ({
      ...job,
      applicationCount: job._count.applications,
      _count: undefined, // Remove the _count field
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}