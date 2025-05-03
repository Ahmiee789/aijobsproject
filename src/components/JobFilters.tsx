'use client';

import React from 'react';
import { JobSearchFilters, JobType, ExperienceLevel } from '@/types/job';

interface JobFiltersProps {
  filters: JobSearchFilters;
  onChange: (newFilters: Partial<JobSearchFilters>) => void;
}

export default function JobFilters({ filters, onChange }: JobFiltersProps) {
  const handleFilterChange = (key: keyof JobSearchFilters, value: any) => {
    onChange({ [key]: value });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200" suppressHydrationWarning>
      <h3 className="text-lg font-medium text-gray-900 mb-4">Filters</h3>
      <div className="space-y-6" suppressHydrationWarning>
        {/* Job Type Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Job Type</h4>
          <div className="space-y-2">
            {(['all', 'full-time', 'part-time', 'contract', 'remote'] as (JobType | 'all')[]).map((type) => (
              <label key={type} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="jobType"
                  value={type}
                  checked={filters.type === type}
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  suppressHydrationWarning
                />
                <span className="text-sm text-gray-700 capitalize">
                  {type === 'all' ? 'All Types' : type.replace('-', ' ')}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Experience Level Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Experience Level</h4>
          <div className="space-y-2">
            {(['all', 'entry', 'mid', 'senior', 'executive'] as (ExperienceLevel | 'all')[]).map((level) => (
              <label key={level} className="flex items-center space-x-2">
                <input
                  type="radio"
                  name="experienceLevel"
                  value={level}
                  checked={filters.experience_level === level}
                  onChange={(e) => handleFilterChange('experience_level', e.target.value)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                  suppressHydrationWarning
                />
                <span className="text-sm text-gray-700 capitalize">
                  {level === 'all' ? 'All Levels' : level}
                </span>
              </label>
            ))}
          </div>
        </div>

        {/* Salary Range Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Salary Range</h4>
          <select
            value={filters.salaryRange}
            onChange={(e) => handleFilterChange('salaryRange', e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            suppressHydrationWarning
          >
            <option value="">Any Salary</option>
            <option value="0-50000">Under $50,000</option>
            <option value="50000-100000">$50,000 - $100,000</option>
            <option value="100000-150000">$100,000 - $150,000</option>
            <option value="150000-200000">$150,000 - $200,000</option>
            <option value="200000+">$200,000+</option>
          </select>
        </div>

        {/* Sort By Filter */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Sort By</h4>
          <select
            value={filters.sort_by}
            onChange={(e) => handleFilterChange('sort_by', e.target.value as JobSearchFilters['sort_by'])}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            suppressHydrationWarning
          >
            <option value="relevance">Relevance</option>
            <option value="recent">Most Recent</option>
            <option value="salary">Salary</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <button
          onClick={() => {
            onChange({
              type: 'all',
              experience_level: 'all',
              salaryRange: '',
              sort_by: 'relevance'
            });
          }}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          suppressHydrationWarning
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
} 