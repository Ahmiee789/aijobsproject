const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    // 测试连接
    console.log('Testing database connection...');

    // 创建一个测试用户
    const testUser = await prisma.user.create({
      data: {
        email: 'test@example.com',
        passwordHash: 'test-password-hash',
        role: 'APPLICANT',
      },
    });

    console.log('Created test user:', testUser);

    // 查询所有用户
    const allUsers = await prisma.user.findMany();
    console.log('All users:', allUsers);

    // 删除测试用户
    await prisma.user.delete({
      where: {
        id: testUser.id,
      },
    });

    console.log('Test user deleted');
    console.log('Database connection successful!');
  } catch (error) {
    console.error('Error testing database connection:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
