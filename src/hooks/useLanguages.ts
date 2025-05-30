
import { Language } from '@/types/resume';

interface UseLanguagesProps {
  languages: Language[];
  onUpdate: (languages: Language[]) => void;
}

export const useLanguages = ({ languages, onUpdate }: UseLanguagesProps) => {
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'Beginner'
    };
    onUpdate([...languages, newLanguage]);
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    onUpdate(
      languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    );
  };

  const removeLanguage = (id: string) => {
    onUpdate(languages.filter(lang => lang.id !== id));
  };

  return {
    addLanguage,
    updateLanguage,
    removeLanguage
  };
};
