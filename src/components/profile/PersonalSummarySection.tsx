'use client';

import React, { useState } from 'react';

interface PersonalSummarySectionProps {
  personalSummary: string;
  onSave: (summary: string) => void;
}

export default function PersonalSummarySection({ personalSummary, onSave }: PersonalSummarySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [summary, setSummary] = useState(personalSummary);

  const handleSave = () => {
    onSave(summary);
    setIsEditing(false);
  };

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Personal Summary</h3>
          <p className="mt-1 text-sm text-gray-500">
            Write a brief summary about yourself, your experience, and what you're looking for.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {isEditing ? (
            <div className="space-y-4">
              <textarea
                rows={6}
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Write a brief summary about yourself..."
              />
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setSummary(personalSummary);
                    setIsEditing(false);
                  }}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-md p-4">
              <div className="flex justify-between items-start">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {personalSummary || 'Add a personal summary to tell employers about yourself.'}
                </p>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="ml-4 inline-flex items-center text-sm text-blue-600 hover:text-blue-500"
                >
                  <svg
                    className="h-4 w-4 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
