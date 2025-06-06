
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

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
            <div className="mt-2">
              <Textarea
                id="personal-statement"
                value={personalStatement}
                onChange={(e) => onPersonalStatementChange(e.target.value)}
                placeholder="Write a compelling personal statement that highlights your passion and goals. Use bullet points and formatting to make your statement stand out."
                className="min-h-[120px] resize-y"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tip: Use line breaks and bullet points (•) to organize your content clearly.
            </p>
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
            <div className="mt-2">
              <Textarea
                id="summary"
                value={summary}
                onChange={(e) => onSummaryChange(e.target.value)}
                placeholder="Write a brief summary of your professional background, key skills, and achievements. Use bullet points and emphasis as needed."
                className="min-h-[120px] resize-y"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Tip: Use line breaks and bullet points (•) to organize your content clearly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalStatementForm;
