
import { supabase } from '@/integrations/supabase/client';

export interface OptimizeRequest {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    classification: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  skills: string[];
}

export interface OptimizeResponse {
  summary: string;
  experience: Array<{
    description: string;
  }>;
  projects: Array<{
    description: string;
  }>;
}

export const optimizeResumeContent = async (
  resumeData: OptimizeRequest
): Promise<OptimizeResponse> => {
  try {
    console.log('Calling Supabase Edge Function to optimize resume...');
    
    const { data, error } = await supabase.functions.invoke('optimize-resume', {
      body: resumeData,
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(error.message || 'Failed to optimize resume content');
    }

    if (!data) {
      throw new Error('No data received from optimization service');
    }

    console.log('Resume optimization successful:', data);
    return data as OptimizeResponse;

  } catch (error) {
    console.error('Resume optimization error:', error);
    throw new Error(
      error instanceof Error 
        ? error.message 
        : 'Failed to optimize resume content. Please try again.'
    );
  }
};
