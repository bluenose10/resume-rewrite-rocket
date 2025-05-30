
import React from 'react';
import { ResumeData, ColorTheme } from '@/types/resume';
import PersonalInfoHeader from '@/components/PersonalInfoHeader';
import SectionRenderer from '@/components/SectionRenderer';
import { CONTENT_HEIGHT } from '@/utils/pageBreakUtils';
import { SectionMeasurement } from '@/utils/resumeContentMeasurer';
import { createResumePage, createEmptyPage } from '@/utils/resumePageCreator';

export const useResumePageBuilder = () => {
  const buildPages = (
    headerHeight: number,
    sectionMeasurements: SectionMeasurement[],
    data: ResumeData,
    theme: ColorTheme
  ): React.ReactNode[] => {
    const newPages: React.ReactNode[] = [];
    let currentPageContent: React.ReactNode[] = [];
    let currentPageHeight = 0;
    let pageNumber = 0;

    // Add header to first page
    currentPageContent.push(
      React.createElement(PersonalInfoHeader, {
        key: "header",
        personalInfo: data.personalInfo,
        theme: theme
      })
    );
    currentPageHeight += headerHeight;

    // Process each section
    for (const measurement of sectionMeasurements) {
      console.log(`Processing section ${measurement.id} (${measurement.height}px)`);

      // Check if section fits on current page
      if (currentPageHeight + measurement.height > CONTENT_HEIGHT && currentPageContent.length > 1) {
        // Create current page and start new one
        console.log(`Creating page ${pageNumber + 1} with ${currentPageContent.length} items`);
        newPages.push(createResumePage(currentPageContent, pageNumber, theme));
        pageNumber++;
        currentPageContent = [];
        currentPageHeight = 0;
      }

      // Add section to current page
      currentPageContent.push(
        React.createElement(SectionRenderer, {
          key: measurement.id,
          sectionId: measurement.id,
          data: data,
          theme: theme
        })
      );
      currentPageHeight += measurement.height;
    }

    // Add the last page if it has content
    if (currentPageContent.length > 0) {
      console.log(`Creating final page ${pageNumber + 1} with ${currentPageContent.length} items`);
      newPages.push(createResumePage(currentPageContent, pageNumber, theme));
    }

    // Ensure at least one page exists
    if (newPages.length === 0) {
      newPages.push(createEmptyPage(theme));
    }

    console.log(`Created ${newPages.length} total pages`);
    return newPages;
  };

  return { buildPages };
};
