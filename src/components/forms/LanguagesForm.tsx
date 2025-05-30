
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Plus } from 'lucide-react';
import { Language } from '@/types/resume';

interface LanguagesFormProps {
  languages: Language[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Language, value: string) => void;
  onRemove: (id: string) => void;
}

const LanguagesForm: React.FC<LanguagesFormProps> = ({
  languages,
  onAdd,
  onUpdate,
  onRemove
}) => {
  const proficiencyLevels: Language['proficiency'][] = [
    'Beginner', 'Intermediate', 'Advanced', 'Fluent', 'Native'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Languages
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Language
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {languages.map((lang) => (
          <div key={lang.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(lang.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`lang-name-${lang.id}`}>Language</Label>
                <Input
                  id={`lang-name-${lang.id}`}
                  value={lang.language}
                  onChange={(e) => onUpdate(lang.id, 'language', e.target.value)}
                  placeholder="Spanish, French, Mandarin..."
                />
              </div>
              
              <div>
                <Label htmlFor={`lang-proficiency-${lang.id}`}>Proficiency Level</Label>
                <Select
                  value={lang.proficiency}
                  onValueChange={(value: Language['proficiency']) => onUpdate(lang.id, 'proficiency', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select proficiency level" />
                  </SelectTrigger>
                  <SelectContent>
                    {proficiencyLevels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        ))}
        
        {languages.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No languages added yet. Click "Add Language" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LanguagesForm;
