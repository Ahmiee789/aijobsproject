import { NextRequest, NextResponse } from 'next/server';
import { createUser, getUserByEmail } from '@/utils/localStorage';

// Define UserRole to match Prisma's enum
const UserRole = {
  APPLICANT: 'APPLICANT',
  EMPLOYER: 'EMPLOYER'
};

export async function POST(request: NextRequest) {
  console.log('注册API被调用');

  try {
    let body;
    try {
      body = await request.json();
      console.log('请求体:', { email: body.email, hasPassword: !!body.password, role: body.role });
    } catch (err) {
      console.error('解析请求体失败:', err);
      return NextResponse.json(
        { error: '无效的请求格式' },
        { status: 400 }
      );
    }

    // 验证必填字段
    if (!body.email || !body.password || !body.role) {
      console.error('缺少必填字段:', { hasEmail: !!body.email, hasPassword: !!body.password, hasRole: !!body.role });
      return NextResponse.json(
        { error: '缺少必填字段' },
        { status: 400 }
      );
    }

    // 验证角色是否有效
    if (!Object.values(UserRole).includes(body.role)) {
      console.error('无效的角色:', body.role);
      return NextResponse.json(
        { error: '无效的角色' },
        { status: 400 }
      );
    }

    // 检查邮箱是否已存在
    const existingUser = getUserByEmail(body.email);
    if (existingUser) {
      return NextResponse.json(
        { error: '该邮箱已被注册' },
        { status: 400 }
      );
    }

    // 在本地存储中创建用户
    const user = createUser({
      email: body.email,
      passwordHash: body.password, // 简化版本不做哈希
      role: body.role,
    });

    // 返回创建的用户（排除密码哈希）
    return NextResponse.json({
      id: user.id,
      email: user.email,
      role: user.role,
      createdAt: user.createdAt
    }, { status: 201 });
  } catch (error) {
    console.error('注册过程中发生错误:', error);
    return NextResponse.json(
      { error: '用户注册失败，服务器错误' },
      { status: 500 }
    );
  }
}
