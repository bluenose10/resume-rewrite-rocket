
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import SectionTooltip from '@/components/help/SectionTooltip';

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
        <CardTitle className="flex items-center gap-2">
          Professional Summary
          <SectionTooltip content="Write 2-3 sentences highlighting your key skills and achievements. Focus on what makes you valuable to employers." />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <Label htmlFor="summary">Professional Summary</Label>
          <Textarea
            id="summary"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Example: 'Experienced Frontend Developer with 3+ years building React applications that improved user engagement by 40%. Specialized in creating responsive, accessible interfaces with TypeScript and modern CSS frameworks.'"
            rows={4}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
