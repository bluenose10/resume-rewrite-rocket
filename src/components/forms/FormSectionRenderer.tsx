
import React from 'react';
import { SectionConfig } from '@/types/resume';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import ProjectsForm from './ProjectsForm';
import AchievementsForm from './AchievementsForm';
import CertificationsForm from './CertificationsForm';
import LanguagesForm from './LanguagesForm';
import VolunteerExperienceForm from './VolunteerExperienceForm';
import PublicationsForm from './PublicationsForm';
import ReferencesForm from './ReferencesForm';
import PersonalStatementSection from './sections/PersonalStatementSection';
import SummarySection from './sections/SummarySection';
import SkillsSection from './sections/SkillsSection';
import InterestsSection from './sections/InterestsSection';
import { useResumeFormData } from '@/hooks/useResumeFormData';
import { renderSection } from './utils/sectionVisibilityUtils';

interface FormSectionRendererProps {
  sectionConfig: SectionConfig[];
  formData: ReturnType<typeof useResumeFormData>;
}

const FormSectionRenderer: React.FC<FormSectionRendererProps> = ({
  sectionConfig,
  formData
}) => {
  // Log the current section config for debugging
  console.log('FormSectionRenderer - Current sectionConfig:', sectionConfig);
  console.log('FormSectionRenderer - Section order:', sectionConfig.map(s => `${s.id}:${s.visible}`));

  // Create a mapping of section IDs to their corresponding React components
  const sectionComponents: Record<string, React.ReactNode> = {
    personalStatement: (
      <PersonalStatementSection
        key="personalStatement"
        value={formData.resumeData.personalStatement}
        onChange={formData.updatePersonalStatement}
      />
    ),
    summary: (
      <SummarySection
        key="summary"
        value={formData.resumeData.summary}
        onChange={formData.updateSummary}
      />
    ),
    experience: (
      <ExperienceForm
        key="experience"
        experience={formData.resumeData.experience}
        onAdd={formData.addExperience}
        onUpdate={formData.updateExperience}
        onRemove={formData.removeExperience}
      />
    ),
    education: (
      <EducationForm
        key="education"
        education={formData.resumeData.education}
        onAdd={formData.addEducation}
        onUpdate={formData.updateEducation}
        onRemove={formData.removeEducation}
      />
    ),
    projects: (
      <ProjectsForm
        key="projects"
        projects={formData.resumeData.projects}
        onAdd={formData.addProject}
        onUpdate={formData.updateProject}
        onRemove={formData.removeProject}
      />
    ),
    skills: (
      <SkillsSection
        key="skills"
        skills={formData.resumeData.skills}
        newSkill={formData.newSkill}
        onNewSkillChange={formData.setNewSkill}
        onAddSkill={formData.addSkill}
        onRemoveSkill={formData.removeSkill}
      />
    ),
    achievements: (
      <AchievementsForm
        key="achievements"
        achievements={formData.resumeData.achievements}
        onAdd={formData.addAchievement}
        onUpdate={formData.updateAchievement}
        onRemove={formData.removeAchievement}
      />
    ),
    certifications: (
      <CertificationsForm
        key="certifications"
        certifications={formData.resumeData.certifications}
        onAdd={formData.addCertification}
        onUpdate={formData.updateCertification}
        onRemove={formData.removeCertification}
      />
    ),
    languages: (
      <LanguagesForm
        key="languages"
        languages={formData.resumeData.languages}
        onAdd={formData.addLanguage}
        onUpdate={formData.updateLanguage}
        onRemove={formData.removeLanguage}
      />
    ),
    volunteerExperience: (
      <VolunteerExperienceForm
        key="volunteerExperience"
        volunteerExperience={formData.resumeData.volunteerExperience}
        onAdd={formData.addVolunteerExperience}
        onUpdate={formData.updateVolunteerExperience}
        onRemove={formData.removeVolunteerExperience}
      />
    ),
    publications: (
      <PublicationsForm
        key="publications"
        publications={formData.resumeData.publications}
        onAdd={formData.addPublication}
        onUpdate={formData.updatePublication}
        onRemove={formData.removePublication}
      />
    ),
    references: (
      <ReferencesForm
        key="references"
        references={formData.resumeData.references}
        onAdd={formData.addReference}
        onUpdate={formData.updateReference}
        onRemove={formData.removeReference}
      />
    ),
    interests: (
      <InterestsSection
        key="interests"
        interests={formData.resumeData.interests}
        newInterest={formData.newInterest}
        onNewInterestChange={formData.setNewInterest}
        onAddInterest={formData.addInterest}
        onRemoveInterest={formData.removeInterest}
      />
    )
  };

  // Render sections dynamically based on sectionConfig order
  return (
    <>
      {sectionConfig.map((section) => {
        const component = sectionComponents[section.id];
        if (!component) {
          console.warn(`No component found for section: ${section.id}`);
          return null;
        }
        
        return renderSection(sectionConfig, section.id, component);
      })}
    </>
  );
};

export default FormSectionRenderer;
