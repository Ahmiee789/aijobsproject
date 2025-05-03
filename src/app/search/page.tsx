'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';
import JobSearch from '@/components/JobSearch';
import JobFilters from '@/components/JobFilters';
import JobList from '@/components/JobList';
import { JobSearchFilters } from '@/types/job';

export default function SearchPage() {
  // FIXME: the type of filters is incorrect
  const [filters, setFilters] = useState<JobSearchFilters>({
    searchTerm: '',
    location: '',
    type: 'all',
    experience_level: 'all',
    salaryRange: '',
    sort_by: 'relevance'
  });

  const handleSearch = (data: { searchTerm: string; location: string }) => {
    setFilters(prev => ({
      ...prev,
      searchTerm: data.searchTerm,
      location: data.location
    }));
  };

  const handleFilterChange = (newFilters: Partial<JobSearchFilters>) => {
    setFilters(prev => ({
      ...prev,
      ...newFilters
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Find Your Next Job</h1>
          <p className="text-gray-600">Search through thousands of jobs from top companies and employers.</p>
        </div>

        <div className="mb-8">
          <JobSearch onSearch={handleSearch} />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 flex-shrink-0">
            <JobFilters filters={filters} onChange={handleFilterChange} />
          </aside>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Search Results</h2>
              <select
                value={filters.sort_by}
                onChange={(e) => handleFilterChange({ sort_by: e.target.value as JobSearchFilters['sort_by'] })}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="relevance">Relevance</option>
                <option value="recent">Most Recent</option>
                <option value="salary">Salary</option>
              </select>
            </div>

            <JobList filters={filters} />
          </div>
        </div>
      </main>
    </div>
  );
} 