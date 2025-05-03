'use client';

import React, { useState } from 'react';
import { Draggable, Droppable } from '@hello-pangea/dnd';

interface Education {
  school: string;
  degree: string;
  dates: string;
}

interface EducationSectionProps {
  education: Education[];
  onSave: (education: Education[]) => void;
}

export default function EducationSection({ education, onSave }: EducationSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [educationList, setEducationList] = useState<Education[]>(education);

  const handleSave = () => {
    onSave(educationList);
    setIsEditing(false);
  };

  const handleAdd = () => {
    setEducationList([
      ...educationList,
      {
        school: '',
        degree: '',
        dates: ''
      }
    ]);
  };

  const handleRemove = (index: number) => {
    setEducationList(educationList.filter((_, i) => i !== index));
  };

  const handleChange = (index: number, field: keyof Education, value: string) => {
    const newEducation = [...educationList];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setEducationList(newEducation);
  };

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Education</h3>
          <p className="mt-1 text-sm text-gray-500">
            Add your educational background in chronological order. Drag and drop to reorder.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          {isEditing ? (
            <div className="space-y-4">
              <Droppable droppableId="education-list">
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {educationList.map((edu, index) => (
                      <Draggable key={index} draggableId={`education-${index}`} index={index}>
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
                                  Degree
                                </label>
                                <input
                                  type="text"
                                  value={edu.degree}
                                  onChange={(e) => handleChange(index, 'degree', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="e.g., Bachelor of Science in Computer Science"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  School
                                </label>
                                <input
                                  type="text"
                                  value={edu.school}
                                  onChange={(e) => handleChange(index, 'school', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="e.g., University of Technology"
                                />
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Dates
                                </label>
                                <input
                                  type="text"
                                  value={edu.dates}
                                  onChange={(e) => handleChange(index, 'dates', e.target.value)}
                                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                  placeholder="e.g., 2016 - 2020"
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
                Add Education
              </button>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => {
                    setEducationList(education);
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
              {educationList.length > 0 ? (
                educationList.map((edu, index) => (
                  <div key={index} className="bg-white shadow-sm rounded-md p-4">
                    <h4 className="text-lg font-medium text-gray-900">{edu.degree}</h4>
                    <p className="text-gray-600">{edu.school}</p>
                    <p className="text-sm text-gray-500">{edu.dates}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No education history added yet.</p>
              )}
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {educationList.length > 0 ? 'Edit' : 'Add'} Education
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
