
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Trash2, Plus } from 'lucide-react';
import { Publication } from '@/types/resume';

interface PublicationsFormProps {
  publications: Publication[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Publication, value: string) => void;
  onRemove: (id: string) => void;
}

const PublicationsForm: React.FC<PublicationsFormProps> = ({
  publications,
  onAdd,
  onUpdate,
  onRemove
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Publications
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Publication
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {publications.map((pub) => (
          <div key={pub.id} className="border rounded-lg p-4 space-y-4">
            <div className="flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(pub.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor={`pub-title-${pub.id}`}>Publication Title</Label>
                <Input
                  id={`pub-title-${pub.id}`}
                  value={pub.title}
                  onChange={(e) => onUpdate(pub.id, 'title', e.target.value)}
                  placeholder="Title of your publication"
                />
              </div>
              
              <div>
                <Label htmlFor={`pub-authors-${pub.id}`}>Authors</Label>
                <Textarea
                  id={`pub-authors-${pub.id}`}
                  value={pub.authors}
                  onChange={(e) => onUpdate(pub.id, 'authors', e.target.value)}
                  placeholder="List all authors (e.g., Smith, J., Doe, A., Johnson, B.)"
                  rows={2}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`pub-publication-${pub.id}`}>Publication/Journal</Label>
                  <Input
                    id={`pub-publication-${pub.id}`}
                    value={pub.publication}
                    onChange={(e) => onUpdate(pub.id, 'publication', e.target.value)}
                    placeholder="Journal name, conference, etc."
                  />
                </div>
                
                <div>
                  <Label htmlFor={`pub-date-${pub.id}`}>Publication Date</Label>
                  <Input
                    id={`pub-date-${pub.id}`}
                    type="date"
                    value={pub.date}
                    onChange={(e) => onUpdate(pub.id, 'date', e.target.value)}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor={`pub-link-${pub.id}`}>Link (Optional)</Label>
                <Input
                  id={`pub-link-${pub.id}`}
                  value={pub.link}
                  onChange={(e) => onUpdate(pub.id, 'link', e.target.value)}
                  placeholder="https://doi.org/..."
                />
              </div>
            </div>
          </div>
        ))}
        
        {publications.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No publications added yet. Click "Add Publication" to get started.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PublicationsForm;
