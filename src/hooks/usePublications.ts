
import { Publication } from '@/types/resume';

interface UsePublicationsProps {
  publications: Publication[];
  onUpdate: (publications: Publication[]) => void;
}

export const usePublications = ({ publications, onUpdate }: UsePublicationsProps) => {
  const addPublication = () => {
    const newPublication: Publication = {
      id: Date.now().toString(),
      title: '',
      authors: '',
      publication: '',
      date: '',
      link: ''
    };
    onUpdate([...publications, newPublication]);
  };

  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    onUpdate(
      publications.map(pub => 
        pub.id === id ? { ...pub, [field]: value } : pub
      )
    );
  };

  const removePublication = (id: string) => {
    onUpdate(publications.filter(pub => pub.id !== id));
  };

  return {
    addPublication,
    updatePublication,
    removePublication
  };
};
