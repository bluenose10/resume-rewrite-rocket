
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PersonalStatementSectionProps {
  value: string;
  onChange: (value: string) => void;
}

const PersonalStatementSection: React.FC<PersonalStatementSectionProps> = ({
  value,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Personal Statement</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="personal-statement">Personal Statement</Label>
          <Textarea
            id="personal-statement"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write a compelling personal statement that highlights your passion and goals"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalStatementSection;
