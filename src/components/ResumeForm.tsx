
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
}

interface ResumeFormProps {
  onDataChange: (data: ResumeData) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ onDataChange, onOptimize, isOptimizing }) => {
  const { toast } = useToast();
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: []
  });

  const [newSkill, setNewSkill] = useState('');

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    const updated = {
      ...resumeData,
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updateSummary = (value: string) => {
    const updated = { ...resumeData, summary: value };
    setResumeData(updated);
    onDataChange(updated);
  };

  const addExperience = () => {
    const newExp: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    const updated = {
      ...resumeData,
      experience: [...resumeData.experience, newExp]
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    const updated = {
      ...resumeData,
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const removeExperience = (id: string) => {
    const updated = {
      ...resumeData,
      experience: resumeData.experience.filter(exp => exp.id !== id)
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const addEducation = () => {
    const newEdu: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    const updated = {
      ...resumeData,
      education: [...resumeData.education, newEdu]
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    const updated = {
      ...resumeData,
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const removeEducation = (id: string) => {
    const updated = {
      ...resumeData,
      education: resumeData.education.filter(edu => edu.id !== id)
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    const updated = {
      ...resumeData,
      projects: [...resumeData.projects, newProject]
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    const updated = {
      ...resumeData,
      projects: resumeData.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const removeProject = (id: string) => {
    const updated = {
      ...resumeData,
      projects: resumeData.projects.filter(proj => proj.id !== id)
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const updated = {
        ...resumeData,
        skills: [...resumeData.skills, newSkill.trim()]
      };
      setResumeData(updated);
      onDataChange(updated);
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    const updated = {
      ...resumeData,
      skills: resumeData.skills.filter((_, i) => i !== index)
    };
    setResumeData(updated);
    onDataChange(updated);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                value={resumeData.personalInfo.firstName}
                onChange={(e) => updatePersonalInfo('firstName', e.target.value)}
                placeholder="John"
              />
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                value={resumeData.personalInfo.lastName}
                onChange={(e) => updatePersonalInfo('lastName', e.target.value)}
                placeholder="Doe"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={resumeData.personalInfo.email}
                onChange={(e) => updatePersonalInfo('email', e.target.value)}
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={resumeData.personalInfo.phone}
                onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={resumeData.personalInfo.location}
              onChange={(e) => updatePersonalInfo('location', e.target.value)}
              placeholder="New York, NY"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="linkedin">LinkedIn</Label>
              <Input
                id="linkedin"
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                placeholder="linkedin.com/in/johndoe"
              />
            </div>
            <div>
              <Label htmlFor="github">GitHub</Label>
              <Input
                id="github"
                value={resumeData.personalInfo.github}
                onChange={(e) => updatePersonalInfo('github', e.target.value)}
                placeholder="github.com/johndoe"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="website">Website/Portfolio</Label>
            <Input
              id="website"
              value={resumeData.personalInfo.website}
              onChange={(e) => updatePersonalInfo('website', e.target.value)}
              placeholder="www.johndoe.com"
            />
          </div>
        </CardContent>
      </Card>

      {/* Professional Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Professional Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={resumeData.summary}
            onChange={(e) => updateSummary(e.target.value)}
            placeholder="Write a brief summary of your professional background and key achievements..."
            className="min-h-[120px]"
          />
        </CardContent>
      </Card>

      {/* Experience */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Work Experience</CardTitle>
          <Button onClick={addExperience} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Experience
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.experience.map((exp, index) => (
            <div key={exp.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Experience {index + 1}</h4>
                <Button
                  onClick={() => removeExperience(exp.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Company</Label>
                  <Input
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                    placeholder="Company Name"
                  />
                </div>
                <div>
                  <Label>Position</Label>
                  <Input
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                    placeholder="Job Title"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                    disabled={exp.current}
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`current-${exp.id}`}
                  checked={exp.current}
                  onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                />
                <Label htmlFor={`current-${exp.id}`}>Currently working here</Label>
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                  placeholder="Describe your role, responsibilities, and achievements..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Education */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Education</CardTitle>
          <Button onClick={addEducation} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Education
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.education.map((edu, index) => (
            <div key={edu.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Education {index + 1}</h4>
                <Button
                  onClick={() => removeEducation(edu.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label>Institution</Label>
                <Input
                  value={edu.institution}
                  onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  placeholder="University Name"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                    placeholder="Bachelor's, Master's, etc."
                  />
                </div>
                <div>
                  <Label>Field of Study</Label>
                  <Input
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                    placeholder="Computer Science, Engineering, etc."
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label>Start Date</Label>
                  <Input
                    type="month"
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>End Date</Label>
                  <Input
                    type="month"
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={edu.gpa}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                    placeholder="3.8"
                  />
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Projects */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-xl">Projects</CardTitle>
          <Button onClick={addProject} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </CardHeader>
        <CardContent className="space-y-6">
          {resumeData.projects.map((project, index) => (
            <div key={project.id} className="space-y-4 p-4 border rounded-lg">
              <div className="flex justify-between items-start">
                <h4 className="font-medium">Project {index + 1}</h4>
                <Button
                  onClick={() => removeProject(project.id)}
                  variant="ghost"
                  size="sm"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
              
              <div>
                <Label>Project Name</Label>
                <Input
                  value={project.name}
                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                  placeholder="Project Name"
                />
              </div>

              <div>
                <Label>Description</Label>
                <Textarea
                  value={project.description}
                  onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                  placeholder="Describe what the project does and your role in it..."
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label>Technologies Used</Label>
                <Input
                  value={project.technologies}
                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                  placeholder="React, Node.js, MongoDB, etc."
                />
              </div>

              <div>
                <Label>Project Link (Optional)</Label>
                <Input
                  value={project.link}
                  onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                  placeholder="https://github.com/username/project"
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Skills */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Skills</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <Input
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill..."
              onKeyDown={(e) => e.key === 'Enter' && addSkill()}
            />
            <Button onClick={addSkill} size="sm">
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {resumeData.skills.map((skill, index) => (
              <div
                key={index}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  onClick={() => removeSkill(index)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Optimize Button */}
      <Card>
        <CardContent className="pt-6">
          <Button 
            onClick={onOptimize} 
            disabled={isOptimizing}
            className="w-full"
            size="lg"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {isOptimizing ? 'Optimizing Resume...' : 'Optimize Resume with AI'}
          </Button>
          <p className="text-sm text-gray-600 mt-2 text-center">
            Our AI will enhance your content for better ATS compatibility and impact
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumeForm;
