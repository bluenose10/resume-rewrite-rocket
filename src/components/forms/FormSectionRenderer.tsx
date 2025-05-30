
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

  return (
    <>
      {/* Personal Statement */}
      {renderSection(sectionConfig, 'personalStatement', (
        <PersonalStatementSection
          key="personalStatement"
          value={formData.resumeData.personalStatement}
          onChange={formData.updatePersonalStatement}
        />
      ))}

      {/* Summary */}
      {renderSection(sectionConfig, 'summary', (
        <SummarySection
          key="summary"
          value={formData.resumeData.summary}
          onChange={formData.updateSummary}
        />
      ))}

      {/* Experience */}
      {renderSection(sectionConfig, 'experience', (
        <ExperienceForm
          key="experience"
          experience={formData.resumeData.experience}
          onAdd={formData.addExperience}
          onUpdate={formData.updateExperience}
          onRemove={formData.removeExperience}
        />
      ))}

      {/* Education */}
      {renderSection(sectionConfig, 'education', (
        <EducationForm
          key="education"
          education={formData.resumeData.education}
          onAdd={formData.addEducation}
          onUpdate={formData.updateEducation}
          onRemove={formData.removeEducation}
        />
      ))}

      {/* Projects */}
      {renderSection(sectionConfig, 'projects', (
        <ProjectsForm
          key="projects"
          projects={formData.resumeData.projects}
          onAdd={formData.addProject}
          onUpdate={formData.updateProject}
          onRemove={formData.removeProject}
        />
      ))}

      {/* Skills */}
      {renderSection(sectionConfig, 'skills', (
        <SkillsSection
          key="skills"
          skills={formData.resumeData.skills}
          newSkill={formData.newSkill}
          onNewSkillChange={formData.setNewSkill}
          onAddSkill={formData.addSkill}
          onRemoveSkill={formData.removeSkill}
        />
      ))}

      {/* Achievements */}
      {renderSection(sectionConfig, 'achievements', (
        <AchievementsForm
          key="achievements"
          achievements={formData.resumeData.achievements}
          onAdd={formData.addAchievement}
          onUpdate={formData.updateAchievement}
          onRemove={formData.removeAchievement}
        />
      ))}

      {/* Certifications */}
      {renderSection(sectionConfig, 'certifications', (
        <CertificationsForm
          key="certifications"
          certifications={formData.resumeData.certifications}
          onAdd={formData.addCertification}
          onUpdate={formData.updateCertification}
          onRemove={formData.removeCertification}
        />
      ))}

      {/* Languages */}
      {renderSection(sectionConfig, 'languages', (
        <LanguagesForm
          key="languages"
          languages={formData.resumeData.languages}
          onAdd={formData.addLanguage}
          onUpdate={formData.updateLanguage}
          onRemove={formData.removeLanguage}
        />
      ))}

      {/* Volunteer Experience */}
      {renderSection(sectionConfig, 'volunteerExperience', (
        <VolunteerExperienceForm
          key="volunteerExperience"
          volunteerExperience={formData.resumeData.volunteerExperience}
          onAdd={formData.addVolunteerExperience}
          onUpdate={formData.updateVolunteerExperience}
          onRemove={formData.removeVolunteerExperience}
        />
      ))}

      {/* Publications */}
      {renderSection(sectionConfig, 'publications', (
        <PublicationsForm
          key="publications"
          publications={formData.resumeData.publications}
          onAdd={formData.addPublication}
          onUpdate={formData.updatePublication}
          onRemove={formData.removePublication}
        />
      ))}

      {/* References */}
      {renderSection(sectionConfig, 'references', (
        <ReferencesForm
          key="references"
          references={formData.resumeData.references}
          onAdd={formData.addReference}
          onUpdate={formData.updateReference}
          onRemove={formData.removeReference}
        />
      ))}

      {/* Interests */}
      {renderSection(sectionConfig, 'interests', (
        <InterestsSection
          key="interests"
          interests={formData.resumeData.interests}
          newInterest={formData.newInterest}
          onNewInterestChange={formData.setNewInterest}
          onAddInterest={formData.addInterest}
          onRemoveInterest={formData.removeInterest}
        />
      ))}
    </>
  );
};

export default FormSectionRenderer;
