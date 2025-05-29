
export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  background: string;
}

export interface PersonalInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  organization: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  expiryDate: string;
  credentialId: string;
}

export interface Language {
  id: string;
  language: string;
  proficiency: 'Beginner' | 'Intermediate' | 'Advanced' | 'Fluent' | 'Native';
}

export interface VolunteerExperience {
  id: string;
  organization: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Reference {
  id: string;
  name: string;
  title: string;
  company: string;
  email: string;
  phone: string;
  relationship: string;
}

export interface Publication {
  id: string;
  title: string;
  authors: string;
  publication: string;
  date: string;
  link: string;
}

export interface SectionConfig {
  id: string;
  title: string;
  visible: boolean;
  required?: boolean;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  personalStatement: string;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string[];
  achievements: Achievement[];
  certifications: Certification[];
  languages: Language[];
  volunteerExperience: VolunteerExperience[];
  references: Reference[];
  publications: Publication[];
  interests: string[];
  theme?: ColorTheme;
  sectionOrder?: string[];
  sectionConfig?: SectionConfig[];
}
