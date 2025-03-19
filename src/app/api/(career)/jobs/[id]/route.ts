// File: app/api/jobs/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// In a real application, this would fetch data from a database
const mockJobs: Record<string, { title: string; department: string; location: string; description: string }> = {
  'dev-001': {
    title: 'Frontend Developer',
    department: 'Engineering',
    location: 'Remote',
    description: 'We are looking for a skilled frontend developer with NextJS experience.'
  },
  'des-001': {
    title: 'UI/UX Designer',
    department: 'Design',
    location: 'New York, NY',
    description: 'Join our design team to create beautiful user experiences.'
  },
  'pm-001': {
    title: 'Product Manager',
    department: 'Product',
    location: 'San Francisco, CA',
    description: 'Help shape the future of our products.'
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const jobId = params.id;

  // Simulate database lookup
  if (mockJobs[jobId]) {
    return NextResponse.json(mockJobs[jobId], { status: 200 });
  } else {
    return NextResponse.json(
      { message: 'Job not found' },
      { status: 404 }
    );
  }
}