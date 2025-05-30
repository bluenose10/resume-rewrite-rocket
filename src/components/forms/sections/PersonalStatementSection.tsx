
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
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
          <RichTextEditor
            id="personal-statement"
            value={value}
            onChange={onChange}
            placeholder="Write a compelling personal statement that highlights your passion and goals. Use formatting to make it stand out."
            className="mt-2"
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default PersonalStatementSection;
