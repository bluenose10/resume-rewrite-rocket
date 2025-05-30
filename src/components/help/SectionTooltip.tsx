
import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface SectionTooltipProps {
  content: string;
  className?: string;
}

const SectionTooltip: React.FC<SectionTooltipProps> = ({ content, className = "" }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <HelpCircle className={`h-4 w-4 text-gray-400 hover:text-gray-600 cursor-help ${className}`} />
        </TooltipTrigger>
        <TooltipContent className="max-w-xs bg-white border shadow-lg">
          <p className="text-sm">{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default SectionTooltip;
