import { createClient } from '@supabase/supabase-js';

// Log environment variables loading
console.log('Loading environment variables...');
console.log('Current environment:', process.env.NODE_ENV);

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables:', {
    hasUrl: !!supabaseUrl,
    hasKey: !!supabaseAnonKey
  });
  throw new Error('Missing required Supabase configuration');
}

console.log('✅ Supabase configuration loaded:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey
});

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('❌ Supabase connection error:', error.message);
  } else {
    console.log('✅ Supabase connection test successful:', {
      hasSession: !!data.session,
      user: data.session?.user?.email
    });
  }
}).catch(error => {
  console.error('❌ Supabase initialization error:', error);
});

// Export a function to check if Supabase is configured
export function checkSupabaseConfig() {
  return {
    supabaseUrl,
    hasAnonKey: !!supabaseAnonKey,
    isConfigured: !!supabaseUrl && !!supabaseAnonKey
  };
}
