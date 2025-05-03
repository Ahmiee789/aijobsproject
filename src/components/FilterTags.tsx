import React from 'react';

const FilterTags = () => {
  return (
    <div className="flex flex-wrap gap-2 py-4 px-4 md:px-8">
      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-gray-800">Remote · Engineering</span>
      </div>

      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-gray-800">All jobs · Engineering</span>
      </div>

      <div className="flex items-center bg-gray-100 rounded-full px-3 py-1">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        <span className="text-sm font-medium text-gray-800">Remote working · Hong Kong</span>
      </div>
    </div>
  );
};

export default FilterTags;
