
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Trash2 } from 'lucide-react';

interface InterestsFormProps {
  interests: string[];
  newInterest: string;
  onNewInterestChange: (value: string) => void;
  onAddInterest: () => void;
  onRemoveInterest: (index: number) => void;
}

const InterestsForm: React.FC<InterestsFormProps> = ({
  interests,
  newInterest,
  onNewInterestChange,
  onAddInterest,
  onRemoveInterest
}) => {
  console.log('InterestsForm props:', { interests, newInterest }); // Debug log

  return (
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
  );
};

export default InterestsForm;
