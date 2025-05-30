
import { Experience } from '@/types/resume';

interface UseExperienceProps {
  experience: Experience[];
  onUpdate: (experience: Experience[]) => void;
}

export const useExperience = ({ experience, onUpdate }: UseExperienceProps) => {
  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onUpdate([...experience, newExp]);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    onUpdate(
      experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    );
  };

  const removeExperience = (id: string) => {
    onUpdate(experience.filter(exp => exp.id !== id));
  };

  return {
    addExperience,
    updateExperience,
    removeExperience
  };
};
