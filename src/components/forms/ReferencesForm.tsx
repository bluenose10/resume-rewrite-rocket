
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, Plus } from 'lucide-react';
import { Reference } from '@/types/resume';

interface ReferencesFormProps {
  references: Reference[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Reference, value: string) => void;
  onRemove: (id: string) => void;
}

const ReferencesForm: React.FC<ReferencesFormProps> = ({
  references,
  onAdd,
  onUpdate,
  onRemove
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          References
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Reference
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {references.map((ref) => (
          <div key={ref.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(ref.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor={`ref-name-${ref.id}`}>Full Name</Label>
                <Input
                  id={`ref-name-${ref.id}`}
                  value={ref.name}
                  onChange={(e) => onUpdate(ref.id, 'name', e.target.value)}
                  placeholder="John Smith"
                />
              </div>
              
              <div>
                <Label htmlFor={`ref-title-${ref.id}`}>Job Title</Label>
                <Input
                  id={`ref-title-${ref.id}`}
                  value={ref.title}
                  onChange={(e) => onUpdate(ref.id, 'title', e.target.value)}
                  placeholder="Senior Manager"
                />
              </div>
              
              <div>
                <Label htmlFor={`ref-company-${ref.id}`}>Company</Label>
                <Input
                  id={`ref-company-${ref.id}`}
                  value={ref.company}
                  onChange={(e) => onUpdate(ref.id, 'company', e.target.value)}
                  placeholder="ABC Corporation"
                />
              </div>
              
              <div>
                <Label htmlFor={`ref-relationship-${ref.id}`}>Relationship</Label>
                <Input
                  id={`ref-relationship-${ref.id}`}
                  value={ref.relationship}
                  onChange={(e) => onUpdate(ref.id, 'relationship', e.target.value)}
                  placeholder="Former Manager, Colleague..."
                />
              </div>
              
              <div>
                <Label htmlFor={`ref-email-${ref.id}`}>Email</Label>
                <Input
                  id={`ref-email-${ref.id}`}
                  type="email"
                  value={ref.email}
                  onChange={(e) => onUpdate(ref.id, 'email', e.target.value)}
                  placeholder="john.smith@company.com"
                />
              </div>
              
              <div>
                <Label htmlFor={`ref-phone-${ref.id}`}>Phone</Label>
                <Input
                  id={`ref-phone-${ref.id}`}
                  value={ref.phone}
                  onChange={(e) => onUpdate(ref.id, 'phone', e.target.value)}
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
          </div>
        ))}
        
        {references.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No references added yet. Click "Add Reference" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReferencesForm;
