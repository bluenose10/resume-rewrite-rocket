
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/RichTextEditor';

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
              <RichTextEditor
                value={personalStatement}
                onChange={onPersonalStatementChange}
                placeholder="Write a compelling personal statement that highlights your passion and goals. Use the toolbar to format with bullet points, bold text, and paragraphs."
                minHeight="120px"
              />
            </div>
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
              <RichTextEditor
                value={summary}
                onChange={onSummaryChange}
                placeholder="Write a brief summary of your professional background, key skills, and achievements. Format with bullet points and emphasis as needed."
                minHeight="120px"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PersonalStatementForm;
