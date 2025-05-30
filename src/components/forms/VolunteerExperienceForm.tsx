
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Plus } from 'lucide-react';
import { VolunteerExperience } from '@/types/resume';

interface VolunteerExperienceFormProps {
  volunteerExperience: VolunteerExperience[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof VolunteerExperience, value: string | boolean) => void;
  onRemove: (id: string) => void;
}

const VolunteerExperienceForm: React.FC<VolunteerExperienceFormProps> = ({
  volunteerExperience,
  onAdd,
  onUpdate,
  onRemove
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Volunteer Experience
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Volunteer Experience
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {volunteerExperience.map((volunteer) => (
          <div key={volunteer.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(volunteer.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`vol-org-${volunteer.id}`}>Organization</Label>
                <Input
                  id={`vol-org-${volunteer.id}`}
                  value={volunteer.organization}
                  onChange={(e) => onUpdate(volunteer.id, 'organization', e.target.value)}
                  placeholder="Red Cross, Local Food Bank..."
                />
              </div>
              
              <div>
                <Label htmlFor={`vol-role-${volunteer.id}`}>Role</Label>
                <Input
                  id={`vol-role-${volunteer.id}`}
                  value={volunteer.role}
                  onChange={(e) => onUpdate(volunteer.id, 'role', e.target.value)}
                  placeholder="Volunteer Coordinator, Tutor..."
                />
              </div>
              
              <div>
                <Label htmlFor={`vol-start-${volunteer.id}`}>Start Date</Label>
                <Input
                  id={`vol-start-${volunteer.id}`}
                  type="date"
                  value={volunteer.startDate}
                  onChange={(e) => onUpdate(volunteer.id, 'startDate', e.target.value)}
                />
              </div>
              
              <div>
                <Label htmlFor={`vol-end-${volunteer.id}`}>End Date</Label>
                <Input
                  id={`vol-end-${volunteer.id}`}
                  type="date"
                  value={volunteer.endDate}
                  onChange={(e) => onUpdate(volunteer.id, 'endDate', e.target.value)}
                  disabled={volunteer.current}
                />
              </div>
              
              <div className="md:col-span-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`vol-current-${volunteer.id}`}
                    checked={volunteer.current}
                    onCheckedChange={(checked) => onUpdate(volunteer.id, 'current', !!checked)}
                  />
                  <Label htmlFor={`vol-current-${volunteer.id}`}>
                    I currently volunteer here
                  </Label>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <Label htmlFor={`vol-description-${volunteer.id}`}>Description</Label>
                <div className="mt-2">
                  <Textarea
                    id={`vol-description-${volunteer.id}`}
                    value={volunteer.description}
                    onChange={(e) => onUpdate(volunteer.id, 'description', e.target.value)}
                    placeholder="Describe your volunteer activities and achievements. Use bullet points and formatting to make your experience stand out."
                    className="min-h-[100px] resize-y"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use line breaks and bullet points (•) to organize your content clearly.
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {volunteerExperience.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No volunteer experience added yet. Click "Add Volunteer Experience" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VolunteerExperienceForm;
