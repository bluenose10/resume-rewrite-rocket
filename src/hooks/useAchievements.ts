
import { Achievement } from '@/types/resume';

interface UseAchievementsProps {
  achievements: Achievement[];
  onUpdate: (achievements: Achievement[]) => void;
}

export const useAchievements = ({ achievements, onUpdate }: UseAchievementsProps) => {
  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      organization: ''
    };
    onUpdate([...achievements, newAchievement]);
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    onUpdate(
      achievements.map(ach => 
        ach.id === id ? { ...ach, [field]: value } : ach
      )
    );
  };

  const removeAchievement = (id: string) => {
    onUpdate(achievements.filter(ach => ach.id !== id));
  };

  return {
    addAchievement,
    updateAchievement,
    removeAchievement
  };
};
