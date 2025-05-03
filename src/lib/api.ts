import { supabase } from './supabase';
import { Job, NewJob, Application, NewApplication, JobSearchFilters } from '@/types/database';

export const jobsApi = {
  // Create a new job
  createJob: async (jobData: NewJob): Promise<Job> => {
    try {
      console.log('Attempting to create job with data:', jobData);
      const { data, error } = await supabase
        .from('jobs')
        .insert([jobData])
        .select()
        .single();

      if (error) {
        console.error('Supabase error creating job:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Job created successfully:', data);
      return data;
    } catch (error: any) {
      console.error('Error in createJob:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
  },

  // Get a single job by ID
  getJob: async (id: string): Promise<Job> => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  // FIXME: Why duplicated methods?

  // Delete a job
  deleteJob: async (id: string): Promise<void> => {
    const { error } = await supabase
      .from('jobs')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Search jobs with filters
  searchJobs: async (filters: JobSearchFilters) => {
    let query = supabase
      .from('jobs')
      .select('*')
      .eq('status', 'active');

    // Apply filters
    if (filters.searchTerm) {
      query = query.textSearch('search_vector', filters.searchTerm);
    }

    if (filters.location) {
      query = query.ilike('location', `%${filters.location}%`);
    }

    if (filters.type && filters.type !== 'all') {
      query = query.eq('type', filters.type);
    }

    if (filters.experience_level && filters.experience_level !== 'all') {
      query = query.eq('experience_level', filters.experience_level);
    }

    // Apply sorting
    if (filters.sort_by === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (filters.sort_by === 'salary') {
      query = query.order('salary', { ascending: false });
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const start = (page - 1) * limit;
    query = query.range(start, start + limit - 1);

    const { data, error, count } = await query;

    if (error) throw error;
    return { jobs: data, count };
  },

  // Get jobs posted by the current employer
  getEmployerJobs: async (): Promise<Job[]> => {
    try {
      // Get the current user's session
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user?.id) {
        throw new Error('No authenticated user found');
      }

      console.log('Fetching jobs for employer:', session.user.id);
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('employer_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching employer jobs:', {
          error,
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        throw error;
      }

      console.log('Found jobs:', data);
      return data || [];
    } catch (error: any) {
      console.error('Error in getEmployerJobs:', {
        error,
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      throw error;
    }
  },

  async updateJob(jobId: string, jobData: NewJob): Promise<Job> {
    try {
      const session = await supabase.auth.getSession();
      if (!session.data.session?.user) {
        throw new Error('You must be logged in to update a job');
      }

      // Verify that the user owns this job
      const { data: existingJob } = await supabase
        .from('jobs')
        .select('employer_id')
        .eq('id', jobId)
        .single();

      if (!existingJob) {
        throw new Error('Job not found');
      }

      if (existingJob.employer_id !== session.data.session.user.id) {
        throw new Error('You do not have permission to update this job');
      }

      const { data, error } = await supabase
        .from('jobs')
        .update(jobData)
        .eq('id', jobId)
        .select()
        .single();

      if (error) {
        console.error('Error updating job:', error);
        throw error;
      }

      if (!data) {
        throw new Error('Failed to update job');
      }

      return data;
    } catch (error) {
      console.error('Error in updateJob:', error);
      throw error;
    }
  }
};

export const applicationsApi = {
  // Submit a new application
  submitApplication: async (application: NewApplication): Promise<Application> => {
    const { data, error } = await supabase
      .from('applications')
      .insert([application])
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  // Get applications for a job (for employers)
  getJobApplications: async (jobId: string): Promise<Application[]> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Get user's applications (for applicants)
  getUserApplications: async (): Promise<Application[]> => {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  // Update application status (for employers)
  updateApplicationStatus: async (
    applicationId: string,
    status: Application['status']
  ): Promise<Application> => {
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}; 