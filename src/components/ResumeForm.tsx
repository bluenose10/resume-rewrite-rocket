
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import ColorThemeSelector from './ColorThemeSelector';
import PersonalInfoForm from './forms/PersonalInfoForm';
import ExperienceForm from './forms/ExperienceForm';
import EducationForm from './forms/EducationForm';
import SkillsForm from './forms/SkillsForm';
import { ResumeData, ColorTheme, PersonalInfo, Experience, Education, Project, Achievement, Certification, Language, VolunteerExperience, Reference, Publication } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';

interface ResumeFormProps {
  initialData?: ResumeData;
  onDataChange: (data: ResumeData) => void;
  onOptimize: () => void;
  isOptimizing: boolean;
}

const ResumeForm: React.FC<ResumeFormProps> = ({ initialData, onDataChange, onOptimize, isOptimizing }) => {
  const { toast } = useToast();
  
  const getInitialResumeData = (): ResumeData => {
    return initialData || {
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
      personalStatement: '',
      summary: '',
      experience: [],
      education: [],
      projects: [],
      skills: [],
      achievements: [],
      certifications: [],
      languages: [],
      volunteerExperience: [],
      references: [],
      publications: [],
      interests: [],
      theme: DEFAULT_THEMES[1]
    };
  };

  const [resumeData, setResumeData] = useState<ResumeData>(getInitialResumeData());
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  // Sync form state when initialData changes
  useEffect(() => {
    if (initialData) {
      setResumeData(initialData);
    }
  }, [initialData]);

  const updateData = (updates: Partial<ResumeData>) => {
    const updated = { ...resumeData, ...updates };
    setResumeData(updated);
    onDataChange(updated);
  };

  const updatePersonalInfo = (field: keyof PersonalInfo, value: string) => {
    updateData({
      personalInfo: { ...resumeData.personalInfo, [field]: value }
    });
  };

  const updatePersonalStatement = (value: string) => {
    updateData({ personalStatement: value });
  };

  const updateSummary = (value: string) => {
    updateData({ summary: value });
  };

  const updateTheme = (theme: ColorTheme) => {
    updateData({ theme });
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
    updateData({ experience: [...resumeData.experience, newExp] });
  };

  const updateExperience = (id: string, field: keyof Experience, value: string | boolean) => {
    updateData({
      experience: resumeData.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    });
  };

  const removeExperience = (id: string) => {
    updateData({
      experience: resumeData.experience.filter(exp => exp.id !== id)
    });
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
    updateData({ education: [...resumeData.education, newEdu] });
  };

  const updateEducation = (id: string, field: keyof Education, value: string) => {
    updateData({
      education: resumeData.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    });
  };

  const removeEducation = (id: string) => {
    updateData({
      education: resumeData.education.filter(edu => edu.id !== id)
    });
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      updateData({ skills: [...resumeData.skills, newSkill.trim()] });
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    updateData({ skills: resumeData.skills.filter((_, i) => i !== index) });
  };

  const addInterest = () => {
    if (newInterest.trim()) {
      updateData({ interests: [...resumeData.interests, newInterest.trim()] });
      setNewInterest('');
    }
  };

  const removeInterest = (index: number) => {
    updateData({ interests: resumeData.interests.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Color Theme Selection */}
      <ColorThemeSelector
        selectedTheme={resumeData.theme || DEFAULT_THEMES[1]}
        onThemeChange={updateTheme}
      />

      {/* Personal Information, Statement, and Summary */}
      <PersonalInfoForm
        personalInfo={resumeData.personalInfo}
        personalStatement={resumeData.personalStatement}
        summary={resumeData.summary}
        onPersonalInfoChange={updatePersonalInfo}
        onPersonalStatementChange={updatePersonalStatement}
        onSummaryChange={updateSummary}
      />

      {/* Experience */}
      <ExperienceForm
        experience={resumeData.experience}
        onAdd={addExperience}
        onUpdate={updateExperience}
        onRemove={removeExperience}
      />

      {/* Education */}
      <EducationForm
        education={resumeData.education}
        onAdd={addEducation}
        onUpdate={updateEducation}
        onRemove={removeEducation}
      />

      {/* Skills and Interests */}
      <SkillsForm
        skills={resumeData.skills}
        interests={resumeData.interests}
        newSkill={newSkill}
        newInterest={newInterest}
        onNewSkillChange={setNewSkill}
        onNewInterestChange={setNewInterest}
        onAddSkill={addSkill}
        onAddInterest={addInterest}
        onRemoveSkill={removeSkill}
        onRemoveInterest={removeInterest}
      />

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
