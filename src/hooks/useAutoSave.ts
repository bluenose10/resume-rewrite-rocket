
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

  const loadAutoSave = (): ResumeData | null => {
    try {
      const saved = localStorage.getItem('resume-auto-save');
      return saved ? JSON.parse(saved) : null;
    } catch (error) {
      console.warn('Failed to load auto-saved resume:', error);
      return null;
    }
  };

  const clearAutoSave = () => {
    try {
      localStorage.removeItem('resume-auto-save');
      lastSavedRef.current = '';
    } catch (error) {
      console.warn('Failed to clear auto-save:', error);
    }
  };

  return { loadAutoSave, clearAutoSave };
};
