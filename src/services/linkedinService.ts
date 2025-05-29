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

const OPENAI_API_KEY = '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';

export const extractLinkedInData = async (linkedinUrl: string): Promise<LinkedInImportData> => {
  const prompt = `
You are a LinkedIn profile data extractor. Given a LinkedIn profile URL, extract and structure the professional information into a resume format.

LinkedIn Profile URL: ${linkedinUrl}

Please extract the following information and return it in the specified JSON format:

1. Personal Information (name, location, LinkedIn URL)
2. Professional summary from the "About" section
3. Work experience with company names, positions, dates, and descriptions
4. Education history with institutions, degrees, and dates
5. Skills list

Return the data in this exact JSON format:
{
  "personalInfo": {
    "firstName": "extracted first name",
    "lastName": "extracted last name", 
    "location": "extracted location",
    "linkedin": "${linkedinUrl}"
  },
  "summary": "professional summary from about section",
  "experience": [
    {
      "company": "company name",
      "position": "job title",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format or empty if current",
      "current": true/false,
      "description": "job description and achievements"
    }
  ],
  "education": [
    {
      "institution": "school name",
      "degree": "degree type",
      "field": "field of study",
      "startDate": "YYYY-MM format",
      "endDate": "YYYY-MM format"
    }
  ],
  "skills": ["skill1", "skill2", "skill3"]
}

Important notes:
- Convert date ranges to YYYY-MM format
- If current position, set "current": true and leave "endDate" empty
- Make descriptions concise and professional
- Extract only relevant professional skills
- If information is not available, use empty strings or arrays

Only return the JSON response, no additional text.
`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${OPENAI_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are a professional LinkedIn profile data extractor. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || 
      `LinkedIn extraction failed: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content received from LinkedIn extraction API');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse LinkedIn extraction response:', content);
    throw new Error('Invalid response format from LinkedIn extraction API');
  }
};
