'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import PostJobForm from '@/components/PostJobForm';
import ApplicationsList from '@/components/ApplicationsList';
import CompanyProfile from '@/components/CompanyProfile';
import JobDescriptionManager from '@/components/JobDescriptionManager';

const OPENROUTER_API_KEY = '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';

export default function EmployerPortal() {
  const { user } = useAuth();
  const router = useRouter();
  const [showPostJobForm, setShowPostJobForm] = useState(false);
  const [showApplications, setShowApplications] = useState(false);
  const [showCompanyProfile, setShowCompanyProfile] = useState(false);
  const [showJobDescriptionManager, setShowJobDescriptionManager] = useState(false);
  const [showDescriptionGenerator, setShowDescriptionGenerator] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [jobFormData, setJobFormData] = useState({
    title: '',
    company: 'TechCorp',
    location: 'San Francisco, CA',
    type: 'full-time',
    description: '',
    requirements: '',
    salary: '',
    experience: 'entry'
  });

  // Check user role and redirect if necessary
  useEffect(() => {
    console.log('Checking user role:', user?.role);
    if (!user) {
      console.log('No user found, redirecting to login');
      router.push('/login');
    } else if (user.role !== 'EMPLOYER') {
      console.log('User is not an employer, redirecting to home');
      router.push('/');
    }
  }, [user, router]);

  // Show loading state while checking role
  if (!user || user.role !== 'EMPLOYER') {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  const generateJobDescription = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://github.com/yourusername/ai-jobs',
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-opus-20240229',
          messages: [
            {
              role: 'system',
              content: 'You are a professional HR expert who creates detailed job descriptions. Create a comprehensive job description based on the user\'s prompt.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.7,
          max_tokens: 1000
        })
      });

      const data = await response.json();
      if (data.choices && data.choices[0]) {
        setGeneratedDescription(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error generating job description:', error);
      alert('Failed to generate job description. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseDescription = () => {
    // Extract job title from the generated description
    const titleMatch = generatedDescription.match(/^([^:]+):/);
    const title = titleMatch ? titleMatch[1].trim() : '';
    
    // Update job form data with generated description
    setJobFormData(prev => ({
      ...prev,
      title: title,
      description: generatedDescription,
      requirements: generatedDescription // You might want to parse this differently
    }));
    
    // Close description generator and open job form
    setShowDescriptionGenerator(false);
    setShowPostJobForm(true);
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Employer Dashboard</h1>
          <p className="mt-1 text-sm text-gray-600">Manage your job postings and candidates</p>
        </div>

        {/* Main Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column - Company Profile and Stats */}
          <div className="lg:col-span-4 space-y-6">
            {/* Company Profile Card */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                  <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-900">TechCorp</h2>
                  <p className="text-sm text-gray-500">Technology • 51-200 employees</p>
                  <p className="mt-1 text-sm text-gray-600">
                    Leading technology company specializing in AI solutions.
                  </p>
                  <div className="mt-2 flex items-center space-x-3 text-sm text-gray-500">
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      San Francisco, CA
                    </div>
                    <div className="flex items-center">
                      <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                      </svg>
                      www.techcorp.com
                    </div>
                  </div>
                  <button
                    onClick={() => setShowCompanyProfile(true)}
                    className="mt-3 text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center"
                  >
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Overview */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-medium text-gray-900 mb-4">Overview</h3>
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Active Jobs</h4>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">12</p>
                  <p className="text-xs text-gray-500">+2 from last month</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Total Applications</h4>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">156</p>
                  <p className="text-xs text-gray-500">+23 this week</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Interview Rate</h4>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">32%</p>
                  <p className="text-xs text-gray-500">+5% from last month</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity and Quick Actions */}
          <div className="lg:col-span-8 space-y-6">
            {/* Quick Actions */}
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <h3 className="text-base font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <button
                  onClick={() => setShowPostJobForm(true)}
                  className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Post New Job
                </button>
                <button
                  onClick={() => router.push('/employer/jobs')}
                  className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Posted Jobs
                </button>
                <button
                  onClick={() => setShowDescriptionGenerator(true)}
                  className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Generate Description
                </button>
                <button
                  onClick={() => setShowApplications(true)}
                  className="flex items-center justify-center px-3 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Applications
                </button>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="px-4 py-3 border-b border-gray-200">
                <h2 className="text-base font-medium text-gray-900">Recent Activity</h2>
              </div>
              <div className="p-4">
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                          <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">
                          New application received for <span className="font-medium">Senior AI Engineer</span>
                        </p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                      <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                        View
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modals */}
        {showPostJobForm && (
          <PostJobForm 
            onClose={() => setShowPostJobForm(false)} 
            initialData={jobFormData}
          />
        )}

        {showApplications && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full">
              <div className="flex justify-between items-center p-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900">Applications</h2>
                <button
                  onClick={() => setShowApplications(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <ApplicationsList />
              </div>
            </div>
          </div>
        )}

        {showCompanyProfile && (
          <CompanyProfile onClose={() => setShowCompanyProfile(false)} />
        )}

        {showJobDescriptionManager && (
          <JobDescriptionManager onClose={() => setShowJobDescriptionManager(false)} />
        )}

        {/* Job Description Generator Modal */}
        {showDescriptionGenerator && (
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-stretch justify-center z-50">
            <div className="bg-white w-full max-w-6xl my-4 mx-4 rounded-lg flex flex-col">
              <div className="flex justify-between items-center p-6 border-b border-gray-200">
                <h2 className="text-2xl font-semibold text-gray-900">Generate Job Description</h2>
                <button
                  onClick={() => setShowDescriptionGenerator(false)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="flex-1 p-6 flex gap-6 overflow-hidden">
                {/* Input Section */}
                <div className="w-1/2 flex flex-col">
                  <label className="block text-lg font-medium text-gray-700 mb-2">
                    Job Description Prompt
                  </label>
                  <div className="flex-1 flex flex-col">
                    <textarea
                      rows={4}
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-base resize-none"
                      placeholder="Describe the job role, requirements, and responsibilities in detail. For example: 'Looking for a Senior Frontend Developer with 5+ years of experience in React and TypeScript. The role involves building responsive web applications and working with a team of designers and backend developers.'"
                    />
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={generateJobDescription}
                      disabled={isGenerating || !prompt}
                      className="w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isGenerating ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </>
                      ) : (
                        'Generate Description'
                      )}
                    </button>
                  </div>
                </div>

                {/* Output Section */}
                <div className="w-1/2 flex flex-col">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Generated Description</h3>
                  <div className="flex-1 bg-gray-50 rounded-lg p-4 overflow-y-auto">
                    {generatedDescription ? (
                      <div className="prose prose-sm max-w-none">
                        <div className="whitespace-pre-line text-gray-600">
                          {generatedDescription}
                        </div>
                      </div>
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 text-center">
                        <p>Generated content will appear here</p>
                      </div>
                    )}
                  </div>
                  {generatedDescription && (
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(generatedDescription);
                          alert('Description copied to clipboard!');
                        }}
                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                        </svg>
                        Copy
                      </button>
                      <button
                        onClick={handleUseDescription}
                        className="inline-flex items-center px-6 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                      >
                        Use in Job Post
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 