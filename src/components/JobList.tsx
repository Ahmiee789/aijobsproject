'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { jobsApi } from '@/lib/api';
import { Job, JobSearchFilters } from '@/types/database';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface JobListProps {
  filters?: JobSearchFilters;
}

const defaultFilters: JobSearchFilters = {
  searchTerm: '',
  location: '',
  type: 'all',
  experience_level: 'all',
  sort_by: 'relevance',
  page: 1,
  limit: 10
};

// Create a custom event name for job updates
const SAVED_JOBS_UPDATE = 'SAVED_JOBS_UPDATE';

// Update mock jobs to match the database schema
export const mockJobs: Job[] = [
  {
    id: 'mock_1',
    title: 'Senior Software Engineer',
    company: 'Tech Corp',
    location: 'San Francisco, CA',
    job_type: 'full-time',
    description: 'Looking for a senior software engineer with extensive experience in modern web technologies.',
    requirements: 'Minimum 5 years of experience with React, Node.js, and TypeScript.',
    salary: '$120,000 - $180,000',
    experience_level: 'senior',
    match_score: 95,
    posted_ago: '2 days ago',
    is_new: true
  },
  {
    id: 'mock_2',
    title: 'Frontend Developer',
    company: 'Web Solutions',
    location: 'Remote',
    job_type: 'remote',
    description: 'Frontend developer position with focus on React and modern JavaScript.',
    requirements: '3+ years of experience with modern JavaScript frameworks.',
    salary: '$90,000 - $130,000',
    experience_level: 'mid',
    match_score: 88,
    posted_ago: '1 week ago',
    is_new: false
  },
  {
    id: 'mock_3',
    title: 'Machine Learning Engineer',
    company: 'AI Innovations',
    location: 'New York, NY',
    job_type: 'full-time',
    description: 'ML engineer position focusing on developing cutting-edge AI solutions.',
    requirements: 'Masters or PhD in Computer Science, Machine Learning experience required.',
    salary: '$140,000 - $200,000',
    experience_level: 'senior',
    match_score: 92,
    posted_ago: '3 days ago',
    is_new: true
  },
  {
    id: 'mock_4',
    title: 'Data Scientist',
    company: 'DataFlow Systems',
    location: 'Austin, TX',
    job_type: 'full-time',
    description: 'Data scientist role working with big data and analytics.',
    salary: '$100,000 - $150,000',
    experience_level: 'mid',
    match_score: 85,
    posted_ago: '5 days ago',
    is_new: false
  },
  {
    id: 'mock_5',
    title: 'DevOps Engineer',
    company: 'CloudTech',
    location: 'Remote',
    job_type: 'remote',
    description: 'DevOps engineer position focusing on cloud infrastructure and automation.',
    salary: '$110,000 - $160,000',
    experience_level: 'senior',
    match_score: 87,
    posted_ago: '1 day ago',
    is_new: true
  },
  {
    id: 'mock_6',
    title: 'UI/UX Designer',
    company: 'Design Studio',
    location: 'Los Angeles, CA',
    job_type: 'full-time',
    description: 'UI/UX designer position creating beautiful and functional interfaces.',
    salary: '$85,000 - $120,000',
    experience_level: 'mid',
    match_score: 82,
    posted_ago: '4 days ago',
    is_new: false
  }
];

// Helper function to filter jobs based on search criteria
const filterJobs = (jobsList: Job[], filters: JobSearchFilters) => {
  return jobsList.filter(job => {
    const matchesSearch = !filters.searchTerm || 
      job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
      job.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

    const matchesLocation = !filters.location ||
      job.location.toLowerCase().includes(filters.location.toLowerCase());

    const matchesType = !filters.type || filters.type === 'all' ||
      job.job_type === filters.type;

    const matchesExperience = !filters.experience_level || filters.experience_level === 'all' ||
      job.experience_level === filters.experience_level;

    return matchesSearch && matchesLocation && matchesType && matchesExperience;
  });
};

// Helper function to format time ago
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

// Helper function to check if a job is new (less than 7 days old)
const isNewJob = (dateStr: string) => {
  const date = new Date(dateStr);
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  return date > sevenDaysAgo;
};

