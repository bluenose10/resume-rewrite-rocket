
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { Education } from '@/types/resume';

interface EducationFormProps {
  education: Education[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Education, value: string) => void;
  onRemove: (id: string) => void;
}

const EducationForm: React.FC<EducationFormProps> = ({
  education,
  onAdd,
  onUpdate,
  onRemove
}) => {
  const degreeClassifications = [
    { value: 'first', label: '1st' },
    { value: 'upper-second', label: '2:1' },
    { value: 'lower-second', label: '2:2' },
    { value: 'third', label: '3rd' },
    { value: 'pass', label: 'Pass' }
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-xl">Education</CardTitle>
        <Button onClick={onAdd} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Education
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        {education.map((edu, index) => (
          <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Education {index + 1}</h4>
              <Button
                onClick={() => onRemove(edu.id)}
                variant="ghost"
                size="sm"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div>
              <Label>Institution</Label>
              <Input
                value={edu.institution}
                onChange={(e) => onUpdate(edu.id, 'institution', e.target.value)}
                placeholder="University Name"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Degree</Label>
                <Input
                  value={edu.degree}
                  onChange={(e) => onUpdate(edu.id, 'degree', e.target.value)}
                  placeholder="BSc, BA, MSc, etc."
                />
              </div>
              <div>
                <Label>Field of Study</Label>
                <Input
                  value={edu.field}
                  onChange={(e) => onUpdate(edu.id, 'field', e.target.value)}
                  placeholder="Computer Science, Engineering, etc."
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Start Date</Label>
                <Input
                  type="month"
                  value={edu.startDate}
                  onChange={(e) => onUpdate(edu.id, 'startDate', e.target.value)}
                />
              </div>
              <div>
                <Label>End Date</Label>
                <Input
                  type="month"
                  value={edu.endDate}
                  onChange={(e) => onUpdate(edu.id, 'endDate', e.target.value)}
                />
              </div>
              <div>
                <Label>Degree Classification</Label>
                <Select
                  value={edu.classification || ''}
                  onValueChange={(value) => onUpdate(edu.id, 'classification', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Optional" />
                  </SelectTrigger>
                  <SelectContent>
                    {degreeClassifications.map((classification) => (
                      <SelectItem key={classification.value} value={classification.value}>
                        {classification.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default EducationForm;
