
import { Reference } from '@/types/resume';

interface UseReferencesProps {
  references: Reference[];
  onUpdate: (references: Reference[]) => void;
}

export const useReferences = ({ references, onUpdate }: UseReferencesProps) => {
  const addReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    onUpdate([...references, newReference]);
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    onUpdate(
      references.map(ref => 
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    );
  };

  const removeReference = (id: string) => {
    onUpdate(references.filter(ref => ref.id !== id));
  };

  return {
    addReference,
    updateReference,
    removeReference
  };
};
