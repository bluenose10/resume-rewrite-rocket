
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { Achievement } from '@/types/resume';

interface AchievementsFormProps {
  achievements: Achievement[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Achievement, value: string) => void;
  onRemove: (id: string) => void;
}

const AchievementsForm: React.FC<AchievementsFormProps> = ({
  achievements,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Achievements & Awards</CardTitle>
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Achievement
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {achievements.map((achievement) => (
          <div key={achievement.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Achievement {achievements.indexOf(achievement) + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(achievement.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`achievement-title-${achievement.id}`}>Title</Label>
                <Input
                  id={`achievement-title-${achievement.id}`}
                  value={achievement.title}
                  onChange={(e) => onUpdate(achievement.id, 'title', e.target.value)}
                  placeholder="Achievement title"
                />
              </div>
              <div>
                <Label htmlFor={`achievement-date-${achievement.id}`}>Date</Label>
                <Input
                  id={`achievement-date-${achievement.id}`}
                  type="date"
                  value={achievement.date}
                  onChange={(e) => onUpdate(achievement.id, 'date', e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`achievement-organization-${achievement.id}`}>Organization</Label>
              <Input
                id={`achievement-organization-${achievement.id}`}
                value={achievement.organization}
                onChange={(e) => onUpdate(achievement.id, 'organization', e.target.value)}
                placeholder="Awarding organization"
              />
            </div>
            
            <div>
              <Label htmlFor={`achievement-description-${achievement.id}`}>Description</Label>
              <Textarea
                id={`achievement-description-${achievement.id}`}
                value={achievement.description}
                onChange={(e) => onUpdate(achievement.id, 'description', e.target.value)}
                placeholder="Describe the achievement and its significance"
                rows={3}
              />
            </div>
          </div>
        ))}
        
        {achievements.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No achievements added yet. Click "Add Achievement" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AchievementsForm;
