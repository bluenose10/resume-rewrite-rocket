
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash2 } from 'lucide-react';
import { Project } from '@/types/resume';

interface ProjectsFormProps {
  projects: Project[];
  onAdd: () => void;
  onUpdate: (id: string, field: keyof Project, value: string) => void;
  onRemove: (id: string) => void;
}

const ProjectsForm: React.FC<ProjectsFormProps> = ({
  projects,
  onAdd,
  onUpdate,
  onRemove,
}) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Projects</CardTitle>
          <Button onClick={onAdd} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="p-4 border rounded-lg space-y-3">
            <div className="flex justify-between items-start">
              <h4 className="font-medium">Project {projects.indexOf(project) + 1}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemove(project.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <Label htmlFor={`project-name-${project.id}`}>Project Name</Label>
                <Input
                  id={`project-name-${project.id}`}
                  value={project.name}
                  onChange={(e) => onUpdate(project.id, 'name', e.target.value)}
                  placeholder="Project name"
                />
              </div>
              <div>
                <Label htmlFor={`project-link-${project.id}`}>Project Link</Label>
                <Input
                  id={`project-link-${project.id}`}
                  value={project.link}
                  onChange={(e) => onUpdate(project.id, 'link', e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor={`project-description-${project.id}`}>Description</Label>
              <div className="mt-2">
                <Textarea
                  id={`project-description-${project.id}`}
                  value={project.description}
                  onChange={(e) => onUpdate(project.id, 'description', e.target.value)}
                  placeholder="Describe the project and your contributions. Use bullet points to highlight key achievements and technologies used."
                  className="min-h-[100px] resize-y"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Tip: Use line breaks and bullet points (•) to organize your content clearly.
              </p>
            </div>
            
            <div>
              <Label htmlFor={`project-technologies-${project.id}`}>Technologies</Label>
              <Input
                id={`project-technologies-${project.id}`}
                value={project.technologies}
                onChange={(e) => onUpdate(project.id, 'technologies', e.target.value)}
                placeholder="React, Node.js, MongoDB, etc."
              />
            </div>
          </div>
        ))}
        
        {projects.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p>No projects added yet. Click "Add Project" to get started.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ProjectsForm;
