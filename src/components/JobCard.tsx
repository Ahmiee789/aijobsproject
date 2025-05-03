import React from 'react';
import Image from 'next/image';

interface JobDetail {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  match_score: number;
  posted_ago: string;
  is_new: boolean;
  logo?: string;
  details?: string[];
}

interface JobCardProps {
  job: JobDetail;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
              {job.title}
            </h3>
            {job.is_new && (
              <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                New
              </span>
            )}
          </div>
          <p className="text-gray-700 mt-1 font-medium">{job.company}</p>
          <p className="text-gray-500 text-sm mt-1 flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {job.location}
          </p>

          {job.salary && (
            <p className="text-gray-600 mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.salary}
            </p>
          )}

          {job.details && job.details.length > 0 && (
            <ul className="mt-4 space-y-2">
              {job.details.map((detail, index) => (
                <li key={index} className="text-gray-600 text-sm flex items-start">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 mt-0.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {detail}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center text-sm text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {job.posted_ago}
            </div>
            {job.match_score > 0 && (
              <div className="flex items-center">
                <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${job.match_score}%` }}
                  />
                </div>
                <span className="ml-2 text-sm font-medium text-gray-600">
                  {job.match_score}% match
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="ml-6 flex flex-col items-end">
          {job.logo ? (
            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shadow-sm">
              <Image
                src={job.logo}
                alt={`${job.company} logo`}
                width={64}
                height={64}
                className="object-contain"
              />
            </div>
          ) : (
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center shadow-sm">
              <span className="text-2xl font-bold text-gray-400">
                {job.company.charAt(0)}
              </span>
            </div>
          )}

          <button className="mt-4 p-2 rounded hover:bg-gray-50 focus:outline-none">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobCard;
