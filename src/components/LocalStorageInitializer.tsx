'use client';

import { useEffect } from 'react';
import { seedInitialData } from '@/utils/localStorage';

export default function LocalStorageInitializer() {
  useEffect(() => {
    // Initialize local storage with seed data when the app loads
    seedInitialData();
  }, []);

  // This component doesn't render anything
  return null;
} 