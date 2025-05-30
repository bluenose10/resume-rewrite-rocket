
import { VolunteerExperience } from '@/types/resume';

interface UseVolunteerExperienceProps {
  volunteerExperience: VolunteerExperience[];
  onUpdate: (volunteerExperience: VolunteerExperience[]) => void;
}

export const useVolunteerExperience = ({ volunteerExperience, onUpdate }: UseVolunteerExperienceProps) => {
  const addVolunteerExperience = () => {
    const newVolunteer: VolunteerExperience = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    onUpdate([...volunteerExperience, newVolunteer]);
  };

  const updateVolunteerExperience = (id: string, field: keyof VolunteerExperience, value: string | boolean) => {
    onUpdate(
      volunteerExperience.map(vol => 
        vol.id === id ? { ...vol, [field]: value } : vol
      )
    );
  };

  const removeVolunteerExperience = (id: string) => {
    onUpdate(volunteerExperience.filter(vol => vol.id !== id));
  };

  return {
    addVolunteerExperience,
    updateVolunteerExperience,
    removeVolunteerExperience
  };
};
