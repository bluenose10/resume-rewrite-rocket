
import { Education } from '@/types/resume';

interface UseEducationProps {
  education: Education[];
  onUpdate: (education: Education[]) => void;
}

export const useEducation = ({ education, onUpdate }: UseEducationProps) => {
  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      classification: ''
    };
    onUpdate([...education, newEdu]);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    onUpdate(
      education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    );
  };

  const removeEducation = (id: string) => {
    onUpdate(education.filter(edu => edu.id !== id));
  };

  return {
    addEducation,
    updateEducation,
    removeEducation
  };
};
