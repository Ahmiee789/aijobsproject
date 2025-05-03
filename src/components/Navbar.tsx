'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const { user, logout, loading, switchRole } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Debug log to check user state
  useEffect(() => {
    console.log('Navbar user state:', user);
  }, [user]);

  // Handle clicks outside the menu to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuRef]);

  const handleRoleSwitch = async () => {
    try {
      console.log('Current role:', user?.role);
      await switchRole((newRole) => {
        console.log('Role switched to:', newRole);
        // Close the menu
        setMenuOpen(false);
        // Navigate based on the new role
        if (newRole === 'EMPLOYER') {
          console.log('Navigating to employer portal');
          router.push('/employer');
        } else {
          console.log('Navigating to home page');
          router.push('/');
        }
      });
    } catch (error) {
      console.error('Error switching role:', error);
      alert('Failed to switch role. Please try again.');
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setMenuOpen(false);
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to sign out. Please try again.');
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleSavedJobs = () => {
    setMenuOpen(false); // Close the menu
    router.push('/saved-jobs');
  };

  const handlePostJob = () => {
    setMenuOpen(false); // Close the menu
    router.push('/post-job');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <Link href="/" className="flex items-center">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-600 via-purple-600 to-teal-500 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-lg">AI</span>
                  </div>
                  <div className="ml-3">
                    <span className="text-xl font-semibold text-gray-900">AIJobs</span>
                  </div>
                </Link>
              </div>
            </div>
            <nav className="hidden md:flex ml-10 space-x-8">
              <Link href="/search" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Job search
              </Link>
              {user?.role === 'APPLICANT' ? (
                <Link href="/jobseeker/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Profile
                </Link>
              ) : (
                <Link href="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                  Profile
                </Link>
              )}
              <Link href="/career-advice" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Career advice
              </Link>
              <Link href="/explore-companies" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium">
                Explore companies
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {loading ? (
              <div className="animate-pulse h-8 w-8 bg-gray-200 rounded-full"></div>
            ) : user ? (
              <div className="flex items-center space-x-4">
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="flex items-center space-x-3 px-3 py-2 rounded-md hover:bg-gray-50 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-medium">
                      {user.email?.[0].toUpperCase()}
                    </div>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-700">{user.email?.split('@')[0]}</span>
                      <span className="text-xs text-gray-500">{user.role}</span>
                    </div>
                  </button>

                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-1 ring-1 ring-black ring-opacity-5 z-50">
                      <div className="px-4 py-3 border-b border-gray-200">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-blue-600 font-medium">
                            {user.email?.[0].toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{user.email}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                          </div>
                        </div>
                      </div>

                      <Link href={user.role === 'APPLICANT' ? "/jobseeker/profile" : "/profile"} 
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        onClick={() => setMenuOpen(false)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        Profile
                      </Link>

                      {user.role === 'APPLICANT' && (
                        <button
                          onClick={handleSavedJobs}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                          </svg>
                          Saved Jobs
                        </button>
                      )}

                      {user.role === 'EMPLOYER' && (
                        <button
                          onClick={handlePostJob}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                          </svg>
                          Post Job
                        </button>
                      )}

                      <button
                        onClick={handleRoleSwitch}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                        </svg>
                        Switch to {user.role === 'APPLICANT' ? 'Employer' : 'Applicant'} Portal
                      </button>

                      <button
                        onClick={handleLogout}
                        disabled={isLoggingOut}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        {isLoggingOut ? 'Signing out...' : 'Sign Out'}
                      </button>
                    </div>
                  )}
                </div>

                {user.role === 'APPLICANT' ? (
                  <button
                    onClick={handleRoleSwitch}
                    className="hidden md:block text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Employer Portal
                  </button>
                ) : (
                  <button
                    onClick={handleRoleSwitch}
                    className="hidden md:block text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Applicant Portal
                  </button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">
                  Sign In
                </Link>
                <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-md hover:from-blue-700 hover:to-indigo-700 font-medium transition-all duration-200">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
