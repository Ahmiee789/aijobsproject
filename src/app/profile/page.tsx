'use client';

import React from 'react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
              Profile
            </h1>
            <p className="text-gray-600 mb-8">
              Your personal information and settings
            </p>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {user?.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User Role
                </label>
                <p className="mt-1 text-sm text-gray-900 capitalize">
                  {user?.role.toLowerCase()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Registration Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
