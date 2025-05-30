
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface SkillsFormProps {
  skills: string[];
  interests: string[];
  newSkill: string;
  newInterest: string;
  onNewSkillChange: (value: string) => void;
  onNewInterestChange: (value: string) => void;
  onAddSkill: () => void;
  onAddInterest: () => void;
  onRemoveSkill: (index: number) => void;
  onRemoveInterest: (index: number) => void;
}

const SkillsForm: React.FC<SkillsFormProps> = ({
  skills,
  interests,
  newSkill,
  newInterest,
  onNewSkillChange,
  onNewInterestChange,
  onAddSkill,
  onAddInterest,
  onRemoveSkill,
  onRemoveInterest
}) => {
  console.log('SkillsForm props:', { skills, interests, newSkill, newInterest }); // Debug log

  return (
    <>
      {/* Skills */}
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

      {/* Interests & Hobbies */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Interests & Hobbies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newInterest}
              onChange={(e) => {
                console.log('Interests input onChange:', e.target.value); // Debug log
                onNewInterestChange(e.target.value);
              }}
              placeholder="Add an interest..."
              onKeyDown={(e) => {
                console.log('Interests input onKeyDown:', e.key); // Debug log
                if (e.key === 'Enter') {
                  e.preventDefault();
                  onAddInterest();
                }
              }}
            />
            <Button onClick={() => {
              console.log('Add interest button clicked'); // Debug log
              onAddInterest();
            }} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {interests.map((interest, index) => (
              <div
                key={index}
                className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {interest}
                <button
                  onClick={() => onRemoveInterest(index)}
                  className="text-green-600 hover:text-green-800"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default SkillsForm;
