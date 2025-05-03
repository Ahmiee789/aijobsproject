'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { jobsApi } from '@/lib/api';
import { Job } from '@/types/database';

export default function EmployerJobsPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  // Load jobs when component mounts
  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'EMPLOYER') {
      router.push('/');
    } else {
      loadJobs();
    }
  }, [user, router]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading employer jobs...');
      const employerJobs = await jobsApi.getEmployerJobs();
      console.log('Loaded jobs:', employerJobs);
      setJobs(employerJobs);
    } catch (error: any) {
      console.error('Error loading jobs:', error);
      setError(error.message || 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    if (selectedStatus === 'all') return true;
    if (selectedStatus === 'active') return !job.is_new;
    if (selectedStatus === 'new') return job.is_new;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="md:flex md:items-center md:justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Posted Jobs</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your job postings and view applications
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => router.push('/employer')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              Post New Job
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Jobs</option>
                <option value="active">Active</option>
                <option value="new">New</option>
              </select>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading jobs...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
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

        {/* Jobs List */}
        {!loading && !error && (
          <div className="bg-white shadow-sm rounded-lg overflow-hidden">
            {filteredJobs.length === 0 ? (
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
                    d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new job posting.</p>
                <div className="mt-6">
                  <button
                    onClick={() => router.push('/employer')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Post New Job
                  </button>
                </div>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredJobs.map((job) => (
                  <div key={job.id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h2 className="text-lg font-medium text-gray-900">{job.title}</h2>
                          {job.is_new && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              New
                            </span>
                          )}
                        </div>
                        <div className="mt-1 text-sm text-gray-500">
                          <p>{job.location}</p>
                          <p>{job.salary}</p>
                          <p>Posted {job.posted_ago || 'Recently'}</p>
                        </div>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {Math.floor(Math.random() * 50)} applications
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <button
                          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                          onClick={() => router.push(`/employer/jobs/${job.id}/applications`)}
                        >
                          View Applications
                        </button>
                        <button
                          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                          onClick={() => router.push(`/employer/jobs/${job.id}/edit`)}
                        >
                          Edit Job
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 