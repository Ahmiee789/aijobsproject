'use client';

import React from 'react';
import Navbar from '@/components/Navbar';

interface CareerTip {
  id: number;
  title: string;
  description: string;
  category: 'resume' | 'interview' | 'networking' | 'skills';
  icon: string;
}

interface IndustryInsight {
  id: number;
  title: string;
  description: string;
  industry: string;
  trend: 'growing' | 'stable' | 'declining';
  salaryRange: string;
}

interface Resource {
  id: number;
  title: string;
  description: string;
  type: 'course' | 'article' | 'tool';
  link: string;
  isFree: boolean;
}

const careerTips: CareerTip[] = [
  {
    id: 1,
    title: 'Craft a Standout Resume',
    description: 'Learn how to create a compelling resume that highlights your skills and experience effectively.',
    category: 'resume',
    icon: '📄'
  },
  {
    id: 2,
    title: 'Ace Your Technical Interview',
    description: 'Master the art of technical interviews with our comprehensive guide and practice resources.',
    category: 'interview',
    icon: '💻'
  },
  {
    id: 3,
    title: 'Build Your Professional Network',
    description: 'Discover strategies to expand your professional network and leverage it for career growth.',
    category: 'networking',
    icon: '🤝'
  },
  {
    id: 4,
    title: 'Develop In-Demand Skills',
    description: 'Stay ahead of the curve by identifying and developing the most sought-after skills in your industry.',
    category: 'skills',
    icon: '📚'
  }
];

const industryInsights: IndustryInsight[] = [
  {
    id: 1,
    title: 'The Future of AI and Machine Learning',
    description: 'Explore the latest trends and opportunities in AI and machine learning careers.',
    industry: 'Technology',
    trend: 'growing',
    salaryRange: '$90,000 - $180,000'
  },
  {
    id: 2,
    title: 'Sustainable Energy Careers',
    description: 'Learn about emerging opportunities in renewable energy and sustainability.',
    industry: 'Energy',
    trend: 'growing',
    salaryRange: '$70,000 - $150,000'
  },
  {
    id: 3,
    title: 'Healthcare Technology',
    description: 'Discover the intersection of healthcare and technology, and the career paths available.',
    industry: 'Healthcare',
    trend: 'stable',
    salaryRange: '$80,000 - $160,000'
  }
];

const resources: Resource[] = [
  {
    id: 1,
    title: 'Introduction to AI and Machine Learning',
    description: 'A comprehensive course covering the fundamentals of AI and ML.',
    type: 'course',
    link: '#',
    isFree: false
  },
  {
    id: 2,
    title: 'Resume Writing Guide',
    description: 'Step-by-step guide to creating a professional resume that stands out.',
    type: 'article',
    link: '#',
    isFree: true
  },
  {
    id: 3,
    title: 'Interview Preparation Tool',
    description: 'Interactive tool to help you prepare for technical interviews.',
    type: 'tool',
    link: '#',
    isFree: true
  }
];

export default function CareerAdvicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Career Advice & Resources
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover valuable insights, tips, and resources to help you advance your career in the tech industry.
          </p>
        </div>

        {/* Career Tips Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Career Tips</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careerTips.map((tip) => (
              <div
                key={tip.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="text-3xl mb-4">{tip.icon}</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{tip.title}</h3>
                <p className="text-gray-600">{tip.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Industry Insights Section */}
        <section className="mb-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Industry Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {industryInsights.map((insight) => (
              <div
                key={insight.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500">{insight.industry}</span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    insight.trend === 'growing' ? 'bg-green-100 text-green-800' :
                    insight.trend === 'stable' ? 'bg-blue-100 text-blue-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {insight.trend.charAt(0).toUpperCase() + insight.trend.slice(1)}
                  </span>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{insight.title}</h3>
                <p className="text-gray-600 mb-4">{insight.description}</p>
                <p className="text-sm text-gray-500">Salary Range: {insight.salaryRange}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Professional Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium text-gray-500 capitalize">{resource.type}</span>
                  {resource.isFree && (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Free
                    </span>
                  )}
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">{resource.title}</h3>
                <p className="text-gray-600 mb-4">{resource.description}</p>
                <a
                  href={resource.link}
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  Learn more
                  <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
} 