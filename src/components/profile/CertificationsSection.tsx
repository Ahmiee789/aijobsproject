'use client';

import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface CertificationsSectionProps {
  certifications: string[];
  onSave: (certifications: string[]) => void;
}

export default function CertificationsSection({ certifications, onSave }: CertificationsSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [certificationsList, setCertificationsList] = useState<string[]>(certifications);
  const [newCertification, setNewCertification] = useState('');

  const handleSave = () => {
    onSave(certificationsList);
    setIsEditing(false);
  };

  const handleAdd = () => {
    if (newCertification.trim()) {
      setCertificationsList([...certificationsList, newCertification.trim()]);
      setNewCertification('');
    }
  };

  const handleRemove = (index: number) => {
    setCertificationsList(certificationsList.filter((_, i) => i !== index));
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
          <h3 className="text-lg font-medium leading-6 text-gray-900">Certifications</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your professional certifications and credentials. Drag and drop to reorder.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {isEditing ? (
            <div className="space-y-4">
              <div>
                <label htmlFor="certification" className="block text-sm font-medium text-gray-700">
                  Add Certification
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    type="text"
                    id="certification"
                    value={newCertification}
                    onChange={(e) => setNewCertification(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter a certification and press Enter"
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

              <Droppable droppableId="certifications-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {certificationsList.map((cert, index) => (
                      <Draggable key={index} draggableId={`certification-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-2 p-3 bg-white border border-gray-200 rounded-md shadow-sm flex items-center justify-between"
                          >
                            <span className="text-gray-900">{cert}</span>
                            <button
                              type="button"
                              onClick={() => handleRemove(index)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                              </svg>
                            </button>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setCertificationsList(certifications);
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
              {certificationsList.length > 0 ? (
                <div className="space-y-2">
                  {certificationsList.map((cert, index) => (
                    <div
                      key={index}
                      className="p-3 bg-white border border-gray-200 rounded-md shadow-sm"
                    >
                      <span className="text-gray-900">{cert}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 italic">No certifications added yet.</p>
              )}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {certificationsList.length > 0 ? 'Edit' : 'Add'} Certifications
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
