
import { useEffect, useRef } from 'react';
import { ResumeData } from '@/types/resume';

interface UseAutoSaveProps {
  data: ResumeData;
  delay?: number;
}

export const useAutoSave = ({ data, delay = 2000 }: UseAutoSaveProps) => {
  const timeoutRef = useRef<NodeJS.Timeout>();
  const lastSavedRef = useRef<string>('');

  useEffect(() => {
    const dataString = JSON.stringify(data);
    
    // Don't save if data hasn't changed
    if (dataString === lastSavedRef.current) return;

    // Clear existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new timeout for auto-save
    timeoutRef.current = setTimeout(() => {
      try {
        localStorage.setItem('resume-auto-save', dataString);
        lastSavedRef.current = dataString;
        console.log('Resume auto-saved to localStorage');
      } catch (error) {
        console.warn('Failed to auto-save resume:', error);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay]);
};
