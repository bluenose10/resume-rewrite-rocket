
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RichTextEditor } from '@/components/ui/rich-text-editor';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Experience } from '@/types/resume';

interface ExperienceFormProps {
  experience: Experience[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Experience, value: string | boolean) => void;
  onRemove: (id: string) => void;
}

const ExperienceForm: React.FC<ExperienceFormProps> = ({
  experience,
  onAdd,
  onUpdate,
  onRemove
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl">Work Experience</CardTitle>
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Experience
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {experience.map((exp, index) => (
          <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Experience {index + 1}</h4>
              <Button
                onClick={() => onRemove(exp.id)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Company</Label>
                <Input
                  value={exp.company}
                  onChange={(e) => onUpdate(exp.id, 'company', e.target.value)}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <Label>Position</Label>
                <Input
                  value={exp.position}
                  onChange={(e) => onUpdate(exp.id, 'position', e.target.value)}
                  placeholder="Job Title"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={exp.startDate}
                  onChange={(e) => onUpdate(exp.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={exp.endDate}
                  onChange={(e) => onUpdate(exp.id, 'endDate', e.target.value)}
                  disabled={exp.current}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id={`current-${exp.id}`}
                checked={exp.current}
                onChange={(e) => onUpdate(exp.id, 'current', e.target.checked)}
              />
              <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
            </div>

            <div>
              <Label>Description</Label>
              <div className="mt-2">
                <RichTextEditor
                  value={exp.description}
                  onChange={(value) => onUpdate(exp.id, 'description', value)}
                  placeholder="Describe your role, responsibilities, and achievements. Use bullet points to highlight key accomplishments."
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use bullet points for achievements and bold text to emphasize key skills or results.
              </p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ExperienceForm;
