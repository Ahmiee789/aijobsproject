import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple middleware for localStorage version
// In a real implementation, this would check auth tokens
export async function middleware(request: NextRequest) {
  // In the localStorage version, we don't need to check auth in middleware
  // Authentication is handled client-side
  return NextResponse.next();
}

// Configure middleware to match all routes
export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
