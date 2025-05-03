// Enum types matching our database
export type JobType = 'full-time' | 'part-time' | 'contract' | 'remote';
export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';
export type ApplicationStatus = 'pending' | 'reviewed' | 'interviewed' | 'rejected' | 'hired';

// Job interface
export interface Job {
  id: string;
  employer_id?: string;  // Optional for mock data
  title: string;
  company: string;
  location: string;
  job_type: JobType;  // The job type (full-time, part-time, etc.)
  description: string;
  requirements?: string;  // Optional for mock data
  salary: string;
  experience_level: ExperienceLevel;
  created_at?: string;  // Optional for mock data
  updated_at?: string;  // Optional for mock data
  match_score: number;
  is_new: boolean;
  posted_ago?: string; // Optional field for display purposes
}

// Application interface
export interface Application {
  id: string;
  job_id: string;
  applicant_id: string;
  resume_url: string | null;
  cover_letter: string | null;
  status: ApplicationStatus;
  created_at: string;
  updated_at: string;
}

// Interface for creating a new job (omitting auto-generated fields)
export interface NewJob {
  title: string;
  company: string;
  location: string;
  job_type: JobType;  // The job type (full-time, part-time, etc.)
  description: string;
  requirements: string;
  salary: string;
  experience_level: ExperienceLevel;
  employer_id?: string;
}

// Interface for creating a new application
export interface NewApplication {
  job_id: string;
  resume_url?: string;
  cover_letter?: string;
}

// Job search filters interface
export interface JobSearchFilters {
  searchTerm?: string;
  location?: string;
  type?: JobType | 'all';
  experience_level?: ExperienceLevel | 'all';
  salary_range?: string;
  salaryRange?: string;  // For backward compatibility
  sort_by?: 'relevance' | 'recent' | 'salary';
  page?: number;
  limit?: number;
}