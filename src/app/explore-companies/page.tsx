'use client';

import React, { useState } from 'react';
import Navbar from '@/components/Navbar';

interface Company {
  id: number;
  name: string;
  logo: string;
  industry: string;
  size: string;
  location: string;
  description: string;
  rating: number;
  reviewCount: number;
  benefits: string[];
  techStack: string[];
  openPositions: number;
  featured: boolean;
  website: string;
  founded: string;
  mission: string;
  culture: string[];
}

interface Review {
  id: number;
  companyId: number;
  rating: number;
  title: string;
  content: string;
  author: string;
  role: string;
  date: string;
  pros: string[];
  cons: string[];
}

const companies: Company[] = [
  {
    id: 1,
    name: 'TechCorp',
    logo: 'TC',
    industry: 'Technology',
    size: '501-1000',
    location: 'San Francisco, CA',
    description: 'Leading technology company specializing in AI solutions and cloud computing.',
    rating: 4.8,
    reviewCount: 156,
    benefits: ['Health Insurance', '401(k)', 'Remote Work', 'Professional Development', 'Stock Options', 'Flexible Hours'],
    techStack: ['Python', 'TensorFlow', 'AWS', 'React', 'Node.js', 'Docker'],
    openPositions: 12,
    featured: true,
    website: 'www.techcorp.com',
    founded: '2015',
    mission: 'To democratize AI and make technology accessible to everyone.',
    culture: ['Innovation', 'Collaboration', 'Work-Life Balance', 'Continuous Learning']
  },
  {
    id: 2,
    name: 'AI Solutions',
    logo: 'AI',
    industry: 'Artificial Intelligence',
    size: '51-200',
    location: 'Remote',
    description: 'Innovative AI company focused on machine learning and natural language processing.',
    rating: 4.6,
    reviewCount: 89,
    benefits: ['Competitive Salary', 'Flexible Hours', 'Learning Budget', 'Stock Options', 'Remote Work', 'Health Insurance'],
    techStack: ['PyTorch', 'Kubernetes', 'TypeScript', 'GraphQL', 'Python', 'TensorFlow'],
    openPositions: 8,
    featured: true,
    website: 'www.aisolutions.com',
    founded: '2018',
    mission: 'Advancing the frontiers of artificial intelligence through innovation and research.',
    culture: ['Innovation', 'Remote-First', 'Transparency', 'Growth Mindset']
  },
  {
    id: 3,
    name: 'DataFlow Systems',
    logo: 'DF',
    industry: 'Data Analytics',
    size: '201-500',
    location: 'New York, NY',
    description: 'Data analytics company helping businesses make data-driven decisions.',
    rating: 4.3,
    reviewCount: 234,
    benefits: ['Medical Insurance', 'Annual Bonus', 'Gym Membership', 'Team Events', '401(k)', 'Professional Development'],
    techStack: ['Python', 'SQL', 'Tableau', 'Spark', 'Hadoop', 'R'],
    openPositions: 15,
    featured: false,
    website: 'www.dataflow.com',
    founded: '2012',
    mission: 'Empowering businesses with actionable insights through data analytics.',
    culture: ['Data-Driven', 'Collaboration', 'Innovation', 'Work-Life Balance']
  }
];

const reviews: Review[] = [
  {
    id: 1,
    companyId: 1,
    rating: 5,
    title: 'Great place to work with amazing culture',
    content: 'TechCorp has an excellent work environment with supportive management and great opportunities for growth.',
    author: 'John Doe',
    role: 'Senior Software Engineer',
    date: '2024-03-15',
    pros: ['Competitive salary', 'Great benefits', 'Work-life balance', 'Learning opportunities'],
    cons: ['Fast-paced environment', 'Sometimes long hours']
  },
  {
    id: 2,
    companyId: 2,
    rating: 4,
    title: 'Innovative company with cutting-edge tech',
    content: 'AI Solutions is at the forefront of AI technology. The work is challenging but rewarding.',
    author: 'Jane Smith',
    role: 'Machine Learning Engineer',
    date: '2024-03-10',
    pros: ['Latest technologies', 'Remote work', 'Learning opportunities', 'Great team'],
    cons: ['Communication challenges', 'Limited office presence']
  }
];

