'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { UserRole } from '@prisma/client';

// Add console logs to check environment variables
console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY (first 10 chars):', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.slice(0, 10));

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.APPLICANT);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      console.log('Starting registration process...');
      console.log('Registration data:', { email, role });
      
      // Sign up the user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/login`,
          data: {
            role: role
          }
        }
      });

      console.log('Sign up response:', { authData, error: authError?.message });

      if (authError) {
        console.error('Auth Error:', authError);
        throw authError;
      }

      if (authData.user) {
        console.log('User created successfully:', authData.user.id);
        
        // Show success message and redirect
        setError('');
        router.push('/login?message=Please check your email to verify your account');
      }
    } catch (error: any) {
      console.error('Registration error details:', {
        message: error.message,
        name: error.name,
        code: error.code,
        details: error.details,
        hint: error.hint,
        stack: error.stack
      });
      setError(error.message || error.details || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-900 dark:to-neutral-800 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 rounded-lg flex items-center justify-center shadow-md ai-glow">
              <span className="text-white font-bold text-2xl">AI</span>
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold ai-gradient-text">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            Join AIJobs to find your next opportunity
          </p>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} suppressHydrationWarning>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Email address
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white transition-colors"
                  placeholder="Enter your email"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                Password
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full px-4 py-3 border border-neutral-300 dark:border-neutral-700 rounded-lg shadow-sm placeholder-neutral-500 dark:placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-neutral-800 dark:text-white transition-colors"
                  placeholder="Create a password"
                  suppressHydrationWarning
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                I want to
              </label>
              <div className="space-y-3">
                <div className="flex items-center p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    id="role-applicant"
                    name="role"
                    type="radio"
                    checked={role === UserRole.APPLICANT}
                    onChange={() => setRole(UserRole.APPLICANT)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300"
                    suppressHydrationWarning
                  />
                  <label htmlFor="role-applicant" className="ml-3 block text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    Find a job
                  </label>
                </div>
                <div className="flex items-center p-3 rounded-lg border border-neutral-200 dark:border-neutral-700 hover:border-blue-500 dark:hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    id="role-employer"
                    name="role"
                    type="radio"
                    checked={role === UserRole.EMPLOYER}
                    onChange={() => setRole(UserRole.EMPLOYER)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-neutral-300"
                    suppressHydrationWarning
                  />
                  <label htmlFor="role-employer" className="ml-3 block text-sm text-neutral-700 dark:text-neutral-300 cursor-pointer">
                    Post jobs
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 via-purple-600 to-teal-500 hover:from-blue-700 hover:via-purple-700 hover:to-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-neutral-900 transition-all duration-200 disabled:opacity-50"
              suppressHydrationWarning
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>

        <div className="text-center">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            Already have an account?{' '}
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
