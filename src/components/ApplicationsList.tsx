'use client';

import React from 'react';

interface Application {
  id: number;
  jobTitle: string;
  applicantName: string;
  email: string;
  appliedDate: string;
  status: 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';
}

// Sample data - replace with actual data from your backend
const SAMPLE_APPLICATIONS: Application[] = [
  {
    id: 1,
    jobTitle: 'Senior AI Engineer',
    applicantName: 'John Doe',
    email: 'john@example.com',
    appliedDate: '2024-03-15',
    status: 'pending'
  },
  {
    id: 2,
    jobTitle: 'Machine Learning Engineer',
    applicantName: 'Jane Smith',
    email: 'jane@example.com',
    appliedDate: '2024-03-14',
    status: 'reviewed'
  },
  {
    id: 3,
    jobTitle: 'Data Scientist',
    applicantName: 'Mike Johnson',
    email: 'mike@example.com',
    appliedDate: '2024-03-13',
    status: 'interviewed'
  }
];

export default function ApplicationsList() {
  const [applications, setApplications] = React.useState<Application[]>(SAMPLE_APPLICATIONS);
  const [selectedStatus, setSelectedStatus] = React.useState<string>('all');

  const filteredApplications = selectedStatus === 'all'
    ? applications
    : applications.filter(app => app.status === selectedStatus);

  const handleStatusChange = (applicationId: number, newStatus: Application['status']) => {
    setApplications(applications.map(app =>
      app.id === applicationId ? { ...app, status: newStatus } : app
    ));
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="px-4 py-3 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-medium text-gray-900">Applications</h2>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="reviewed">Reviewed</option>
            <option value="interviewed">Interviewed</option>
            <option value="rejected">Rejected</option>
            <option value="hired">Hired</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-gray-200">
        {filteredApplications.map((application) => (
          <div key={application.id} className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{application.jobTitle}</h3>
                <p className="text-sm text-gray-500">{application.applicantName}</p>
                <p className="text-sm text-gray-500">{application.email}</p>
                <p className="text-xs text-gray-400 mt-1">Applied {application.appliedDate}</p>
              </div>
              <div className="flex items-center space-x-2">
                <select
                  value={application.status}
                  onChange={(e) => handleStatusChange(application.id, e.target.value as Application['status'])}
                  className="text-sm border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="reviewed">Reviewed</option>
                  <option value="interviewed">Interviewed</option>
                  <option value="rejected">Rejected</option>
                  <option value="hired">Hired</option>
                </select>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                  View
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 