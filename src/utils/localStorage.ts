// Local storage utility for database operations
// This is a temporary replacement for Prisma database operations

// Types that match our Prisma schema
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  role: 'APPLICANT' | 'EMPLOYER';
  createdAt: string;
  updatedAt: string;
}

export interface Resume {
  id: string;
  userId: string;
  fileUrl: string;
  parsedText?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Job {
  id: string;
  employerId: string;
  title: string;
  company: string;
  location: string;
  salaryRange?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

// Storage keys
export const STORAGE_KEYS = {
  USERS: 'ai_jobs_users',
  RESUMES: 'ai_jobs_resumes',
  JOBS: 'ai_jobs_jobs',
  CURRENT_USER: 'ai_jobs_current_user',
};

// Improved browser check that's more SSR-friendly
const isBrowser = () => {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
};

// Safe localStorage wrapper
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (!isBrowser()) return null;
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('LocalStorage getItem error:', error);
      return null;
    }
  },
  setItem: (key: string, value: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('LocalStorage setItem error:', error);
    }
  },
  removeItem: (key: string): void => {
    if (!isBrowser()) return;
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('LocalStorage removeItem error:', error);
    }
  }
};

// Seed initial data
export function seedInitialData() {
  if (!isBrowser()) return;
  
  try {
    // Only seed if data doesn't exist
    if (!safeLocalStorage.getItem(STORAGE_KEYS.USERS)) {
      // Sample users
      const users: User[] = [
        {
          id: '1',
          email: 'jobseeker@example.com',
          passwordHash: 'password123', // In reality, would be hashed
          role: 'APPLICANT',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          email: 'employer@example.com',
          passwordHash: 'password123', // In reality, would be hashed
          role: 'EMPLOYER',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      // Sample jobs
      const jobs: Job[] = [
        {
          id: '1',
          employerId: '2',
          title: 'Frontend Developer',
          company: 'Tech Solutions Inc.',
          location: 'New York, NY',
          salaryRange: '$80,000 - $100,000',
          description: 'Looking for an experienced frontend developer with React skills.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '2',
          employerId: '2',
          title: 'Backend Engineer',
          company: 'Data Systems Co.',
          location: 'San Francisco, CA',
          salaryRange: '$90,000 - $120,000',
          description: 'Backend developer with Node.js and database experience.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: '3',
          employerId: '2',
          title: 'Full Stack Developer',
          company: 'Innovative Startups',
          location: 'Remote',
          salaryRange: '$100,000 - $130,000',
          description: 'Full stack developer with React and Node.js experience.',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      
      // Set initial data
      safeLocalStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
      safeLocalStorage.setItem(STORAGE_KEYS.RESUMES, JSON.stringify([]));
      safeLocalStorage.setItem(STORAGE_KEYS.JOBS, JSON.stringify(jobs));
    }
  } catch (error) {
    console.error('Error seeding initial data:', error);
  }
}

// Generic functions to get and set items
export function getItems<T>(key: string): T[] {
  if (!isBrowser()) return [];
  const data = safeLocalStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function setItems<T>(key: string, items: T[]): void {
  if (!isBrowser()) return;
  safeLocalStorage.setItem(key, JSON.stringify(items));
}

// User-specific operations
export function getUsers(): User[] {
  return getItems<User>(STORAGE_KEYS.USERS);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find(user => user.id === id);
}

export function getUserByEmail(email: string): User | undefined {
  return getUsers().find(user => user.email === email);
}

export function createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
  const users = getUsers();
  const newUser: User = {
    ...user,
    id: String(users.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  users.push(newUser);
  setItems(STORAGE_KEYS.USERS, users);
  return newUser;
}

// Job-specific operations
export function getJobs(): Job[] {
  return getItems<Job>(STORAGE_KEYS.JOBS);
}

export function getJobById(id: string): Job | undefined {
  return getJobs().find(job => job.id === id);
}

export function createJob(job: Omit<Job, 'id' | 'createdAt' | 'updatedAt'>): Job {
  const jobs = getJobs();
  const newJob: Job = {
    ...job,
    id: String(jobs.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  jobs.push(newJob);
  setItems(STORAGE_KEYS.JOBS, jobs);
  return newJob;
}

// Resume-specific operations
export function getResumes(): Resume[] {
  return getItems<Resume>(STORAGE_KEYS.RESUMES);
}

export function getResumesByUserId(userId: string): Resume[] {
  return getResumes().filter(resume => resume.userId === userId);
}

export function createResume(resume: Omit<Resume, 'id' | 'createdAt' | 'updatedAt'>): Resume {
  const resumes = getResumes();
  const newResume: Resume = {
    ...resume,
    id: String(resumes.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  resumes.push(newResume);
  setItems(STORAGE_KEYS.RESUMES, resumes);
  return newResume;
}

// Authentication helpers
export function setCurrentUser(user: User): void {
  if (!isBrowser()) return;
  safeLocalStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(user));
}

export function getCurrentUser(): User | null {
  if (!isBrowser()) return null;
  const data = safeLocalStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return data ? JSON.parse(data) : null;
}

export function clearCurrentUser(): void {
  if (!isBrowser()) return;
  safeLocalStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
} 