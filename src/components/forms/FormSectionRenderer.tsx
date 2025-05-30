
import React from 'react';
import { SectionConfig } from '@/types/resume';
import PersonalStatementForm from './PersonalStatementForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import ProjectsForm from './ProjectsForm';
import SkillsForm from './SkillsForm';
import AchievementsForm from './AchievementsForm';
import { useResumeFormData } from '@/hooks/useResumeFormData';

interface FormSectionRendererProps {
  sectionConfig: SectionConfig[];
  formData: ReturnType<typeof useResumeFormData>;
}

const FormSectionRenderer: React.FC<FormSectionRendererProps> = ({
  sectionConfig,
  formData
}) => {
  const isSectionVisible = (sectionId: string) => {
    const section = sectionConfig.find(s => s.id === sectionId);
    return section ? section.visible : true;
  };

  const renderSection = (sectionId: string, component: React.ReactNode) => {
    return isSectionVisible(sectionId) ? component : null;
  };

  return (
    <>
      {/* Personal Statement and Summary */}
      {(isSectionVisible('personalStatement') || isSectionVisible('summary')) && (
        <PersonalStatementForm
          personalStatement={formData.resumeData.personalStatement}
          summary={formData.resumeData.summary}
          onPersonalStatementChange={formData.updatePersonalStatement}
          onSummaryChange={formData.updateSummary}
        />
      )}

      {/* Experience */}
      {renderSection('experience', (
        <ExperienceForm
          experience={formData.resumeData.experience}
          onAdd={formData.addExperience}
          onUpdate={formData.updateExperience}
          onRemove={formData.removeExperience}
        />
      ))}

      {/* Education */}
      {renderSection('education', (
        <EducationForm
          education={formData.resumeData.education}
          onAdd={formData.addEducation}
          onUpdate={formData.updateEducation}
          onRemove={formData.removeEducation}
        />
      ))}

      {/* Projects */}
      {renderSection('projects', (
        <ProjectsForm
          projects={formData.resumeData.projects}
          onAdd={formData.addProject}
          onUpdate={formData.updateProject}
          onRemove={formData.removeProject}
        />
      ))}

      {/* Skills and Interests */}
      {(isSectionVisible('skills') || isSectionVisible('interests')) && (
        <SkillsForm
          skills={formData.resumeData.skills}
          interests={formData.resumeData.interests}
          newSkill={formData.newSkill}
          newInterest={formData.newInterest}
          onNewSkillChange={formData.setNewSkill}
          onNewInterestChange={formData.setNewInterest}
          onAddSkill={formData.addSkill}
          onAddInterest={formData.addInterest}
          onRemoveSkill={formData.removeSkill}
          onRemoveInterest={formData.removeInterest}
        />
      )}

      {/* Achievements */}
      {renderSection('achievements', (
        <AchievementsForm
          achievements={formData.resumeData.achievements}
          onAdd={formData.addAchievement}
          onUpdate={formData.updateAchievement}
          onRemove={formData.removeAchievement}
        />
      ))}
    </>
  );
};

export default FormSectionRenderer;
