import { useState, useEffect } from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import { usePersonalInfo } from './usePersonalInfo';
import { useExperience } from './useExperience';
import { useEducation } from './useEducation';
import { useProjects } from './useProjects';
import { useAchievements } from './useAchievements';
import { useSkillsAndInterests } from './useSkillsAndInterests';
import { useCertifications } from './useCertifications';
import { useLanguages } from './useLanguages';
import { useVolunteerExperience } from './useVolunteerExperience';
import { usePublications } from './usePublications';
import { useReferences } from './useReferences';

interface UseResumeFormDataProps {
  initialData?: ResumeData;
  onDataChange?: (data: ResumeData) => void;
}

export const useResumeFormData = (props?: UseResumeFormDataProps) => {
  const { initialData, onDataChange } = props || {};
  
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
    if (!initial.theme) {
      initial.theme = DEFAULT_THEMES[1];
    }
    return initial;
  });

  // Sync with external changes from initialData
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
    if (onDataChange) {
      onDataChange(updated);
    }
  };

  const updateResumeData = (newData: ResumeData) => {
    setResumeData(newData);
    if (onDataChange) {
      onDataChange(newData);
    }
  };

  // Personal Info hook
  const personalInfoHook = usePersonalInfo({
    initialPersonalInfo: resumeData.personalInfo,
    onUpdate: (personalInfo) => updateData({ personalInfo })
  });

  // Experience hook
  const experienceHook = useExperience({
    experience: resumeData.experience,
    onUpdate: (experience) => updateData({ experience })
  });

  // Education hook
  const educationHook = useEducation({
    education: resumeData.education,
    onUpdate: (education) => updateData({ education })
  });

  // Projects hook
  const projectsHook = useProjects({
    projects: resumeData.projects,
    onUpdate: (projects) => updateData({ projects })
  });

  // Achievements hook
  const achievementsHook = useAchievements({
    achievements: resumeData.achievements,
    onUpdate: (achievements) => updateData({ achievements })
  });

  // Skills and Interests hook
  const skillsAndInterestsHook = useSkillsAndInterests({
    skills: resumeData.skills,
    interests: resumeData.interests,
    onUpdateSkills: (skills) => updateData({ skills }),
    onUpdateInterests: (interests) => updateData({ interests })
  });

  // Certifications hook
  const certificationsHook = useCertifications({
    certifications: resumeData.certifications,
    onUpdate: (certifications) => updateData({ certifications })
  });

  // Languages hook
  const languagesHook = useLanguages({
    languages: resumeData.languages,
    onUpdate: (languages) => updateData({ languages })
  });

  // Volunteer Experience hook
  const volunteerExperienceHook = useVolunteerExperience({
    volunteerExperience: resumeData.volunteerExperience,
    onUpdate: (volunteerExperience) => updateData({ volunteerExperience })
  });

  // Publications hook
  const publicationsHook = usePublications({
    publications: resumeData.publications,
    onUpdate: (publications) => updateData({ publications })
  });

  // References hook
  const referencesHook = useReferences({
    references: resumeData.references,
    onUpdate: (references) => updateData({ references })
  });

  const updatePersonalStatement = (value: string) => {
    updateData({ personalStatement: value });
  };

  const updateSummary = (value: string) => {
    updateData({ summary: value });
  };

  const updateTheme = (theme: ColorTheme) => {
    updateData({ theme });
  };

  return {
    resumeData,
    updateResumeData,
    newSkill: skillsAndInterestsHook.newSkill,
    newInterest: skillsAndInterestsHook.newInterest,
    setNewSkill: skillsAndInterestsHook.setNewSkill,
    setNewInterest: skillsAndInterestsHook.setNewInterest,
    updatePersonalInfo: personalInfoHook.updatePersonalInfo,
    updatePersonalStatement,
    updateSummary,
    updateTheme,
    addExperience: experienceHook.addExperience,
    updateExperience: experienceHook.updateExperience,
    removeExperience: experienceHook.removeExperience,
    addEducation: educationHook.addEducation,
    updateEducation: educationHook.updateEducation,
    removeEducation: educationHook.removeEducation,
    addProject: projectsHook.addProject,
    updateProject: projectsHook.updateProject,
    removeProject: projectsHook.removeProject,
    addAchievement: achievementsHook.addAchievement,
    updateAchievement: achievementsHook.updateAchievement,
    removeAchievement: achievementsHook.removeAchievement,
    addSkill: skillsAndInterestsHook.addSkill,
    removeSkill: skillsAndInterestsHook.removeSkill,
    addInterest: skillsAndInterestsHook.addInterest,
    removeInterest: skillsAndInterestsHook.removeInterest,
    addCertification: certificationsHook.addCertification,
    updateCertification: certificationsHook.updateCertification,
    removeCertification: certificationsHook.removeCertification,
    addLanguage: languagesHook.addLanguage,
    updateLanguage: languagesHook.updateLanguage,
    removeLanguage: languagesHook.removeLanguage,
    addVolunteerExperience: volunteerExperienceHook.addVolunteerExperience,
    updateVolunteerExperience: volunteerExperienceHook.updateVolunteerExperience,
    removeVolunteerExperience: volunteerExperienceHook.removeVolunteerExperience,
    addPublication: publicationsHook.addPublication,
    updatePublication: publicationsHook.updatePublication,
    removePublication: publicationsHook.removePublication,
    addReference: referencesHook.addReference,
    updateReference: referencesHook.updateReference,
    removeReference: referencesHook.removeReference
  };
};
