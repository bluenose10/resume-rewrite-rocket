
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import SkillsForm from '../SkillsForm';

interface InterestsSectionProps {
  interests: string[];
  newInterest: string;
  onNewInterestChange: (value: string) => void;
  onAddInterest: () => void;
  onRemoveInterest: (index: number) => void;
}

const InterestsSection: React.FC<InterestsSectionProps> = ({
  interests,
  newInterest,
  onNewInterestChange,
  onAddInterest,
  onRemoveInterest
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Interests & Hobbies</CardTitle>
      </CardHeader>
      <CardContent>
        <SkillsForm
          skills={[]}
          interests={interests}
          newSkill=""
          newInterest={newInterest}
          onNewSkillChange={() => {}}
          onNewInterestChange={onNewInterestChange}
          onAddSkill={() => {}}
          onAddInterest={onAddInterest}
          onRemoveSkill={() => {}}
          onRemoveInterest={onRemoveInterest}
        />
      </CardContent>
    </Card>
  );
};

export default InterestsSection;
