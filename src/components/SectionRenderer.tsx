
import React from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import PersonalStatementSection from './sections/PersonalStatementSection';
import SummarySection from './sections/SummarySection';
import ExperienceSection from './sections/ExperienceSection';
import ProjectsSection from './sections/ProjectsSection';
import EducationSection from './sections/EducationSection';
import SkillsSection from './sections/SkillsSection';
import AchievementsSection from './sections/AchievementsSection';
import CertificationsSection from './sections/CertificationsSection';
import LanguagesSection from './sections/LanguagesSection';
import VolunteerExperienceSection from './sections/VolunteerExperienceSection';
import PublicationsSection from './sections/PublicationsSection';
import ReferencesSection from './sections/ReferencesSection';
import InterestsSection from './sections/InterestsSection';

interface SectionRendererProps {
  sectionId: string;
  data: ResumeData;
  theme: ColorTheme;
  items?: string[];
  startIndex?: number;
  endIndex?: number;
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  sectionId, 
  data, 
  theme, 
  items, 
  startIndex, 
  endIndex 
}) => {
  // Create filtered data for partial sections
  const getFilteredData = (): ResumeData => {
    if (!items && startIndex === undefined && endIndex === undefined) {
      return data;
    }

    const filteredData = { ...data };

    if (startIndex !== undefined && endIndex !== undefined) {
      switch (sectionId) {
        case 'experience':
          filteredData.experience = data.experience?.slice(startIndex, endIndex + 1) || [];
          break;
        case 'projects':
          filteredData.projects = data.projects?.slice(startIndex, endIndex + 1) || [];
          break;
        case 'education':
          filteredData.education = data.education?.slice(startIndex, endIndex + 1) || [];
          break;
        case 'achievements':
          filteredData.achievements = data.achievements?.slice(startIndex, endIndex + 1) || [];
          break;
        case 'certifications':
          filteredData.certifications = data.certifications?.slice(startIndex, endIndex + 1) || [];
          break;
        case 'volunteerExperience':
          filteredData.volunteerExperience = data.volunteerExperience?.slice(startIndex, endIndex + 1) || [];
          break;
        case 'publications':
          filteredData.publications = data.publications?.slice(startIndex, endIndex + 1) || [];
          break;
        case 'references':
          filteredData.references = data.references?.slice(startIndex, endIndex + 1) || [];
          break;
      }
    }

    if (items) {
      switch (sectionId) {
        case 'experience':
          filteredData.experience = data.experience?.filter(exp => items.includes(exp.id)) || [];
          break;
        case 'projects':
          filteredData.projects = data.projects?.filter(project => items.includes(project.id)) || [];
          break;
        case 'education':
          filteredData.education = data.education?.filter(edu => items.includes(edu.id)) || [];
          break;
        case 'achievements':
          filteredData.achievements = data.achievements?.filter(achievement => items.includes(achievement.id)) || [];
          break;
        case 'certifications':
          filteredData.certifications = data.certifications?.filter(cert => items.includes(cert.id)) || [];
          break;
        case 'volunteerExperience':
          filteredData.volunteerExperience = data.volunteerExperience?.filter(vol => items.includes(vol.id)) || [];
          break;
        case 'publications':
          filteredData.publications = data.publications?.filter(pub => items.includes(pub.id)) || [];
          break;
        case 'references':
          filteredData.references = data.references?.filter(ref => items.includes(ref.id)) || [];
          break;
      }
    }

    return filteredData;
  };

  const filteredData = getFilteredData();

  const renderSectionContent = () => {
    switch (sectionId) {
      case 'personalStatement':
        return <PersonalStatementSection data={filteredData} theme={theme} />;
      case 'summary':
        return <SummarySection data={filteredData} theme={theme} />;
      case 'experience':
        return <ExperienceSection data={filteredData} theme={theme} />;
      case 'projects':
        return <ProjectsSection data={filteredData} theme={theme} />;
      case 'education':
        return <EducationSection data={filteredData} theme={theme} />;
      case 'skills':
        return <SkillsSection data={filteredData} theme={theme} />;
      case 'achievements':
        return <AchievementsSection data={filteredData} theme={theme} />;
      case 'certifications':
        return <CertificationsSection data={filteredData} theme={theme} />;
      case 'languages':
        return <LanguagesSection data={filteredData} theme={theme} />;
      case 'volunteerExperience':
        return <VolunteerExperienceSection data={filteredData} theme={theme} />;
      case 'publications':
        return <PublicationsSection data={filteredData} theme={theme} />;
      case 'references':
        return <ReferencesSection data={filteredData} theme={theme} />;
      case 'interests':
        return <InterestsSection data={filteredData} theme={theme} />;
      default:
        return null;
    }
  };

  return renderSectionContent();
};

export default SectionRenderer;
