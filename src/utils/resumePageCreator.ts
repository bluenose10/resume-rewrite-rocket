
import React from 'react';
import { ColorTheme } from '@/types/resume';
import { PAGE_HEIGHT, PAGE_MARGIN } from './pageBreakUtils';

export const createResumePage = (
  content: React.ReactNode[], 
  pageIndex: number, 
  theme: ColorTheme
): React.ReactNode => (
  React.createElement('div', {
    key: pageIndex,
    className: "resume-page relative bg-white shadow-lg border border-gray-200 mx-auto",
    style: {
      width: `794px`,
      minHeight: `${PAGE_HEIGHT}px`,
      padding: `${PAGE_MARGIN}px`,
      pageBreakAfter: 'always'
    }
  }, [
    React.createElement('div', {
      key: 'content',
      className: "space-y-6"
    }, content),
    React.createElement('div', {
      key: 'page-number',
      className: "absolute bottom-4 right-4 text-xs text-gray-400",
      style: { color: theme.text }
    }, `Page ${pageIndex + 1}`)
  ])
);

export const createEmptyPage = (theme: ColorTheme): React.ReactNode => (
  React.createElement('div', {
    key: "empty",
    className: "resume-page bg-white shadow-lg border border-gray-200 mx-auto flex items-center justify-center text-gray-500",
    style: {
      width: `794px`,
      height: `${PAGE_HEIGHT}px`,
    }
  }, React.createElement('div', {
    className: "text-center"
  }, [
    React.createElement('p', { key: 'title', className: "text-lg" }, "Start adding content to see your resume preview"),
    React.createElement('p', { key: 'subtitle', className: "text-sm mt-2" }, "Fill in the form on the left to begin")
  ]))
);
