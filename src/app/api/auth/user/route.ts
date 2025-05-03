import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In a real implementation, this would validate the token and return user data
    // For our local storage implementation, this is not actually used
    // (the client handles authentication state via localStorage directly)
    
    // Simulate the response structure for compatibility
    return NextResponse.json({
      user: null,
      authenticated: false,
      message: 'API endpoint for compatibility only. User state is managed client-side.'
    });
  } catch (error) {
    console.error('Error getting user:', error);
    return NextResponse.json(
      { error: 'Failed to get user information' },
      { status: 500 }
    );
  }
}
