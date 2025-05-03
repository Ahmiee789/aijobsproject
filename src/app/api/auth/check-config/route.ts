import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Check required env vars for Supabase
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('Missing required Supabase configuration');
    }

    const config = {
      url: supabaseUrl,
      anonKey: supabaseAnonKey,
    };

    return NextResponse.json({
      message: 'Supabase config is valid',
      config,
      env: {
        hasSiteUrl: !!process.env.NEXT_PUBLIC_SITE_URL,
        siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      },
    });
  } catch (error) {
    console.error('Error checking config:', error);
    return NextResponse.json(
      { error: 'Failed to check configuration' },
      { status: 500 }
    );
  }
}
