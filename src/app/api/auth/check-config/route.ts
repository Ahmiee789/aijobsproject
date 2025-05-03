import { NextResponse } from 'next/server';
import { checkSupabaseConfig } from '@/lib/supabase';

export async function GET() {
  try {
    // 检查Supabase配置
    const config = checkSupabaseConfig();

    return NextResponse.json({
      message: 'Supabase配置检查',
      config,
      env: {
        hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      }
    });
  } catch (error) {
    console.error('Error checking config:', error);
    return NextResponse.json(
      { error: '配置检查失败' },
      { status: 500 }
    );
  }
}
