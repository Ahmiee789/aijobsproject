'use client';

import React, { useState } from 'react';

interface Resume {
  id: string;
  fileUrl: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  parsedData: any;
  createdAt: string;
}

interface ResumeUploadSectionProps {
  resumes: Resume[];
  selectedResume: Resume | null;
  setSelectedResume: (resume: Resume) => void;
  fetchResumes: () => Promise<void>;
  applyResumeToProfile: () => void;
  isApplyingResume: boolean;
  applySuccess: boolean;
}

export default function ResumeUploadSection({
  resumes,
  selectedResume,
  setSelectedResume,
  fetchResumes,
  applyResumeToProfile,
  isApplyingResume,
  applySuccess
}: ResumeUploadSectionProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isProcessed, setIsProcessed] = useState(false);

  const fetchParsedData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      // 使用固定的文件名 'resume.pdf' 而不是resumeId
      const response = await fetch(`/api/resumes/upload?resumeId=resume.pdf`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        // Update the selected resume with the parsed data
        const updatedResume = {
          ...selectedResume,
          id: selectedResume?.id ?? '',
          fileUrl: selectedResume?.fileUrl ?? '',
          createdAt: selectedResume?.createdAt ?? '',
          parsedData: data.parsedData
        };
        console.log('Parsed resume data:', updatedResume.parsedData);
        setSelectedResume(updatedResume);
        setIsProcessed(true);
      } else {
        console.error('Error fetching parsed data:', response.status);
        setError('Failed to fetch parsed data');
      }
    } catch (error) {
      console.error('Error fetching parsed data:', error);
      setError('Failed to fetch parsed data');
    }
  };

  // 处理简历上传
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];

    // 检查文件类型
    if (file.type !== 'application/pdf') {
      setError('Only PDF files are supported');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('resume', file);

      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/resumes/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        await fetchResumes();
        setUploadProgress(100);
        if (data.resume && data.resume.id) {
          fetchParsedData();
        }
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      setError('An error occurred while uploading your resume');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
      <div className="md:grid md:grid-cols-3 md:gap-6">
        <div className="md:col-span-1">
          <h3 className="text-lg font-medium leading-6 text-gray-900">Resume</h3>
          <p className="mt-1 text-sm text-gray-500">
            Upload your resume to help employers find you and to automatically fill your profile information.
          </p>
        </div>
        <div className="mt-5 md:mt-0 md:col-span-2">
          <div className="space-y-6">
            {/* File Upload */}
            <div className="bg-white p-6 border border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex justify-center text-sm text-gray-600">
                  <label
                    htmlFor="resume-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                  >
                    <span>Upload a PDF file</span>
                    <input
                      id="resume-upload"
                      name="resume-upload"
                      type="file"
                      className="sr-only"
                      accept="application/pdf"
                      onChange={handleResumeUpload}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF up to 10MB</p>
              </div>
              {isUploading && (
                <div className="mt-4">
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">
                          Uploading
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-blue-600">
                          {uploadProgress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
                      <div
                        style={{ width: `${uploadProgress}%` }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              {error && (
                <div className="mt-2 text-sm text-red-600">{error}</div>
              )}
            </div>

            {/* Uploaded Resumes */}
            {resumes.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-900">Your Resumes</h4>
                <ul className="mt-2 border border-gray-200 rounded-md divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <li
                      key={resume.id}
                      className={`pl-3 pr-4 py-3 flex items-center justify-between text-sm ${selectedResume?.id === resume.id ? 'bg-blue-50' : ''}`}
                    >
                      <div className="w-0 flex-1 flex items-center">
                        <svg
                          className="flex-shrink-0 h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="ml-2 flex-1 w-0 truncate text-gray-500">
                          {resume.createdAt && !isNaN(new Date(resume.createdAt).getTime())
                            ? `Resume ${new Date(resume.createdAt).toLocaleDateString()}`
                            : `Resume ${new Date().toLocaleDateString()}`}
                        </span>
                      </div>
                      <div className="ml-4 flex-shrink-0">
                        <a
                          href={resume.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-blue-600 hover:text-blue-500"
                        >
                          View
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>

                {/* 自动选择唯一的简历并获取解析数据 */}
                {resumes.length > 0 && !isProcessed && (
                  <div className="hidden">
                    {/* 这是一个隐藏的元素，用于在组件挂载后自动触发获取解析数据 */}
                    {(() => {
                      // 如果有简历但还没有处理，自动选择并获取数据
                      if (!selectedResume) {
                        setSelectedResume(resumes[0]);
                      }
                      if (!isProcessed) {
                        fetchParsedData();
                      }
                      return null;
                    })()}
                  </div>
                )}

                {/* 应用简历数据到个人资料按钮 */}
                {selectedResume && isProcessed && (
                  <div className="mt-4">
                    <button
                      type="button"
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                      onClick={applyResumeToProfile}
                      disabled={isApplyingResume}
                    >
                      {isApplyingResume ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </>
                      ) : (
                        'Apply Resume Data to Profile'
                      )}
                    </button>

                    {applySuccess && (
                      <div className="mt-2 text-sm text-green-600">
                        Resume data successfully applied to your profile!
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
