import JSZip from 'jszip';
import { optimizeResumeContent } from './openaiService';

export interface LinkedInProfile {
  url: string;
  name: string;
  headline: string;
  location: string;
  about: string;
  experience: Array<{
    company: string;
    position: string;
    duration: string;
    description: string;
  }>;
  education: Array<{
    school: string;
    degree: string;
    field: string;
    duration: string;
  }>;
  skills: string[];
}

export interface LinkedInImportData {
  personalInfo: {
    firstName: string;
    lastName: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  experience: Array<{
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }>;
  education: Array<{
    institution: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
  }>;
  skills: string[];
}

const parseLinkedInDate = (dateStr: string): string => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
  } catch {
    return '';
  }
};

const parseProfileJson = (profileData: any): Partial<LinkedInImportData> => {
  const profile = profileData;
  const firstName = profile.firstName || '';
  const lastName = profile.lastName || '';
  const location = profile.geoLocation?.name || profile.location?.name || '';
  const summary = profile.summary || '';

  return {
    personalInfo: {
      firstName,
      lastName,
      location,
      linkedin: '' // Will be set from original URL if available
    },
    summary
  };
};

const parsePositionsJson = (positionsData: any[]): LinkedInImportData['experience'] => {
  if (!Array.isArray(positionsData)) return [];
  
  return positionsData.map(position => ({
    company: position.companyName || '',
    position: position.title || '',
    startDate: parseLinkedInDate(position.startDate),
    endDate: position.endDate ? parseLinkedInDate(position.endDate) : '',
    current: !position.endDate,
    description: position.description || ''
  }));
};

const parseEducationJson = (educationData: any[]): LinkedInImportData['education'] => {
  if (!Array.isArray(educationData)) return [];
  
  return educationData.map(edu => ({
    institution: edu.schoolName || '',
    degree: edu.degreeName || '',
    field: edu.fieldOfStudy || '',
    startDate: parseLinkedInDate(edu.startDate),
    endDate: parseLinkedInDate(edu.endDate)
  }));
};

const parseSkillsJson = (skillsData: any[]): string[] => {
  if (!Array.isArray(skillsData)) return [];
  
  return skillsData.map(skill => skill.name || '').filter(Boolean);
};

export const parseLinkedInArchive = async (zipFile: File): Promise<LinkedInImportData> => {
  try {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipFile);
    
    let profileData: any = {};
    let experienceData: any[] = [];
    let educationData: any[] = [];
    let skillsData: any[] = [];

    // Parse Profile.json
    const profileFile = zipContent.file('Profile.json');
    if (profileFile) {
      const profileText = await profileFile.async('text');
      profileData = JSON.parse(profileText);
    }

    // Parse Positions.json
    const positionsFile = zipContent.file('Positions.json');
    if (positionsFile) {
      const positionsText = await positionsFile.async('text');
      experienceData = JSON.parse(positionsText);
    }

    // Parse Education.json
    const educationFile = zipContent.file('Education.json');
    if (educationFile) {
      const educationText = await educationFile.async('text');
      educationData = JSON.parse(educationText);
    }

    // Parse Skills.json
    const skillsFile = zipContent.file('Skills.json');
    if (skillsFile) {
      const skillsText = await skillsFile.async('text');
      skillsData = JSON.parse(skillsText);
    }

    // Combine all parsed data
    const parsedProfile = parseProfileJson(profileData);
    const parsedExperience = parsePositionsJson(experienceData);
    const parsedEducation = parseEducationJson(educationData);
    const parsedSkills = parseSkillsJson(skillsData);

    return {
      personalInfo: parsedProfile.personalInfo || {
        firstName: '',
        lastName: '',
        location: '',
        linkedin: ''
      },
      summary: parsedProfile.summary || '',
      experience: parsedExperience,
      education: parsedEducation,
      skills: parsedSkills
    };

  } catch (error) {
    console.error('Error parsing LinkedIn archive:', error);
    throw new Error('Failed to parse LinkedIn archive. Please ensure you uploaded a valid LinkedIn data export ZIP file.');
  }
};

export const validateLinkedInArchive = (file: File): boolean => {
  return file.type === 'application/zip' || file.name.endsWith('.zip');
};

// Keep the old URL-based function for backwards compatibility
export const extractLinkedInData = async (linkedinUrl: string): Promise<LinkedInImportData> => {
  throw new Error('URL-based extraction is no longer supported. Please upload your LinkedIn data archive instead.');
};

export const validateLinkedInUrl = (url: string): boolean => {
  const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedinRegex.test(url);
};
