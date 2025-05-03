'use client';

import React, { useState, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { generateSummaryFromResumeData } from '@/utils/resumeUtils';
import { useRouter } from 'next/navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import ResumeUploadSection from '@/components/profile/ResumeUploadSection';
import PersonalSummarySection from '@/components/profile/PersonalSummarySection';
import CareerHistorySection from '@/components/profile/CareerHistorySection';
import EducationSection from '@/components/profile/EducationSection';
import SkillsSection from '@/components/profile/SkillsSection';
import LanguagesSection from '@/components/profile/LanguagesSection';
import CertificationsSection from '@/components/profile/CertificationsSection';
import NextRoleSection from '@/components/profile/NextRoleSection';

interface Resume {
  id: string;
  fileUrl: string;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  parsedData: any;
  createdAt: string;
}

// Profile form data interface
interface ProfileFormData {
  personalSummary: string;
  workExperience: Array<{
    company: string;
    title: string;
    dates: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    dates: string;
  }>;
  skills: string[];
  languages: string[];
  certifications: string[];
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

export default function JobseekerProfilePage() {
  const { user, switchRole } = useAuth();
  const router = useRouter();
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [selectedResume, setSelectedResume] = useState<Resume | null>(null);
  const [isApplyingResume, setIsApplyingResume] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    personalSummary: '',
    workExperience: [],
    education: [],
    skills: [],
    languages: [],
    certifications: [],
    availability: 'Not specified',
    preferredWorkTypes: 'Not specified',
    preferredLocations: [],
    rightToWork: 'Not specified',
    salaryExpectation: {
      currency: 'USD',
      amount: ''
    },
    classifications: []
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    } else if (user.role !== 'APPLICANT') {
      router.push('/');
    } else {
      fetchResumes();
    }
  }, [user, router]);

  // Fetch user's resumes
  const fetchResumes = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('/api/resumes/upload', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setResumes(data.resumes || []);

        // If there are resumes, select the most recent one
        if (data.resumes && data.resumes.length > 0) {
          setSelectedResume(data.resumes[0]);
        }
      }
    } catch (error) {
      console.error('Error fetching resumes:', error);
    }
  };

  const handleRoleSwitch = async () => {
    try {
      setIsSwitching(true);
      await switchRole((newRole) => {
        console.log('Role switched to:', newRole);
        if (newRole === 'EMPLOYER') {
          router.push('/employer');
        }
      });
    } catch (error) {
      console.error('Error switching role:', error);
    } finally {
      setIsSwitching(false);
    }
  };

  // Handle personal summary update
  const handleSummarySave = (summary: string) => {
    setProfileData({
      ...profileData,
      personalSummary: summary
    });
  };

  // Handle work experience update
  const handleCareerSave = (workExperience: ProfileFormData['workExperience']) => {
    setProfileData({
      ...profileData,
      workExperience
    });
  };

  // Handle education update
  const handleEducationSave = (education: ProfileFormData['education']) => {
    setProfileData({
      ...profileData,
      education
    });
  };

  // Handle skills update
  const handleSkillsSave = (skills: string[]) => {
    setProfileData({
      ...profileData,
      skills
    });
  };

  // Handle languages update
  const handleLanguagesSave = (languages: string[]) => {
    setProfileData({
      ...profileData,
      languages
    });
  };

  // Handle certifications update
  const handleCertificationsSave = (certifications: string[]) => {
    setProfileData({
      ...profileData,
      certifications
    });
  };

  // Handle next role preferences update
  const handleNextRoleSave = (nextRoleData: {
    availability: string;
    preferredWorkTypes: string;
    preferredLocations: string[];
    rightToWork: string;
    salaryExpectation: {
      currency: string;
      amount: string;
    };
    classifications: string[];
  }) => {
    setProfileData({
      ...profileData,
      ...nextRoleData
    });
  };

  // Apply resume data to profile
  const applyResumeToProfile = (resume: Resume | null) => {
    if (!resume || !resume.parsedData) {
      console.warn('No resume selected or parsed data available.');
      return;
    }

    setIsApplyingResume(true);

    try {
      const resumeData = resume.parsedData;
      console.log('Applying resume data to profile:', resumeData);

      // Create new profile data object
      const newProfileData = { ...profileData };

      // Fill personal summary
      if (resumeData.summary) {
        console.log('Using existing summary from resume:', resumeData.summary);
        newProfileData.personalSummary = resumeData.summary;
      } else {
        console.log('No summary found in resume data, generating one...');
        // If no summary exists, generate one based on other resume data
        const generatedSummary = generateSummaryFromResumeData(resumeData);
        console.log('Generated summary:', generatedSummary);
        newProfileData.personalSummary = generatedSummary;
      }

      // Fill work experience
      if (resumeData.workExperience && Array.isArray(resumeData.workExperience)) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        newProfileData.workExperience = resumeData.workExperience.map((job: any) => ({
          company: job.company || '',
          title: job.title || '',
          dates: job.dates || '',
          description: job.description || ''
        }));
      }

      // Fill education
      if (resumeData.education && Array.isArray(resumeData.education)) {
        /* eslint-disable  @typescript-eslint/no-explicit-any */
        newProfileData.education = resumeData.education.map((edu: any) => ({
          school: edu.school || '',
          degree: edu.degree || '',
          dates: edu.dates || ''
        }));
      }

      // Fill skills
      if (resumeData.skills && Array.isArray(resumeData.skills)) {
        newProfileData.skills = resumeData.skills;
      }

      // Fill languages
      if (resumeData.languages && Array.isArray(resumeData.languages)) {
        newProfileData.languages = resumeData.languages;
      }

      // Fill certifications
      if (resumeData.certifications && Array.isArray(resumeData.certifications)) {
        newProfileData.certifications = resumeData.certifications;
      }

      // Fill location information
      if (resumeData.location) {
        newProfileData.preferredLocations = [resumeData.location];
      }

      // Update state
      setProfileData(newProfileData);
      setApplySuccess(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setApplySuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Error applying resume data to profile:', error);
    } finally {
      setIsApplyingResume(false);
    }
  };

  // Handle drag and drop end
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;

    // If there's no destination or dropped outside the list, do nothing
    if (!destination) {
      return;
    }

    // If source and destination are the same, do nothing
    if (destination.index === source.index && destination.droppableId === source.droppableId) {
      return;
    }

    // Update data based on droppableId
    if (source.droppableId === 'education-list') {
      const newEducation = [...profileData.education];
      const [removed] = newEducation.splice(source.index, 1);
      newEducation.splice(destination.index, 0, removed);
      setProfileData({
        ...profileData,
        education: newEducation
      });
    } else if (source.droppableId === 'career-list') {
      const newWorkExperience = [...profileData.workExperience];
      const [removed] = newWorkExperience.splice(source.index, 1);
      newWorkExperience.splice(destination.index, 0, removed);
      setProfileData({
        ...profileData,
        workExperience: newWorkExperience
      });
    } else if (source.droppableId === 'certifications-list') {
      const newCertifications = [...profileData.certifications];
      const [removed] = newCertifications.splice(source.index, 1);
      newCertifications.splice(destination.index, 0, removed);
      setProfileData({
        ...profileData,
        certifications: newCertifications
      });
    }
  };

  if (!user || user.role !== 'APPLICANT') {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="bg-white shadow sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                  <p className="mt-1 text-sm text-gray-500">Manage your personal information and resume</p>
                </div>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={handleRoleSwitch}
                    disabled={isSwitching}
                    className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium"
                  >
                    {isSwitching ? 'Switching...' : 'Switch to Employer Portal'}
                  </button>
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => router.push('/')}
                  >
                    Back to Jobs
                  </button>
                </div>
              </div>

              {/* Resume Upload Section */}
              <ResumeUploadSection
                resumes={resumes}
                selectedResume={selectedResume}
                setSelectedResume={setSelectedResume}
                fetchResumes={fetchResumes}
                applyResumeToProfile={() => applyResumeToProfile(selectedResume)}
                isApplyingResume={isApplyingResume}
                applySuccess={applySuccess}
              />

              <DragDropContext onDragEnd={handleDragEnd}>
                {/* Personal Summary */}
                <PersonalSummarySection
                  personalSummary={profileData.personalSummary}
                  onSave={handleSummarySave}
                />

                {/* Career History */}
                <CareerHistorySection
                  workExperience={profileData.workExperience}
                  onSave={handleCareerSave}
                />

                {/* Education */}
                <EducationSection
                  education={profileData.education}
                  onSave={handleEducationSave}
                />

                {/* Skills */}
                <SkillsSection
                  skills={profileData.skills}
                  onSave={handleSkillsSave}
                />

                {/* Languages */}
                <LanguagesSection
                  languages={profileData.languages}
                  onSave={handleLanguagesSave}
                />

                {/* Certifications */}
                <CertificationsSection
                  certifications={profileData.certifications}
                  onSave={handleCertificationsSave}
                />

                {/* About your next role */}
                <NextRoleSection
                  data={{
                    availability: profileData.availability,
                    preferredWorkTypes: profileData.preferredWorkTypes,
                    preferredLocations: profileData.preferredLocations,
                    rightToWork: profileData.rightToWork,
                    salaryExpectation: profileData.salaryExpectation,
                    classifications: profileData.classifications
                  }}
                  onSave={handleNextRoleSave}
                />
              </DragDropContext>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
