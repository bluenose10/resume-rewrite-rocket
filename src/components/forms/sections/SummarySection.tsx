
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface SummarySectionProps {
  value: string;
  onChange: (value: string) => void;
}

const SummarySection: React.FC<SummarySectionProps> = ({
  value,
  onChange
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Professional Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Write a brief summary of your professional background, key skills, and achievements"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
