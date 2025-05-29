
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
    fetchStats();

    // Set up realtime subscription for stats updates
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
  }, []);

  return {
    stats,
    isLoading,
    incrementResumeCount,
    refreshStats: fetchStats
  };
};
