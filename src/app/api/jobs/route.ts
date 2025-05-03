import { NextResponse } from 'next/server';
import { getJobs } from '@/utils/localStorage';

export async function GET() {
  try {
    // Using local storage instead of Prisma
    const jobs = getJobs();
    
    // Format the response to match the Prisma response structure
    const formattedJobs = jobs.map(job => ({
      ...job,
      employer: {
        id: job.employerId,
        email: 'employer@example.com', // Simplified for demo
      }
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
