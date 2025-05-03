'use client';

import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface WorkExperience {
  company: string;
  title: string;
  dates: string;
  description: string;
}

interface CareerHistorySectionProps {
  workExperience: WorkExperience[];
  onSave: (experience: WorkExperience[]) => void;
}

export default function CareerHistorySection({ workExperience, onSave }: CareerHistorySectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [experience, setExperience] = useState<WorkExperience[]>(workExperience);

  const handleSave = () => {
    onSave(experience);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setExperience([
      ...experience,
      {
        company: '',
        title: '',
        dates: '',
        description: ''
      }
    ]);
  };

  const handleRemove = (index: number) => {
    setExperience(experience.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof WorkExperience, value: string) => {
    const newExperience = [...experience];
    newExperience[index] = {
      ...newExperience[index],
      [field]: value
    };
    setExperience(newExperience);
  };

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Career History</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your work experience in chronological order. Drag and drop to reorder.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {isEditing ? (
            <div className="space-y-4">
              <Droppable droppableId="career-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {experience.map((exp, index) => (
                      <Draggable key={index} draggableId={`experience-${index}`} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="mb-4 p-4 bg-white border border-gray-200 rounded-md shadow-sm"
                          >
                            <div className="space-y-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Job Title
                                </label>
                                <input
                                  type="text"
                                  value={exp.title}
                                  onChange={(e) => handleChange(index, 'title', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Company
                                </label>
                                <input
                                  type="text"
                                  value={exp.company}
                                  onChange={(e) => handleChange(index, 'company', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Dates
                                </label>
                                <input
                                  type="text"
                                  value={exp.dates}
                                  onChange={(e) => handleChange(index, 'dates', e.target.value)}
                                  placeholder="e.g., Jan 2020 - Present"
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Description
                                </label>
                                <textarea
                                  value={exp.description}
                                  onChange={(e) => handleChange(index, 'description', e.target.value)}
                                  rows={3}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                />
                              </div>
                              <button
                                type="button"
                                onClick={() => handleRemove(index)}
                                className="text-red-600 hover:text-red-700 text-sm font-medium"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>

              <button
                type="button"
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add Experience
              </button>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setExperience(workExperience);
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
              {experience.length > 0 ? (
                experience.map((exp, index) => (
                  <div key={index} className="bg-white shadow-sm rounded-md p-4">
                    <h4 className="text-lg font-medium text-gray-900">{exp.title}</h4>
                    <p className="text-gray-600">{exp.company}</p>
                    <p className="text-sm text-gray-500">{exp.dates}</p>
                    <p className="mt-2 text-gray-700 whitespace-pre-wrap">{exp.description}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No work experience added yet.</p>
              )}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {experience.length > 0 ? 'Edit' : 'Add'} Experience
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
