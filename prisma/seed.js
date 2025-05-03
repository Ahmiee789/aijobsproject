const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Seeding database...');

    // 创建雇主用户
    const employer = await prisma.user.upsert({
      where: { email: 'employer@example.com' },
      update: {},
      create: {
        email: 'employer@example.com',
        passwordHash: 'password123',
        role: 'EMPLOYER',
      },
    });

    console.log('Created employer:', employer);

    // 创建求职者用户
    const applicant = await prisma.user.upsert({
      where: { email: 'applicant@example.com' },
      update: {},
      create: {
        email: 'applicant@example.com',
        passwordHash: 'password123',
        role: 'APPLICANT',
      },
    });

    console.log('Created applicant:', applicant);

    // 创建示例工作
    const jobs = [
      {
        title: 'Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'Hong Kong',
        salaryRange: '$30,000 - $40,000',
        description: 'We are looking for a skilled Frontend Developer with experience in React and Next.js.',
        employerId: employer.id,
      },
      {
        title: 'Backend Developer',
        company: 'Data Systems Ltd.',
        location: 'Hong Kong',
        salaryRange: '$35,000 - $45,000',
        description: 'Experienced Backend Developer needed for a growing startup. Node.js and PostgreSQL experience required.',
        employerId: employer.id,
      },
      {
        title: 'Full Stack Developer',
        company: 'Web Innovations',
        location: 'Remote',
        salaryRange: '$40,000 - $50,000',
        description: 'Join our team as a Full Stack Developer working on exciting projects with modern technologies.',
        employerId: employer.id,
      },
    ];

    for (const jobData of jobs) {
      const job = await prisma.job.create({
        data: jobData,
      });
      console.log('Created job:', job.title);
    }

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
