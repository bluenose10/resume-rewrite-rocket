
import { Project } from '@/types/resume';

interface UseProjectsProps {
  projects: Project[];
  onUpdate: (projects: Project[]) => void;
}

export const useProjects = ({ projects, onUpdate }: UseProjectsProps) => {
  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    onUpdate([...projects, newProject]);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    onUpdate(
      projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    );
  };

  const removeProject = (id: string) => {
    onUpdate(projects.filter(proj => proj.id !== id));
  };

  return {
    addProject,
    updateProject,
    removeProject
  };
};
