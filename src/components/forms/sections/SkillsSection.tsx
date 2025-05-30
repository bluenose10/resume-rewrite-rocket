
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillsForm from '../SkillsForm';

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
    <Card>
      <CardHeader>
        <CardTitle>Technical Skills</CardTitle>
      </CardHeader>
      <CardContent>
        <SkillsForm
          skills={skills}
          interests={[]}
          newSkill={newSkill}
          newInterest=""
          onNewSkillChange={onNewSkillChange}
          onNewInterestChange={() => {}}
          onAddSkill={onAddSkill}
          onAddInterest={() => {}}
          onRemoveSkill={onRemoveSkill}
          onRemoveInterest={() => {}}
        />
      </CardContent>
    </Card>
  );
};

export default SkillsSection;
