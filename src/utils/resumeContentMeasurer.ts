
import React from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import PersonalInfoHeader from '@/components/PersonalInfoHeader';
import SectionRenderer from '@/components/SectionRenderer';
import { PAGE_MARGIN } from './pageBreakUtils';

export interface SectionMeasurement {
  id: string;
  element: HTMLElement;
  height: number;
}

export const measureResumeContent = async (
  data: ResumeData,
  theme: ColorTheme,
  visibleSections: Array<{ id: string; visible: boolean }>,
  measuringContainer: HTMLElement
): Promise<{ headerHeight: number; sectionMeasurements: SectionMeasurement[] }> => {
  // Clear and setup measuring container
  measuringContainer.innerHTML = '';
  measuringContainer.style.position = 'absolute';
  measuringContainer.style.left = '-9999px';
  measuringContainer.style.width = `794px`; // A4 width
  measuringContainer.style.visibility = 'hidden';
  measuringContainer.style.display = 'block';

  // Create a temporary React root for measuring
  const { createRoot } = await import('react-dom/client');
  const root = createRoot(measuringContainer);

  // Render all content for measurement using React.createElement
  const MeasuringContent = () => React.createElement('div', {
    className: "space-y-6",
    style: { padding: `${PAGE_MARGIN}px` }
  }, [
    React.createElement('div', {
      key: 'header',
      ref: (el: HTMLElement | null) => el && el.setAttribute('data-section', 'header')
    }, React.createElement(PersonalInfoHeader, {
      personalInfo: data.personalInfo,
      theme: theme
    })),
    ...visibleSections.map((sectionConfig) => {
      if (hasSectionContent(sectionConfig.id, data)) {
        return React.createElement('div', {
          key: sectionConfig.id,
          ref: (el: HTMLElement | null) => el && el.setAttribute('data-section', sectionConfig.id)
        }, React.createElement(SectionRenderer, {
          sectionId: sectionConfig.id,
          data: data,
          theme: theme
        }));
      }
      return null;
    }).filter(Boolean)
  ]);

  root.render(React.createElement(MeasuringContent));

  // Wait for rendering to complete
  await new Promise(resolve => setTimeout(resolve, 200));

  // Measure the rendered content
  const headerElement = measuringContainer.querySelector('[data-section="header"]') as HTMLElement;
  const sectionElements = Array.from(measuringContainer.querySelectorAll('[data-section]')).filter(
    el => el.getAttribute('data-section') !== 'header'
  ) as HTMLElement[];

  const headerHeight = headerElement ? headerElement.getBoundingClientRect().height : 0;
  console.log(`Header height: ${headerHeight}px`);

  const sectionMeasurements = sectionElements.map(el => ({
    id: el.getAttribute('data-section')!,
    element: el,
    height: el.getBoundingClientRect().height
  }));

  console.log('Section measurements:', sectionMeasurements.map(s => ({ id: s.id, height: s.height })));

  // Clean up
  root.unmount();
  measuringContainer.style.position = '';
  measuringContainer.style.left = '';
  measuringContainer.style.visibility = '';
  measuringContainer.style.display = '';

  return { headerHeight, sectionMeasurements };
};

const hasSectionContent = (sectionId: string, data: ResumeData): boolean => {
  switch (sectionId) {
    case 'personalStatement':
      return !!data.personalStatement?.trim();
    case 'summary':
      return !!data.summary?.trim();
    case 'experience':
      return data.experience.length > 0;
    case 'education':
      return data.education.length > 0;
    case 'projects':
      return data.projects.length > 0;
    case 'skills':
      return data.skills.length > 0;
    case 'achievements':
      return data.achievements.length > 0;
    case 'certifications':
      return data.certifications.length > 0;
    case 'languages':
      return data.languages.length > 0;
    case 'volunteerExperience':
      return data.volunteerExperience.length > 0;
    case 'publications':
      return data.publications.length > 0;
    case 'references':
      return data.references.length > 0;
    case 'interests':
      return data.interests.length > 0;
    default:
      return false;
  }
};
