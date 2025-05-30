
import { useEffect, useState, useRef } from 'react';
import { ResumeData } from '@/types/resume';

interface SectionMeasurement {
  sectionId: string;
  height: number;
  items?: Array<{ id: string; height: number }>;
  canSplit: boolean;
}

export const useRealContentMeasurement = (data: ResumeData, visibleSections: string[]) => {
  const [measurements, setMeasurements] = useState<Map<string, SectionMeasurement>>(new Map());
  const [isReady, setIsReady] = useState(false);
  const measurementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const measureContent = async () => {
      if (!measurementRef.current) return;

      const newMeasurements = new Map<string, SectionMeasurement>();
      
      // Create a temporary container to measure each section
      const tempContainer = document.createElement('div');
      tempContainer.style.cssText = `
        position: absolute;
        top: -9999px;
        left: -9999px;
        width: 794px;
        visibility: hidden;
        pointer-events: none;
      `;
      document.body.appendChild(tempContainer);

      try {
        for (const sectionId of visibleSections) {
          const sectionHeight = await measureSection(sectionId, data, tempContainer);
          newMeasurements.set(sectionId, sectionHeight);
        }

        setMeasurements(newMeasurements);
        setIsReady(true);
      } finally {
        document.body.removeChild(tempContainer);
      }
    };

    measureContent();
  }, [data, visibleSections]);

  return { measurements, isReady };
};

const measureSection = (sectionId: string, data: ResumeData, container: HTMLElement): Promise<SectionMeasurement> => {
  return new Promise((resolve) => {
    // Create section content based on section type
    const sectionDiv = document.createElement('div');
    sectionDiv.className = 'space-y-3 mb-6';
    
    // Add section title
    const titleDiv = document.createElement('div');
    titleDiv.className = 'mb-4';
    titleDiv.innerHTML = `
      <h2 class="text-sm font-bold uppercase tracking-wide mb-2">${getSectionTitle(sectionId)}</h2>
      <div class="w-full h-px bg-gray-300"></div>
    `;
    sectionDiv.appendChild(titleDiv);

    // Add section content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'space-y-3';
    contentDiv.innerHTML = getSectionContent(sectionId, data);
    sectionDiv.appendChild(contentDiv);

    container.appendChild(sectionDiv);

    // Measure after next paint
    requestAnimationFrame(() => {
      const height = sectionDiv.offsetHeight;
      const canSplit = getSectionSplitability(sectionId, data);
      
      container.removeChild(sectionDiv);
      
      resolve({
        sectionId,
        height,
        canSplit,
        items: canSplit ? measureSectionItems(sectionId, data) : undefined
      });
    });
  });
};

const getSectionTitle = (sectionId: string): string => {
  const titles: Record<string, string> = {
    personalStatement: 'Personal Statement',
    summary: 'Professional Summary',
    experience: 'Work Experience',
    projects: 'Projects',
    education: 'Education',
    skills: 'Technical Skills',
    achievements: 'Achievements',
    certifications: 'Certifications',
    languages: 'Languages',
    volunteerExperience: 'Volunteer Experience',
    publications: 'Publications',
    references: 'References',
    interests: 'Interests & Hobbies'
  };
  return titles[sectionId] || sectionId;
};

const getSectionContent = (sectionId: string, data: ResumeData): string => {
  switch (sectionId) {
    case 'personalStatement':
      return `<div class="text-sm leading-normal">${data.personalStatement || ''}</div>`;
    case 'summary':
      return `<div class="text-sm leading-normal">${data.summary || ''}</div>`;
    case 'experience':
      return data.experience?.map(exp => `
        <div class="space-y-1">
          <div class="flex justify-between items-start mb-1">
            <div class="flex-1">
              <h3 class="text-sm font-semibold">${exp.position}</h3>
              <p class="text-sm">${exp.company}</p>
            </div>
            <div class="text-sm">${exp.startDate} - ${exp.current ? 'Present' : exp.endDate}</div>
          </div>
          ${exp.description ? `<div class="text-sm leading-normal">${exp.description}</div>` : ''}
        </div>
      `).join('') || '';
    case 'projects':
      return data.projects?.map(project => `
        <div class="space-y-1">
          <div class="flex justify-between items-start mb-1">
            <h3 class="text-sm font-semibold">${project.name}</h3>
            ${project.link ? `<a class="text-sm">View Project</a>` : ''}
          </div>
          ${project.description ? `<div class="text-sm leading-normal">${project.description}</div>` : ''}
          ${project.technologies ? `<p class="text-sm"><span class="font-medium">Technologies:</span> ${project.technologies}</p>` : ''}
        </div>
      `).join('') || '';
    case 'skills':
      return `<div class="flex flex-wrap gap-1">${data.skills?.join(', ') || ''}</div>`;
    case 'education':
      return data.education?.map(edu => `
        <div class="space-y-1">
          <div class="flex justify-between items-start mb-1">
            <div class="flex-1">
              <h3 class="text-sm font-semibold">${edu.degree}</h3>
              <p class="text-sm">${edu.institution}</p>
            </div>
            <div class="text-sm">${edu.startDate} - ${edu.endDate}</div>
          </div>
          ${edu.classification ? `<p class="text-sm">Classification: ${edu.classification}</p>` : ''}
        </div>
      `).join('') || '';
    default:
      return '<div class="text-sm">Content placeholder</div>';
  }
};

const getSectionSplitability = (sectionId: string, data: ResumeData): boolean => {
  switch (sectionId) {
    case 'experience':
      return (data.experience?.length || 0) > 1;
    case 'projects':
      return (data.projects?.length || 0) > 1;
    case 'education':
      return (data.education?.length || 0) > 1;
    case 'achievements':
      return (data.achievements?.length || 0) > 1;
    case 'certifications':
      return (data.certifications?.length || 0) > 1;
    case 'volunteerExperience':
      return (data.volunteerExperience?.length || 0) > 1;
    case 'publications':
      return (data.publications?.length || 0) > 1;
    case 'references':
      return (data.references?.length || 0) > 1;
    default:
      return false;
  }
};

const measureSectionItems = (sectionId: string, data: ResumeData): Array<{ id: string; height: number }> => {
  // For now, return estimated item heights - can be enhanced later
  const itemHeight = 120; // Average item height
  
  switch (sectionId) {
    case 'experience':
      return data.experience?.map(exp => ({ id: exp.id, height: itemHeight })) || [];
    case 'projects':
      return data.projects?.map(project => ({ id: project.id, height: itemHeight })) || [];
    case 'education':
      return data.education?.map(edu => ({ id: edu.id, height: itemHeight })) || [];
    default:
      return [];
  }
};
