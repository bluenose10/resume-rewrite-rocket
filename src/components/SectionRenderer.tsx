
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
}

const SectionRenderer: React.FC<SectionRendererProps> = ({ 
  sectionId, 
  data, 
  theme
}) => {
  const renderSectionContent = () => {
    switch (sectionId) {
      case 'personalStatement':
        return <PersonalStatementSection data={data} theme={theme} />;
      case 'summary':
        return <SummarySection data={data} theme={theme} />;
      case 'experience':
        return <ExperienceSection data={data} theme={theme} />;
      case 'projects':
        return <ProjectsSection data={data} theme={theme} />;
      case 'education':
        return <EducationSection data={data} theme={theme} />;
      case 'skills':
        return <SkillsSection data={data} theme={theme} />;
      case 'achievements':
        return <AchievementsSection data={data} theme={theme} />;
      case 'certifications':
        return <CertificationsSection data={data} theme={theme} />;
      case 'languages':
        return <LanguagesSection data={data} theme={theme} />;
      case 'volunteerExperience':
        return <VolunteerExperienceSection data={data} theme={theme} />;
      case 'publications':
        return <PublicationsSection data={data} theme={theme} />;
      case 'references':
        return <ReferencesSection data={data} theme={theme} />;
      case 'interests':
        return <InterestsSection data={data} theme={theme} />;
      default:
        return null;
    }
  };

  return renderSectionContent();
};

export default SectionRenderer;
