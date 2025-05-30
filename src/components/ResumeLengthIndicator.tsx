
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
  
  const getAdvice = () => {
    if (estimatedPages === 1) {
      return {
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200',
        icon: '✅',
        message: 'Perfect length! This resume should fit nicely on one page.'
      };
    } else if (estimatedPages === 2) {
      return {
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200',
        icon: '📄',
        message: '2-page resume. Consider if all content is essential, or if you have 10+ years of experience, this length is appropriate.'
      };
    } else {
      return {
        color: 'text-amber-600',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: '⚠️',
        message: 'This resume may be too long. Consider prioritizing your most relevant and impactful experiences.'
      };
    }
  };

  const advice = getAdvice();

  return (
    <Card className={`${advice.bgColor} ${advice.borderColor}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <FileText className={`h-5 w-5 ${advice.color} mt-0.5`} />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-sm">Estimated Length:</span>
              <span className={`font-bold ${advice.color}`}>
                {estimatedPages} page{estimatedPages > 1 ? 's' : ''}
              </span>
            </div>
            <div className={`text-sm ${advice.color} flex items-start gap-2`}>
              <span>{advice.icon}</span>
              <span>{advice.message}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResumeLengthIndicator;
