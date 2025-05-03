'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/supabase';
import { Job } from '@/types/database';
import Navbar from '@/components/Navbar';
import { mockJobs } from '@/components/JobList';

interface JobDetailsPageProps {
  params: Promise<{
    id: string;
  }>;
}

function JobContent({ jobId }: { jobId: string }) {
  const router = useRouter();
  const { user } = useAuth();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadJob = async () => {
      if (!jobId) return;
      
      try {
        setLoading(true);
        setError(null);

        // First check mock jobs since they're in memory
        const mockJob = mockJobs.find(j => j.id === jobId);
        if (mockJob) {
          if (mounted) {
            setJob(mockJob);
            setLoading(false);
          }
          return;
        }

        // If not a mock job, fetch from Supabase
        const { data: jobData, error } = await supabase
          .from('jobs')
          .select('*')
          .eq('id', jobId)
          .single();

        if (!mounted) return;

        if (error) throw error;

        if (jobData) {
          setJob({
            ...jobData,
            id: jobData.id.toString(),
            match_score: Math.floor(Math.random() * 20) + 80,
            posted_ago: jobData.created_at ? getTimeAgo(jobData.created_at) : 'Recently',
            is_new: jobData.created_at ? isNewJob(jobData.created_at) : false
          });
        } else {
          setError('Job not found');
        }
      } catch (error) {
        if (mounted) {
          console.error('Error loading job:', error);
          setError('Failed to load job details. Please try again.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    loadJob();

    return () => {
      mounted = false;
    };
  }, [jobId]);

  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setIsApplying(true);
    try {
      // TODO: Implement job application logic
      alert('Application feature coming soon!');
    } catch (error) {
      console.error('Error applying to job:', error);
      alert('Failed to apply to job. Please try again.');
    } finally {
      setIsApplying(false);
    }
  };

  const getTimeAgo = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const isNewJob = (dateStr: string) => {
    const date = new Date(dateStr);
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    return date > sevenDaysAgo;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading job details...</p>
          </div>
        </main>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-12">
            <div className="text-red-600 mb-4">{error || 'Job not found'}</div>
            <button
              onClick={() => router.back()}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Go Back
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Job Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
                  {job.is_new && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                </div>
                <div className="mt-2">
                  <p className="text-lg text-gray-700">{job.company}</p>
                  <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                    <span className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {job.location}
                    </span>
                    <span>{job.salary}</span>
                    <span>{job.job_type}</span>
                    <span>{job.posted_ago}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isApplying ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          </div>

          {/* Job Details */}
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-lg font-medium text-gray-900 mb-4">Job Description</h2>
              <div className="prose max-w-none text-gray-700">
                <p>{job.description}</p>
              </div>
            </div>

            {job.requirements && (
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Requirements</h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{job.requirements}</p>
                </div>
              </div>
            )}

            {/* Additional Details */}
            <div className="border-t border-gray-200 pt-6">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Experience Level</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{job.experience_level}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Job Type</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">{job.job_type}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Match Score</dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.match_score}%</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Posted</dt>
                  <dd className="mt-1 text-sm text-gray-900">{job.posted_ago}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Apply Button (Bottom) */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex justify-between items-center">
              <button
                onClick={() => router.back()}
                className="text-sm text-gray-600 hover:text-gray-900 font-medium"
              >
                Back to Jobs
              </button>
              <button
                onClick={handleApply}
                disabled={isApplying}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {isApplying ? 'Applying...' : 'Apply Now'}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default function JobDetailsPage({ params }: JobDetailsPageProps) {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2 text-sm text-gray-500">Loading job details...</p>
            </div>
          </main>
        </div>
      }
    >
      <JobContent jobId={React.use(params).id} />
    </Suspense>
  );
}