export default function JobList({ filters = defaultFilters }: JobListProps) {
  const router = useRouter();
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load jobs when component mounts or filters change
  useEffect(() => {
    loadJobs();
  }, [filters]);

  // Load saved jobs for logged-in users
  useEffect(() => {
    if (user) {
      loadSavedJobs();
    } else {
      setSavedJobs([]);
    }
  }, [user]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Loading jobs with filters:', filters);

      // Start with mock jobs
      let allJobs = [...mockJobs];

      // Get jobs from Supabase
      const { data: supabaseJobs, error } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Format Supabase jobs to match our Job interface
      const formattedSupabaseJobs: Job[] = (supabaseJobs || []).map(job => ({
        ...job,
        id: job.id.toString(),
        match_score: Math.floor(Math.random() * 20) + 80,
        posted_ago: job.created_at ? getTimeAgo(job.created_at) : 'Recently',
        is_new: job.created_at ? isNewJob(job.created_at) : false
      }));

      // Combine mock jobs with Supabase jobs
      allJobs = [...allJobs, ...formattedSupabaseJobs];

      // Apply filters
      allJobs = allJobs.filter(job => {
        const matchesSearch = !filters.searchTerm || 
          job.title.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          job.company.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
          job.description?.toLowerCase().includes(filters.searchTerm.toLowerCase());

        const matchesLocation = !filters.location ||
          job.location.toLowerCase().includes(filters.location.toLowerCase());

        const matchesType = !filters.type || filters.type === 'all' ||
          job.job_type === filters.type;

        const matchesExperience = !filters.experience_level || filters.experience_level === 'all' ||
          job.experience_level === filters.experience_level;

        return matchesSearch && matchesLocation && matchesType && matchesExperience;
      });

      console.log('Loaded jobs:', allJobs);
      setJobs(allJobs);
      setTotalJobs(allJobs.length);
      setLoading(false);
    } catch (error) {
      console.error('Error loading jobs:', error);
      setError('Failed to load jobs. Please try again.');
      setLoading(false);
    }
  };

  const loadSavedJobs = async () => {
    try {
      const { data: savedJobsData, error } = await supabase
        .from('saved_jobs')
        .select('job_id')
        .eq('user_id', user?.id);

      if (error) throw error;
      setSavedJobs(savedJobsData?.map(item => item.job_id) || []);
    } catch (error) {
      console.error('Error loading saved jobs:', error);
    }
  };

  const handleSaveJob = async (jobId: string) => {
    if (!user) {
      router.push('/login');
      return;
    }

    try {
      if (savedJobs.includes(jobId)) {
        // Unsave job
        const { error } = await supabase
          .from('saved_jobs')
          .delete()
          .eq('user_id', user.id)
          .eq('job_id', jobId);

        if (error) throw error;
        setSavedJobs(prev => prev.filter(id => id !== jobId));
      } else {
        // Save job
        const { error } = await supabase
          .from('saved_jobs')
          .insert([
            {
              user_id: user.id,
              job_id: jobId
            }
          ]);

        if (error) throw error;
        setSavedJobs(prev => [...prev, jobId]);
      }
    } catch (error) {
      console.error('Error saving/unsaving job:', error);
      alert('Failed to save/unsave job. Please try again.');
    }
  };

  const handleViewJob = (jobId: string) => {
    router.push(`/jobs/${jobId}`);
  };

  if (loading) {
  return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p className="mt-2 text-sm text-gray-500">Loading jobs...</p>
        </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">{error}</div>
        <button
          onClick={loadJobs}
          className="text-blue-600 hover:text-blue-700 font-medium"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
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
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No jobs found</h3>
        <p className="mt-1 text-sm text-gray-500">
          Try adjusting your filters to see more results.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <Link href={`/jobs/${job.id}`} key={job.id} className="block">
          <div className="bg-white rounded-lg p-6 border border-gray-200 hover:border-blue-500 transition-colors cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-medium text-gray-900">{job.title}</h3>
                  {job.is_new && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      New
                    </span>
                  )}
                </div>
                <p className="mt-1 text-gray-600">{job.company}</p>
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
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    handleSaveJob(job.id);
                  }}
                  className={`p-2 rounded-md transition-colors ${
                    savedJobs.includes(job.id)
                      ? 'text-blue-600 bg-blue-50 hover:bg-blue-100'
                      : 'text-gray-400 hover:text-blue-600 hover:bg-gray-50'
                  }`}
                >
                  <svg
                    className="h-5 w-5"
                    fill={savedJobs.includes(job.id) ? "currentColor" : "none"}
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
                </button>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
