
import React, { useEffect, useState } from 'react';
import { Separator } from '@/components/ui/separator';

interface SmartPageBreakIndicatorProps {
  elementId?: string;
}

const SmartPageBreakIndicator: React.FC<SmartPageBreakIndicatorProps> = ({ 
  elementId = 'resume-content' 
}) => {
  const [shouldShow, setShouldShow] = useState(false);

  useEffect(() => {
    const calculatePageBreaks = () => {
      const element = document.getElementById(elementId);
      if (!element) return;

      // A4 dimensions in pixels at 96 DPI
      const a4HeightPx = 1123; // 297mm converted to pixels
      const elementHeight = element.offsetHeight;
      
      // Show page break indicator if content exceeds one page
      setShouldShow(elementHeight > a4HeightPx);
    };

    // Calculate on mount and when content changes
    calculatePageBreaks();
    
    // Use ResizeObserver to detect content changes
    const resizeObserver = new ResizeObserver(calculatePageBreaks);
    const element = document.getElementById(elementId);
    
    if (element) {
      resizeObserver.observe(element);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [elementId]);

  if (!shouldShow) return null;

  return (
    <div className="my-6 relative page-break-indicator">
      <Separator className="border-dashed border-blue-300" />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-3 py-1 rounded-full border border-blue-200">
        <span className="text-xs text-blue-600 font-medium">Page 1 ends here</span>
      </div>
    </div>
  );
};

export default SmartPageBreakIndicator;
