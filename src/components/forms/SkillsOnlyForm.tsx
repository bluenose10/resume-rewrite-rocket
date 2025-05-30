
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsOnlyFormProps {
  skills: string[];
  newSkill: string;
  onNewSkillChange: (value: string) => void;
  onAddSkill: () => void;
  onRemoveSkill: (index: number) => void;
}

const SkillsOnlyForm: React.FC<SkillsOnlyFormProps> = ({
  skills,
  newSkill,
  onNewSkillChange,
  onAddSkill,
  onRemoveSkill
}) => {
  console.log('SkillsOnlyForm props:', { skills, newSkill }); // Debug log

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Technical Skills</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => onNewSkillChange(e.target.value)}
            placeholder="Add a skill..."
            onKeyDown={(e) => e.key === 'Enter' && onAddSkill()}
          />
          <Button onClick={onAddSkill} size="sm">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, index) => (
            <div
              key={index}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {skill}
              <button
                onClick={() => onRemoveSkill(index)}
                className="text-blue-600 hover:text-blue-800"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillsOnlyForm;