export default function ExploreCompaniesPage() {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showReviews, setShowReviews] = useState<number | null>(null);
  const [showDetails, setShowDetails] = useState<number | null>(null);
  const [followedCompanies, setFollowedCompanies] = useState<number[]>([]);

  const filteredCompanies = companies.filter(company => {
    const matchesIndustry = selectedIndustry === 'all' || company.industry === selectedIndustry;
    const matchesSize = selectedSize === 'all' || company.size === selectedSize;
    const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         company.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesIndustry && matchesSize && matchesSearch;
  });

  const companyReviews = (companyId: number) => {
    return reviews.filter(review => review.companyId === companyId);
  };

  const toggleFollow = (companyId: number) => {
    setFollowedCompanies(prev => 
      prev.includes(companyId) 
        ? prev.filter(id => id !== companyId)
        : [...prev, companyId]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Companies
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover top companies in the tech industry and find your next career opportunity.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
                Search Companies
              </label>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Company name or description"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">
                Industry
              </label>
              <select
                id="industry"
                value={selectedIndustry}
                onChange={(e) => setSelectedIndustry(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Industries</option>
                <option value="Technology">Technology</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Analytics">Data Analytics</option>
              </select>
            </div>
            <div>
              <label htmlFor="size" className="block text-sm font-medium text-gray-700 mb-1">
                Company Size
              </label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Sizes</option>
                <option value="1-50">1-50 employees</option>
                <option value="51-200">51-200 employees</option>
                <option value="201-500">201-500 employees</option>
                <option value="501-1000">501-1000 employees</option>
                <option value="1000+">1000+ employees</option>
              </select>
            </div>
          </div>
        </div>

        {/* Company Listings */}
        <div className="space-y-6">
          {filteredCompanies.map((company) => (
            <div
              key={company.id}
              className="bg-white rounded-lg shadow-sm p-6 border border-gray-200 hover:border-blue-500 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center text-white text-xl font-bold">
                    {company.logo}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-xl font-semibold text-gray-900">{company.name}</h2>
                      {company.featured && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          Featured
                        </span>
                      )}
                    </div>
                    <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                      <span>{company.industry}</span>
                      <span>•</span>
                      <span>{company.size} employees</span>
                      <span>•</span>
                      <span>{company.location}</span>
                    </div>
                    <div className="mt-2 flex items-center space-x-2">
                      <div className="flex items-center">
                        <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <span className="ml-1 text-sm font-medium text-gray-900">{company.rating}</span>
                        <span className="ml-1 text-sm text-gray-500">({company.reviewCount} reviews)</span>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-600">{company.description}</p>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {company.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <span className="text-sm font-medium text-blue-600">
                    {company.openPositions} open positions
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setShowDetails(showDetails === company.id ? null : company.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {showDetails === company.id ? 'Hide Details' : 'Show Details'}
                    </button>
                    <button
                      onClick={() => setShowReviews(showReviews === company.id ? null : company.id)}
                      className="text-sm text-gray-600 hover:text-gray-900"
                    >
                      {showReviews === company.id ? 'Hide Reviews' : 'Show Reviews'}
                    </button>
                    <button
                      onClick={() => toggleFollow(company.id)}
                      className={`text-sm ${
                        followedCompanies.includes(company.id)
                          ? 'text-blue-600 hover:text-blue-700'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      {followedCompanies.includes(company.id) ? 'Following' : 'Follow'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Company Details */}
              {showDetails === company.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Company Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">About</h4>
                      <p className="text-sm text-gray-600">{company.description}</p>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Mission</h4>
                        <p className="text-sm text-gray-600">{company.mission}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Founded</h4>
                        <p className="text-sm text-gray-600">{company.founded}</p>
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Website</h4>
                        <a
                          href={`https://${company.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700"
                        >
                          {company.website}
                        </a>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-2">Company Culture</h4>
                      <div className="flex flex-wrap gap-2">
                        {company.culture.map((value, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                          >
                            {value}
                          </span>
                        ))}
                      </div>
                      <div className="mt-4">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">Benefits</h4>
                        <div className="grid grid-cols-2 gap-2">
                          {company.benefits.map((benefit, index) => (
                            <div key={index} className="flex items-center text-sm text-gray-600">
                              <svg className="h-4 w-4 text-green-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {benefit}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Company Reviews */}
              {showReviews === company.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Employee Reviews</h3>
                  <div className="space-y-4">
                    {companyReviews(company.id).map((review) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">{review.title}</h4>
                            <p className="text-sm text-gray-500">
                              {review.author} • {review.role} • {new Date(review.date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center">
                            <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.363 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.363-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="ml-1 text-sm font-medium text-gray-900">{review.rating}</span>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-gray-600">{review.content}</p>
                        <div className="mt-4 grid grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-sm font-medium text-green-600">Pros</h5>
                            <ul className="mt-1 space-y-1">
                              {review.pros.map((pro, index) => (
                                <li key={index} className="text-sm text-gray-600">• {pro}</li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <h5 className="text-sm font-medium text-red-600">Cons</h5>
                            <ul className="mt-1 space-y-1">
                              {review.cons.map((con, index) => (
                                <li key={index} className="text-sm text-gray-600">• {con}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
} 