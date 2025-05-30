
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface PersonalStatementFormProps {
  personalStatement: string;
  summary: string;
  onPersonalStatementChange: (value: string) => void;
  onSummaryChange: (value: string) => void;
}

const PersonalStatementForm: React.FC<PersonalStatementFormProps> = ({
  personalStatement,
  summary,
  onPersonalStatementChange,
  onSummaryChange,
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Statement</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="personal-statement">Personal Statement</Label>
            <Textarea
              id="personal-statement"
              value={personalStatement}
              onChange={(e) => onPersonalStatementChange(e.target.value)}
              placeholder="Write a compelling personal statement that highlights your passion and goals"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="summary">Professional Summary</Label>
            <Textarea
              id="summary"
              value={summary}
              onChange={(e) => onSummaryChange(e.target.value)}
              placeholder="Write a brief summary of your professional background, key skills, and achievements"
              rows={4}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalStatementForm;
