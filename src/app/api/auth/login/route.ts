import { NextRequest, NextResponse } from 'next/server';
import { getUserByEmail, setCurrentUser } from '@/utils/localStorage';

export async function POST(request: NextRequest) {
  console.log('登录API被调用');

  try {
    let body;
    try {
      body = await request.json();
      console.log('请求体:', { email: body.email, hasPassword: !!body.password });
    } catch (err) {
      console.error('解析请求体失败:', err);
      return NextResponse.json(
        { error: '无效的请求格式' },
        { status: 400 }
      );
    }

    // 验证必填字段
    if (!body.email || !body.password) {
      console.error('缺少必填字段:', { hasEmail: !!body.email, hasPassword: !!body.password });
      return NextResponse.json(
        { error: '缺少邮箱或密码' },
        { status: 400 }
      );
    }

    // 从本地存储获取用户
    const user = getUserByEmail(body.email);

    // 简化的密码验证逻辑 (在实际应用中应该使用哈希比较)
    if (!user || user.passwordHash !== body.password) {
      return NextResponse.json(
        { error: '邮箱或密码不正确' },
        { status: 401 }
      );
    }

    // 在本地存储中设置当前用户
    setCurrentUser(user);

    // 返回用户信息和模拟会话
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      },
      session: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      },
    });
  } catch (error) {
    console.error('登录过程中发生错误:', error);
    return NextResponse.json(
      { error: '登录失败，服务器错误' },
      { status: 500 }
    );
  }
}
