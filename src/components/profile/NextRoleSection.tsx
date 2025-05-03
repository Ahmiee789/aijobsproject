'use client';

import React, { useState } from 'react';

interface NextRoleData {
  availability: string;
  preferredWorkTypes: string;
  preferredLocations: string[];
  rightToWork: string;
  salaryExpectation: {
    currency: string;
    amount: string;
  };
  classifications: string[];
}

interface NextRoleSectionProps {
  data: NextRoleData;
  onSave: (data: NextRoleData) => void;
}

export default function NextRoleSection({
  data,
  onSave
}: NextRoleSectionProps) {
  const [formData, setFormData] = useState<NextRoleData>(data);
  const [tempLocation, setTempLocation] = useState('');
  const [, setTempClassification] = useState('');

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const handleChange = (field: keyof NextRoleData, value: any) => {
    setFormData({
      ...formData,
      [field]: value
    });
  };

  const handleSalaryChange = (field: keyof typeof formData.salaryExpectation, value: string) => {
    setFormData({
      ...formData,
      salaryExpectation: {
        ...formData.salaryExpectation,
        [field]: value
      }
    });
  };

  const handleAddLocation = () => {
    if (tempLocation.trim() !== '') {
      const newLocations = [...formData.preferredLocations, tempLocation.trim()];
      setFormData({
        ...formData,
        preferredLocations: newLocations
      });
      setTempLocation('');
    }
  };

  const handleDeleteLocation = (index: number) => {
    const newLocations = [...formData.preferredLocations];
    newLocations.splice(index, 1);
    setFormData({
      ...formData,
      preferredLocations: newLocations
    });
  };

  const handleDeleteClassification = (index: number) => {
    const newClassifications = [...formData.classifications];
    newClassifications.splice(index, 1);
    setFormData({
      ...formData,
      classifications: newClassifications
    });
  };

  const handleSave = () => {
    onSave(formData);
  };

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">About your next role</h3>
          <p className="mt-1 text-sm text-gray-500">
            Help employers understand what you&aposre looking for in your next position.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {/* Availability */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Availability</h4>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.availability}
                onChange={(e) => handleChange('availability', e.target.value)}
              >
                <option value="Not specified">Not specified</option>
                <option value="Immediately">Immediately</option>
                <option value="1 week">1 week</option>
                <option value="2 weeks">2 weeks</option>
                <option value="1 month">1 month</option>
                <option value="More than 1 month">More than 1 month</option>
              </select>
            </div>

            {/* Preferred work types */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Preferred work types</h4>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.preferredWorkTypes}
                onChange={(e) => handleChange('preferredWorkTypes', e.target.value)}
              >
                <option value="Not specified">Not specified</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Temporary">Temporary</option>
                <option value="Internship">Internship</option>
              </select>
            </div>

            {/* Preferred locations */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Preferred locations</h4>
              <div className="mt-1 flex items-center">
                <input
                  type="text"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Add a location"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddLocation())}
                />
                <button
                  type="button"
                  className="ml-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={handleAddLocation}
                >
                  Add
                </button>
              </div>
              {formData.preferredLocations.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.preferredLocations.map((location, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-gray-100 text-gray-800"
                    >
                      {location}
                      <button
                        type="button"
                        className="ml-1.5 inline-flex text-gray-500 hover:text-gray-600"
                        onClick={() => handleDeleteLocation(index)}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Right to work */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Right to work</h4>
              <select
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                value={formData.rightToWork}
                onChange={(e) => handleChange('rightToWork', e.target.value)}
              >
                <option value="Not specified">Not specified</option>
                <option value="Hong Kong SAR">Hong Kong SAR</option>
                <option value="China">China</option>
                <option value="United States">United States</option>
                <option value="United Kingdom">United Kingdom</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Salary expectation */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Salary expectation</h4>
              <div className="mt-1 flex items-center">
                <select
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-24 sm:text-sm border-gray-300 rounded-l-md"
                  value={formData.salaryExpectation.currency}
                  onChange={(e) => handleSalaryChange('currency', e.target.value)}
                >
                  <option value="HKD">HKD</option>
                  <option value="USD">USD</option>
                  <option value="CNY">CNY</option>
                </select>
                <input
                  type="text"
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-r-md"
                  placeholder="Annual salary"
                  value={formData.salaryExpectation.amount}
                  onChange={(e) => handleSalaryChange('amount', e.target.value)}
                />
              </div>
            </div>

            {/* Classification of interest */}
            <div>
              <h4 className="text-sm font-medium text-gray-900">Classification of interest</h4>
              <div className="mt-2">
                <button
                  type="button"
                  className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  onClick={() => setTempClassification('Information & Communication Technology')}
                >
                  Add Classification
                </button>
              </div>
              {formData.classifications.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {formData.classifications.map((classification, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
                    >
                      {classification}
                      <button
                        type="button"
                        className="ml-1 inline-flex text-indigo-500 hover:text-indigo-600"
                        onClick={() => handleDeleteClassification(index)}
                      >
                        <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handleSave}
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
