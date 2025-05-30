
import { useState } from 'react';
import { PersonalInfo } from '@/types/resume';

interface UsePersonalInfoProps {
  initialPersonalInfo: PersonalInfo;
  onUpdate: (personalInfo: PersonalInfo) => void;
}

export const usePersonalInfo = ({ initialPersonalInfo, onUpdate }: UsePersonalInfoProps) => {
  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    const updated = { ...initialPersonalInfo, [field]: value };
    onUpdate(updated);
  };

  return {
    updatePersonalInfo
  };
};
