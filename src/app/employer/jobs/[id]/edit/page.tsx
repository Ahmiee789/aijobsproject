'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types/database';
import Navbar from '@/components/Navbar';
import PostJobForm from '@/components/PostJobForm';

interface EditJobPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditJobPage({ params }: EditJobPageProps) {
  const resolvedParams = React.use(params);
  const { user } = useAuth();
  const router = useRouter();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'EMPLOYER') {
      router.push('/');
    } else {
      loadJob();
    }
  }, [user, router, resolvedParams.id]);

  const loadJob = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading job details:', resolvedParams.id);
      const jobData = await jobsApi.getJob(resolvedParams.id);
      
      // Verify that the job belongs to the current employer
      if (jobData.employer_id !== user?.id) {
        throw new Error('You do not have permission to edit this job');
      }

      console.log('Job loaded:', jobData);
      setJob(jobData);
    } catch (error: any) {
      console.error('Error loading job:', error);
      setError(error.message || 'Failed to load job');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    router.push('/employer/jobs');
  };

  if (!user || user.role !== 'EMPLOYER') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading job details...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        ) : job ? (
          <PostJobForm
            initialData={job}
            onClose={handleClose}
          />
        ) : null}
      </main>
    </div>
  );
} 