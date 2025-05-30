
import { SectionConfig } from '@/types/resume';

export const isSectionVisible = (sectionConfig: SectionConfig[], sectionId: string): boolean => {
  const section = sectionConfig.find(s => s.id === sectionId);
  console.log(`Section visibility check for ${sectionId}:`, section?.visible);
  return section ? section.visible : true;
};

export const renderSection = (
  sectionConfig: SectionConfig[],
  sectionId: string,
  component: React.ReactNode
): React.ReactNode => {
  const isVisible = isSectionVisible(sectionConfig, sectionId);
  console.log(`Rendering section ${sectionId}: ${isVisible ? 'visible' : 'hidden'}`);
  return isVisible ? component : null;
};
