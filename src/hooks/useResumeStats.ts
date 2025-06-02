
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface ResumeStats {
  totalResumes: number;
  dailyCount: number;
  lastUpdated: string;
}

export const useResumeStats = () => {
  const [stats, setStats] = useState<ResumeStats>({
    totalResumes: 0,
    dailyCount: 0,
    lastUpdated: new Date().toISOString()
  });
  const [isLoading, setIsLoading] = useState(true);

  // Get auth context safely
  let authReady = false;
  try {
    const { loading: authLoading } = useAuth();
    authReady = !authLoading;
  } catch (error) {
    // Auth context not ready yet
    authReady = false;
  }

  const fetchStats = async () => {
    try {
      const { data, error } = await supabase.rpc('get_resume_stats');
      
      if (error) {
        console.error('Error fetching resume stats:', error);
        return;
      }

      if (data && data.length > 0) {
        const statsData = data[0];
        setStats({
          totalResumes: statsData.total_resumes || 0,
          dailyCount: statsData.daily_count || 0,
          lastUpdated: statsData.last_updated || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error fetching resume stats:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const incrementResumeCount = async () => {
    try {
      const { data, error } = await supabase.rpc('increment_resume_count');
      
      if (error) {
        console.error('Error incrementing resume count:', error);
        return;
      }

      // Refresh stats after incrementing
      await fetchStats();
      
      return data;
    } catch (error) {
      console.error('Error incrementing resume count:', error);
    }
  };

  useEffect(() => {
    // Only initialize stats fetching when auth is ready
    if (!authReady) {
      setIsLoading(false);
      return;
    }

    fetchStats();

    // Set up realtime subscription for stats updates only if auth is ready
    const channel = supabase
      .channel('resume-stats-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'resume_stats'
        },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [authReady]);

  return {
    stats,
    isLoading,
    incrementResumeCount,
    refreshStats: fetchStats
  };
};
