'use client';

import React, { useState } from 'react';

interface LanguagesSectionProps {
  languages: string[];
  onSave: (languages: string[]) => void;
}

export default function LanguagesSection({ languages, onSave }: LanguagesSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [languagesList, setLanguagesList] = useState<string[]>(languages);
  const [newLanguage, setNewLanguage] = useState('');

  const handleSave = () => {
    onSave(languagesList);
    setIsEditing(false);
  };

  const handleAdd = () => {
    if (newLanguage.trim()) {
      setLanguagesList([...languagesList, newLanguage.trim()]);
      setNewLanguage('');
    }
  };

  const handleRemove = (index: number) => {
    setLanguagesList(languagesList.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Languages</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add the languages you can communicate in.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="language" className="block text-sm font-medium text-gray-700">
                  Add Language
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="language"
                    value={newLanguage}
                    onChange={(e) => setNewLanguage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter a language and press Enter"
                  />
                  <button
                    type="button"
                    onClick={handleAdd}
                    className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {languagesList.map((language, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                  >
                    {language}
                    <button
                      type="button"
                      onClick={() => handleRemove(index)}
                      className="ml-2 inline-flex items-center p-0.5 rounded-full text-purple-800 hover:bg-purple-200 focus:outline-none"
                    >
                      <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setLanguagesList(languages);
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
            <div className="space-y-4">
              {languagesList.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {languagesList.map((language, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No languages added yet.</p>
              )}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {languagesList.length > 0 ? 'Edit' : 'Add'} Languages
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
