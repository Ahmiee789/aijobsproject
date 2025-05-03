import React from 'react';

const SavedSection = () => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 mb-4">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Saved searches</h2>
      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <p className="text-gray-700">
          Use the Save search button below the search results to save your search and receive every new job.
        </p>
      </div>

      <h2 className="text-lg font-semibold mb-4 mt-6 text-gray-800">Saved jobs</h2>
      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-700">
          Use the Save button on each job listing to save it for later. You can then access them on all your devices.
        </p>
      </div>
    </div>
  );
};

export default SavedSection;
