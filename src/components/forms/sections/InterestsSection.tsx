
import React from 'react';
import InterestsForm from '../InterestsForm';

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
    <InterestsForm
      interests={interests}
      newInterest={newInterest}
      onNewInterestChange={onNewInterestChange}
      onAddInterest={onAddInterest}
      onRemoveInterest={onRemoveInterest}
    />
  );
};

export default InterestsSection;
