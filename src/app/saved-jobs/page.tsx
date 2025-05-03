'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { JobDetail } from '@/types/job';
import { mockJobs } from '@/components/JobList';
import { supabase } from '@/lib/supabase';

export default function SavedJobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [savedJobs, setSavedJobs] = useState<JobDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'APPLICANT') {
      router.push('/');
    } else {
      loadSavedJobs();
    }
  }, [user, router]);

  const loadSavedJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get saved job IDs from Supabase
      const { data: savedJobsData, error: fetchError } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user?.id);

      if (fetchError) throw fetchError;

      // Get the job IDs
      const savedJobIds = savedJobsData?.map(item => item.job_id) || [];

      // Filter mockJobs to get only saved ones
      const jobs = mockJobs.filter(job => savedJobIds.includes(job.id));
      // FIXME: get saved jobs from supabase
      // setSavedJobs(jobs);
    } catch (err) {
      console.error('Error loading saved jobs:', err);
      setError('Failed to load saved jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnsaveJob = async (jobId: number) => {
    try {
      setError(null);

      // Delete the saved job from Supabase
      const { error: deleteError } = await supabase
        .from('saved_jobs')
        .delete()
        .eq('user_id', user?.id)
        .eq('job_id', jobId);

      if (deleteError) throw deleteError;

      // Update the local state
      setSavedJobs(prev => prev.filter(job => job.id !== jobId));
    } catch (err) {
      console.error('Error removing saved job:', err);
      setError('Failed to remove job. Please try again.');
    }
  };

  const handleViewJob = (jobId: number) => {
    router.push(`/jobs/${jobId}`);
  };

  if (!user || user.role !== 'APPLICANT') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-900">Saved Jobs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Jobs you've saved for later. Apply when you're ready.
            </p>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border-l-4 border-red-400">
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
          )}

          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                <p className="mt-2 text-sm text-gray-500">Loading saved jobs...</p>
              </div>
            ) : savedJobs.length === 0 ? (
              <div className="text-center py-12">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No saved jobs</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Start saving jobs you're interested in to apply later.
                </p>
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={() => router.push('/search')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Browse Jobs
                  </button>
                </div>
              </div>
            ) : (
              savedJobs.map((job) => (
                <div key={job.id} className="p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-3">
                        <h2 className="text-lg font-medium text-gray-900">{job.title}</h2>
                        {job.is_new && (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            New
                          </span>
                        )}
                      </div>
                      <div className="mt-1">
                        <p className="text-sm text-gray-600">{job.company}</p>
                        <p className="text-sm text-gray-500">{job.location}</p>
                      </div>
                      <div className="mt-2 flex items-center space-x-4">
                        <span className="text-sm text-gray-500">{job.salary}</span>
                        <span className="text-sm text-gray-500">{job.posted_ago}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleUnsaveJob(job.id)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                      <button
                        onClick={() => handleViewJob(job.id)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        View Job
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
} 