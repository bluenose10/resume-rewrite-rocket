
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
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
          <div className="mt-2">
            <RichTextEditor
              id="summary"
              value={value}
              onChange={onChange}
              placeholder="Example: 'Experienced Frontend Developer with 3+ years building React applications that improved user engagement by 40%. Specialized in creating responsive, accessible interfaces with TypeScript and modern CSS frameworks.'"
            />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Tip: Use formatting to highlight key achievements and skills.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SummarySection;
