import { NextRequest, NextResponse } from 'next/server';
import { createJob } from '@/utils/localStorage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // 验证必填字段
    if (!body.title || !body.company || !body.location || !body.employerId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Use local storage instead of Prisma
    const job = createJob({
      title: body.title,
      company: body.company,
      location: body.location,
      salaryRange: body.salaryRange,
      description: body.description,
      employerId: body.employerId,
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error('Error creating job:', error);
    return NextResponse.json(
      { error: 'Failed to create job' },
      { status: 500 }
    );
  }
}
