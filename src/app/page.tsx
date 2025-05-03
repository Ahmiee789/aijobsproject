'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import JobSearch from '@/components/JobSearch';
import JobFilters from '@/components/JobFilters';
import JobList from '@/components/JobList';
import SavedJobs from '@/components/SavedJobs';
// FIXME: the type of filters is incorrect
import { JobSearchFilters } from '@/types/job';

export default function Home() {
  console.log('Home page rendered');

  const [filters, setFilters] = useState<JobSearchFilters>({
    searchTerm: '',
    location: '',
    type: 'all',
    experience_level: 'all',
    salaryRange: '',
    sort_by: 'relevance'
  });

  const handleFilterChange = (newFilters: Partial<JobSearchFilters>) => {
    console.log('Filters changed:', newFilters);
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  const handleSearch = (data: { searchTerm: string; location: string }) => {
    console.log('Search submitted:', data);
    setFilters(prev => ({
      ...prev,
      searchTerm: data.searchTerm,
      location: data.location
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Section */}
        <div className="mb-8">
          <JobSearch onSearch={handleSearch} />
        </div>

        {/* Filters and Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <JobFilters filters={filters} onChange={handleFilterChange} />
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              {/* Job List */}
              <JobList filters={filters} />

              {/* Saved Jobs Section */}
              <SavedJobs />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
