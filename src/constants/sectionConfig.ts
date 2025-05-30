
import { SectionConfig } from '@/types/resume';

export const DEFAULT_SECTION_ORDER: SectionConfig[] = [
  { id: 'personalStatement', title: 'Personal Statement', visible: true },
  { id: 'summary', title: 'Professional Summary', visible: true },
  { id: 'experience', title: 'Work Experience', visible: true, required: true },
  { id: 'projects', title: 'Projects', visible: true },
  { id: 'education', title: 'Education', visible: true, required: true },
  { id: 'skills', title: 'Technical Skills', visible: true },
  { id: 'achievements', title: 'Achievements & Awards', visible: false },
  { id: 'certifications', title: 'Certifications & Licenses', visible: false },
  { id: 'languages', title: 'Languages', visible: false },
  { id: 'volunteerExperience', title: 'Volunteer Experience', visible: false },
  { id: 'publications', title: 'Publications', visible: false },
  { id: 'references', title: 'References', visible: false },
  { id: 'interests', title: 'Interests & Hobbies', visible: false },
];
