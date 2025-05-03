export interface JobDetail {
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
  job_type?: JobType;
  experience_level?: ExperienceLevel;
}

export type JobType = 'full-time' | 'part-time' | 'contract' | 'remote';

export type ExperienceLevel = 'entry' | 'mid' | 'senior' | 'executive';

export interface JobSearchFilters {
  searchTerm: string;
  location: string;
  type: JobType | 'all';
  experience_level: ExperienceLevel | 'all';
  salaryRange: string;
  sort_by: 'relevance' | 'recent' | 'salary';
}

export interface JobSearchResponse {
  jobs: JobDetail[];
  total: number;
  page: number;
  totalPages: number;
} 