
import React from 'react';
import { ResumeData } from '@/types/resume';
import MeasuredMultiPagePreview from './MeasuredMultiPagePreview';

interface MultiPageResumePreviewProps {
  data: ResumeData;
}

const MultiPageResumePreview: React.FC<MultiPageResumePreviewProps> = ({ data }) => {
  return <MeasuredMultiPagePreview data={data} />;
};

export default MultiPageResumePreview;
