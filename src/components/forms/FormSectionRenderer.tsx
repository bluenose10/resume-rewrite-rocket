
import React from 'react';
import { SectionConfig } from '@/types/resume';
import PersonalStatementForm from './PersonalStatementForm';
import ExperienceForm from './ExperienceForm';
import EducationForm from './EducationForm';
import ProjectsForm from './ProjectsForm';
import SkillsForm from './SkillsForm';
import AchievementsForm from './AchievementsForm';
import CertificationsForm from './CertificationsForm';
import LanguagesForm from './LanguagesForm';
import VolunteerExperienceForm from './VolunteerExperienceForm';
import PublicationsForm from './PublicationsForm';
import ReferencesForm from './ReferencesForm';
import { useResumeFormData } from '@/hooks/useResumeFormData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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
      {/* Personal Statement */}
      {renderSection('personalStatement', (
        <Card>
          <CardHeader>
            <CardTitle>Personal Statement</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="personal-statement">Personal Statement</Label>
              <Textarea
                id="personal-statement"
                value={formData.resumeData.personalStatement}
                onChange={(e) => formData.updatePersonalStatement(e.target.value)}
                placeholder="Write a compelling personal statement that highlights your passion and goals"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Summary */}
      {renderSection('summary', (
        <Card>
          <CardHeader>
            <CardTitle>Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <Label htmlFor="summary">Professional Summary</Label>
              <Textarea
                id="summary"
                value={formData.resumeData.summary}
                onChange={(e) => formData.updateSummary(e.target.value)}
                placeholder="Write a brief summary of your professional background, key skills, and achievements"
                rows={4}
              />
            </div>
          </CardContent>
        </Card>
      ))}

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

      {/* Skills */}
      {renderSection('skills', (
        <Card>
          <CardHeader>
            <CardTitle>Technical Skills</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillsForm
              skills={formData.resumeData.skills}
              interests={[]}
              newSkill={formData.newSkill}
              newInterest=""
              onNewSkillChange={formData.setNewSkill}
              onNewInterestChange={() => {}}
              onAddSkill={formData.addSkill}
              onAddInterest={() => {}}
              onRemoveSkill={formData.removeSkill}
              onRemoveInterest={() => {}}
            />
          </CardContent>
        </Card>
      ))}

      {/* Achievements */}
      {renderSection('achievements', (
        <AchievementsForm
          achievements={formData.resumeData.achievements}
          onAdd={formData.addAchievement}
          onUpdate={formData.updateAchievement}
          onRemove={formData.removeAchievement}
        />
      ))}

      {/* Certifications */}
      {renderSection('certifications', (
        <CertificationsForm
          certifications={formData.resumeData.certifications}
          onAdd={formData.addCertification}
          onUpdate={formData.updateCertification}
          onRemove={formData.removeCertification}
        />
      ))}

      {/* Languages */}
      {renderSection('languages', (
        <LanguagesForm
          languages={formData.resumeData.languages}
          onAdd={formData.addLanguage}
          onUpdate={formData.updateLanguage}
          onRemove={formData.removeLanguage}
        />
      ))}

      {/* Volunteer Experience */}
      {renderSection('volunteerExperience', (
        <VolunteerExperienceForm
          volunteerExperience={formData.resumeData.volunteerExperience}
          onAdd={formData.addVolunteerExperience}
          onUpdate={formData.updateVolunteerExperience}
          onRemove={formData.removeVolunteerExperience}
        />
      ))}

      {/* Publications */}
      {renderSection('publications', (
        <PublicationsForm
          publications={formData.resumeData.publications}
          onAdd={formData.addPublication}
          onUpdate={formData.updatePublication}
          onRemove={formData.removePublication}
        />
      ))}

      {/* References */}
      {renderSection('references', (
        <ReferencesForm
          references={formData.resumeData.references}
          onAdd={formData.addReference}
          onUpdate={formData.updateReference}
          onRemove={formData.removeReference}
        />
      ))}

      {/* Interests */}
      {renderSection('interests', (
        <Card>
          <CardHeader>
            <CardTitle>Interests & Hobbies</CardTitle>
          </CardHeader>
          <CardContent>
            <SkillsForm
              skills={[]}
              interests={formData.resumeData.interests}
              newSkill=""
              newInterest={formData.newInterest}
              onNewSkillChange={() => {}}
              onNewInterestChange={formData.setNewInterest}
              onAddSkill={() => {}}
              onAddInterest={formData.addInterest}
              onRemoveSkill={() => {}}
              onRemoveInterest={formData.removeInterest}
            />
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default FormSectionRenderer;
