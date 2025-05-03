import React from 'react';

const SearchBar = () => {
  return (
    <div className="w-full bg-blue-900 py-6 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col">
            <label htmlFor="what" className="text-white mb-2 font-medium">What</label>
            <input
              type="text"
              id="what"
              placeholder="Enter Keywords"
              className="p-3 rounded border border-gray-300 w-full md:w-64 lg:w-80"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="classification" className="text-white mb-2 font-medium">Where</label>
            <div className="relative">
              <input
                type="text"
                id="classification"
                placeholder="Any Classification"
                className="p-3 rounded border border-gray-300 w-full md:w-64 lg:w-80 pr-10"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          <div className="flex flex-col">
            <label htmlFor="location" className="text-white mb-2 font-medium">Where</label>
            <input
              type="text"
              id="location"
              placeholder="Enter suburb, city, or region"
              className="p-3 rounded border border-gray-300 w-full md:w-64 lg:w-80"
            />
          </div>

          <div className="flex items-end">
            <button className="bg-pink-600 text-white font-bold py-3 px-6 rounded">
              SEEK
            </button>
          </div>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="text-white font-medium flex items-center">
            More options
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-white" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
