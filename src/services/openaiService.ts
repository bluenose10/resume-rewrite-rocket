
export interface OptimizeRequest {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
    github: string;
    website: string;
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
    classification: string;
  }>;
  projects: Array<{
    name: string;
    description: string;
    technologies: string;
    link: string;
  }>;
  skills: string[];
}

export interface OptimizeResponse {
  summary: string;
  experience: Array<{
    description: string;
  }>;
  projects: Array<{
    description: string;
  }>;
}

const OPENAI_API_KEY = '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';

export const optimizeResumeContent = async (
  resumeData: OptimizeRequest
): Promise<OptimizeResponse> => {
  const prompt = `
You are a professional resume optimization expert. Please optimize the following resume content to make it more ATS-friendly, impactful, and professional. Follow these guidelines:

1. Use strong action verbs and quantify achievements where possible
2. Make descriptions concise but impactful
3. Focus on results and accomplishments
4. Use industry-standard keywords
5. Ensure ATS compatibility
6. Maintain professional tone

Here's the resume data to optimize:

SUMMARY:
${resumeData.summary}

EXPERIENCE:
${resumeData.experience.map(exp => `
Company: ${exp.company}
Position: ${exp.position}
Description: ${exp.description}
`).join('\n')}

PROJECTS:
${resumeData.projects.map(proj => `
Project: ${proj.name}
Technologies: ${proj.technologies}
Description: ${proj.description}
`).join('\n')}

Please return the optimized content in the following JSON format:
{
  "summary": "optimized professional summary",
  "experience": [
    {
      "description": "optimized experience description"
    }
  ],
  "projects": [
    {
      "description": "optimized project description"
    }
  ]
}

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
          content: 'You are a professional resume optimization expert. Always respond with valid JSON only.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData.error?.message || 
      `OpenAI API error: ${response.status} ${response.statusText}`
    );
  }

  const data = await response.json();
  const content = data.choices[0]?.message?.content;

  if (!content) {
    throw new Error('No content received from OpenAI API');
  }

  try {
    return JSON.parse(content);
  } catch (error) {
    console.error('Failed to parse OpenAI response:', content);
    throw new Error('Invalid response format from OpenAI API');
  }
};
