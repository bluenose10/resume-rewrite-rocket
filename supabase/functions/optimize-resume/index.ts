
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OptimizeRequest {
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

interface OptimizeResponse {
  summary: string;
  experience: Array<{
    description: string;
  }>;
  projects: Array<{
    description: string;
  }>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const resumeData: OptimizeRequest = await req.json();

    const prompt = `
You are a professional resume optimization expert. Please optimize the following resume content to make it more ATS-friendly, impactful, and professional. Follow these guidelines:

1. Use strong action verbs and quantify achievements where possible
2. Make descriptions concise but impactful
3. Focus on results and accomplishments
4. Use industry-standard keywords
5. Ensure ATS compatibility
6. Maintain professional tone
7. Return descriptions as formatted strings with bullet points using "• " prefix

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

IMPORTANT: For experience and project descriptions, format them as single strings with bullet points using "• " at the start of each line. Do NOT return arrays.

Please return the optimized content in the following JSON format:
{
  "summary": "optimized professional summary as a single paragraph",
  "experience": [
    {
      "description": "• First achievement or responsibility\n• Second achievement with metrics\n• Third accomplishment with impact"
    }
  ],
  "projects": [
    {
      "description": "• Project outcome or achievement\n• Technical implementation details\n• Impact or results achieved"
    }
  ]
}

Only return the JSON response, no additional text.
`;

    console.log('Making request to OpenAI API...');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: 'You are a professional resume optimization expert. Always respond with valid JSON only. Format descriptions as single strings with bullet points using "• " prefix, not as arrays.'
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
      console.error('OpenAI API error:', errorData);
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

    console.log('OpenAI response received:', content);

    try {
      const optimizedContent: OptimizeResponse = JSON.parse(content);
      
      // Validate that descriptions are strings, not arrays
      if (optimizedContent.experience) {
        optimizedContent.experience.forEach((exp, index) => {
          if (Array.isArray(exp.description)) {
            console.warn(`Converting array description to string for experience ${index}`);
            exp.description = exp.description.join('\n• ');
            if (!exp.description.startsWith('• ')) {
              exp.description = '• ' + exp.description;
            }
          }
        });
      }
      
      if (optimizedContent.projects) {
        optimizedContent.projects.forEach((proj, index) => {
          if (Array.isArray(proj.description)) {
            console.warn(`Converting array description to string for project ${index}`);
            proj.description = proj.description.join('\n• ');
            if (!proj.description.startsWith('• ')) {
              proj.description = '• ' + proj.description;
            }
          }
        });
      }
      
      return new Response(JSON.stringify(optimizedContent), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Invalid response format from OpenAI API');
    }

  } catch (error) {
    console.error('Error in optimize-resume function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to optimize resume content' 
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
