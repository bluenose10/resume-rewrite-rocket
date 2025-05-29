
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

export const validateLinkedInUrl = (url: string): boolean => {
  const linkedinRegex = /^https:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/;
  return linkedinRegex.test(url);
};
