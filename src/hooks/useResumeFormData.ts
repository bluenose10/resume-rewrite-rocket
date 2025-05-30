
import { useState, useEffect } from 'react';
import { ResumeData, ColorTheme, PersonalInfo, Experience, Education, Project, Achievement } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';

interface UseResumeFormDataProps {
  initialData?: ResumeData;
  onDataChange: (data: ResumeData) => void;
}

export const useResumeFormData = ({ initialData, onDataChange }: UseResumeFormDataProps) => {
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

  const [resumeData, setResumeData] = useState<ResumeData>(() => {
    const initial = getInitialResumeData();
    // Ensure theme is always set
    if (!initial.theme) {
      initial.theme = DEFAULT_THEMES[1];
    }
    return initial;
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');

  useEffect(() => {
    if (initialData) {
      const dataWithTheme = {
        ...initialData,
        theme: initialData.theme || DEFAULT_THEMES[1]
      };
      setResumeData(dataWithTheme);
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
      classification: ''
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

  const addProject = () => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    updateData({ projects: [...resumeData.projects, newProject] });
  };

  const updateProject = (id: string, field: keyof Project, value: string) => {
    updateData({
      projects: resumeData.projects.map(proj => 
        proj.id === id ? { ...proj, [field]: value } : proj
      )
    });
  };

  const removeProject = (id: string) => {
    updateData({
      projects: resumeData.projects.filter(proj => proj.id !== id)
    });
  };

  const addAchievement = () => {
    const newAchievement: Achievement = {
      id: Date.now().toString(),
      title: '',
      description: '',
      date: '',
      organization: ''
    };
    updateData({ achievements: [...resumeData.achievements, newAchievement] });
  };

  const updateAchievement = (id: string, field: keyof Achievement, value: string) => {
    updateData({
      achievements: resumeData.achievements.map(ach => 
        ach.id === id ? { ...ach, [field]: value } : ach
      )
    });
  };

  const removeAchievement = (id: string) => {
    updateData({
      achievements: resumeData.achievements.filter(ach => ach.id !== id)
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

  return {
    resumeData,
    newSkill,
    newInterest,
    setNewSkill,
    setNewInterest,
    updatePersonalInfo,
    updatePersonalStatement,
    updateSummary,
    updateTheme,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addProject,
    updateProject,
    removeProject,
    addAchievement,
    updateAchievement,
    removeAchievement,
    addSkill,
    removeSkill,
    addInterest,
    removeInterest
  };
};
