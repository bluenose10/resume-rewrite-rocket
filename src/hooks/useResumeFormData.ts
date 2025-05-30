import { useState, useEffect } from 'react';
import { ResumeData, ColorTheme, PersonalInfo, Experience, Education, Project, Achievement, Certification, Language, VolunteerExperience, Publication, Reference } from '@/types/resume';
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

  // Certification functions
  const addCertification = () => {
    const newCertification: Certification = {
      id: Date.now().toString(),
      name: '',
      issuer: '',
      date: '',
      expiryDate: '',
      credentialId: ''
    };
    updateData({ certifications: [...resumeData.certifications, newCertification] });
  };

  const updateCertification = (id: string, field: keyof Certification, value: string) => {
    updateData({
      certifications: resumeData.certifications.map(cert => 
        cert.id === id ? { ...cert, [field]: value } : cert
      )
    });
  };

  const removeCertification = (id: string) => {
    updateData({
      certifications: resumeData.certifications.filter(cert => cert.id !== id)
    });
  };

  // Language functions
  const addLanguage = () => {
    const newLanguage: Language = {
      id: Date.now().toString(),
      language: '',
      proficiency: 'Beginner'
    };
    updateData({ languages: [...resumeData.languages, newLanguage] });
  };

  const updateLanguage = (id: string, field: keyof Language, value: string) => {
    updateData({
      languages: resumeData.languages.map(lang => 
        lang.id === id ? { ...lang, [field]: value } : lang
      )
    });
  };

  const removeLanguage = (id: string) => {
    updateData({
      languages: resumeData.languages.filter(lang => lang.id !== id)
    });
  };

  // Volunteer Experience functions
  const addVolunteerExperience = () => {
    const newVolunteer: VolunteerExperience = {
      id: Date.now().toString(),
      organization: '',
      role: '',
      startDate: '',
      endDate: '',
      current: false,
      description: ''
    };
    updateData({ volunteerExperience: [...resumeData.volunteerExperience, newVolunteer] });
  };

  const updateVolunteerExperience = (id: string, field: keyof VolunteerExperience, value: string | boolean) => {
    updateData({
      volunteerExperience: resumeData.volunteerExperience.map(vol => 
        vol.id === id ? { ...vol, [field]: value } : vol
      )
    });
  };

  const removeVolunteerExperience = (id: string) => {
    updateData({
      volunteerExperience: resumeData.volunteerExperience.filter(vol => vol.id !== id)
    });
  };

  // Publication functions
  const addPublication = () => {
    const newPublication: Publication = {
      id: Date.now().toString(),
      title: '',
      authors: '',
      publication: '',
      date: '',
      link: ''
    };
    updateData({ publications: [...resumeData.publications, newPublication] });
  };

  const updatePublication = (id: string, field: keyof Publication, value: string) => {
    updateData({
      publications: resumeData.publications.map(pub => 
        pub.id === id ? { ...pub, [field]: value } : pub
      )
    });
  };

  const removePublication = (id: string) => {
    updateData({
      publications: resumeData.publications.filter(pub => pub.id !== id)
    });
  };

  // Reference functions
  const addReference = () => {
    const newReference: Reference = {
      id: Date.now().toString(),
      name: '',
      title: '',
      company: '',
      email: '',
      phone: '',
      relationship: ''
    };
    updateData({ references: [...resumeData.references, newReference] });
  };

  const updateReference = (id: string, field: keyof Reference, value: string) => {
    updateData({
      references: resumeData.references.map(ref => 
        ref.id === id ? { ...ref, [field]: value } : ref
      )
    });
  };

  const removeReference = (id: string) => {
    updateData({
      references: resumeData.references.filter(ref => ref.id !== id)
    });
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
    removeInterest,
    addCertification,
    updateCertification,
    removeCertification,
    addLanguage,
    updateLanguage,
    removeLanguage,
    addVolunteerExperience,
    updateVolunteerExperience,
    removeVolunteerExperience,
    addPublication,
    updatePublication,
    removePublication,
    addReference,
    updateReference,
    removeReference
  };
};
