
import { useState } from 'react';

interface UseSkillsAndInterestsProps {
  skills: string[];
  interests: string[];
  onUpdateSkills: (skills: string[]) => void;
  onUpdateInterests: (interests: string[]) => void;
}

export const useSkillsAndInterests = ({ 
  skills, 
  interests, 
  onUpdateSkills, 
  onUpdateInterests 
}: UseSkillsAndInterestsProps) => {
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      onUpdateSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    onUpdateSkills(skills.filter((_, i) => i !== index));
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      onUpdateInterests([...interests, newInterest.trim()]);
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    onUpdateInterests(interests.filter((_, i) => i !== index));
  };

  return {
    newSkill,
    newInterest,
    setNewSkill,
    setNewInterest,
    addSkill,
    removeSkill,
    addInterest,
    removeInterest
  };
};
