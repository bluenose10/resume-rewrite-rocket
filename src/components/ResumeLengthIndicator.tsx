
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { FileText, Info } from 'lucide-react';
import { ResumeData } from '@/types/resume';

interface ResumeLengthIndicatorProps {
  data: ResumeData;
}

const ResumeLengthIndicator: React.FC<ResumeLengthIndicatorProps> = ({ data }) => {
  // Estimate content length based on sections with content
  const calculateEstimatedPages = () => {
    let contentScore = 0;
    
    // Count sections with substantial content
    if (data.personalStatement?.length > 50) contentScore += 0.1;
    if (data.summary?.length > 50) contentScore += 0.1;
    if (data.experience?.length > 0) contentScore += data.experience.length * 0.15;
    if (data.education?.length > 0) contentScore += data.education.length * 0.1;
    if (data.projects?.length > 0) contentScore += data.projects.length * 0.12;
    if (data.skills?.length > 5) contentScore += 0.1;
    if (data.achievements?.length > 0) contentScore += data.achievements.length * 0.08;
    if (data.certifications?.length > 0) contentScore += data.certifications.length * 0.06;
    if (data.languages?.length > 0) contentScore += 0.05;
    if (data.volunteerExperience?.length > 0) contentScore += data.volunteerExperience.length * 0.1;
    if (data.publications?.length > 0) contentScore += data.publications.length * 0.08;
    if (data.references?.length > 0) contentScore += 0.1;
    if (data.interests?.length > 3) contentScore += 0.05;
    
    // Base content always takes some space
    contentScore += 0.3;
    
    return Math.max(1, Math.ceil(contentScore));
  };

  const estimatedPages = calculateEstimatedPages();
  
  const getInfo = () => {
    if (estimatedPages === 1) {
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: '📄',
        message: 'Your resume will fit on one page - concise and focused.'
      };
    } else if (estimatedPages === 2) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '📋',
        message: 'Your resume spans 2 pages - good for experienced professionals with substantial content.'
      };
    } else {
      return {
        color: 'text-purple-600',
        bgColor: 'bg-purple-50',
        borderColor: 'border-purple-200',
        icon: '📚',
        message: `Your resume spans ${estimatedPages} pages - comprehensive and detailed.`
      };
    }
  };

  const info = getInfo();

  return (
    <Card className={`${info.bgColor} ${info.borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <FileText className={`h-5 w-5 ${info.color} mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">Estimated Length:</span>
              <span className={`font-bold ${info.color}`}>
                {estimatedPages} page{estimatedPages > 1 ? 's' : ''}
              </span>
            </div>
            <div className={`text-sm ${info.color} flex items-start gap-2`}>
              <span>{info.icon}</span>
              <span>{info.message}</span>
            </div>
            <div className="mt-2 text-xs text-gray-600">
              <Info className="h-3 w-3 inline mr-1" />
              You have complete control over your resume length - add as much detail as you need.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeLengthIndicator;
