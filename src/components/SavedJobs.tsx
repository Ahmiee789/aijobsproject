'use client';

import React, { useState, useEffect } from 'react';
import { JobDetail } from '@/types/job';
import { mockJobs } from '@/components/JobList';

// Create a custom event name for job updates
const SAVED_JOBS_UPDATE = 'SAVED_JOBS_UPDATE';

export default function SavedJobs() {
  // Initialize with empty array to match server-side rendering
  const [savedJobs, setSavedJobs] = useState<JobDetail[]>([]);

  const loadSavedJobs = () => {
    const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const jobs = mockJobs.filter(job => savedJobIds.includes(job.id));

    // FIXME: get saved jobs from supabase
    // setSavedJobs(jobs);
  };

  useEffect(() => {
    // Initial load from localStorage
    if (typeof window !== 'undefined') {
      loadSavedJobs();
    }

    // Listen for both storage events and our custom event
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'savedJobs') {
        loadSavedJobs();
      }
    };

    const handleCustomEvent = () => loadSavedJobs();

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener(SAVED_JOBS_UPDATE, handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener(SAVED_JOBS_UPDATE, handleCustomEvent);
    };
  }, []);

  const handleRemoveJob = (jobId: number) => {
    // Update localStorage first
    const savedJobIds = JSON.parse(localStorage.getItem('savedJobs') || '[]');
    const updatedIds = savedJobIds.filter((id: number) => id !== jobId);
    localStorage.setItem('savedJobs', JSON.stringify(updatedIds));

    // Then update state
    setSavedJobs(prev => prev.filter(job => job.id !== jobId));

    // Notify other components
    window.dispatchEvent(new Event(SAVED_JOBS_UPDATE));
  };

  return (
    <div className="bg-gradient-to-b from-white to-indigo-50 shadow-sm rounded-lg p-6 border border-indigo-100">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Saved Jobs</h3>

      {savedJobs.length === 0 ? (
        <div className="text-center py-8">
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
            Jobs you save will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {savedJobs.map((job) => (
            <div
              key={job.id}
              className="flex items-start space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-500 transition-colors"
              suppressHydrationWarning
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-gray-400">
                    {job.company.charAt(0)}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">
                  {job.title}
                </h4>
                <p className="text-sm text-gray-500">{job.company}</p>
                <p className="text-sm text-gray-500">{job.location}</p>
                <p className="text-sm text-gray-500">{job.salary}</p>
                <p className="text-xs text-gray-400 mt-1">{job.posted_ago}</p>
              </div>
              <button
                onClick={() => handleRemoveJob(job.id)}
                className="flex-shrink-0 text-gray-400 hover:text-red-500"
                suppressHydrationWarning
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 