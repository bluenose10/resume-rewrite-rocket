
import React, { useRef, useEffect, useState } from 'react';
import { ResumeData } from '@/types/resume';
import { DEFAULT_THEMES } from '@/constants/themes';
import { measureResumeContent } from '@/utils/resumeContentMeasurer';
import { useResumePageBuilder } from '@/hooks/useResumePageBuilder';

interface MeasuredMultiPagePreviewProps {
  data: ResumeData;
}

const MeasuredMultiPagePreview: React.FC<MeasuredMultiPagePreviewProps> = ({ data }) => {
  const [pages, setPages] = useState<React.ReactNode[]>([]);
  const measuringRef = useRef<HTMLDivElement>(null);
  const theme = data.theme || DEFAULT_THEMES[0];
  const { buildPages } = useResumePageBuilder();

  const visibleSections = data.sectionConfig?.filter(section => section.visible) || [];

  useEffect(() => {
    if (!measuringRef.current) return;

    const createMeasuredPages = async () => {
      console.log('Starting measured page creation...');
      
      try {
        const { headerHeight, sectionMeasurements } = await measureResumeContent(
          data,
          theme,
          visibleSections,
          measuringRef.current!
        );

        const newPages = buildPages(headerHeight, sectionMeasurements, data, theme);
        setPages(newPages);
      } catch (error) {
        console.error('Error creating measured pages:', error);
        setPages([]);
      }
    };

    createMeasuredPages();
  }, [data, visibleSections, theme, buildPages]);

  return (
    <div className="space-y-8">
      {/* Hidden measuring container */}
      <div ref={measuringRef} className="sr-only" />
      
      {/* Actual pages */}
      {pages}
    </div>
  );
};

export default MeasuredMultiPagePreview;
