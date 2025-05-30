
import React from 'react';
import SkillsOnlyForm from '../SkillsOnlyForm';

interface SkillsSectionProps {
  skills: string[];
  newSkill: string;
  onNewSkillChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
}

const SkillsSection: React.FC<SkillsSectionProps> = ({
  skills,
  newSkill,
  onNewSkillChange,
  onAddSkill,
  onRemoveSkill
}) => {
  return (
    <SkillsOnlyForm
      skills={skills}
      newSkill={newSkill}
      onNewSkillChange={onNewSkillChange}
      onAddSkill={onAddSkill}
      onRemoveSkill={onRemoveSkill}
    />
  );
};

export default SkillsSection;
