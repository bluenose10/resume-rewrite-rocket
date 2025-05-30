
import React from 'react';
import { Separator } from '@/components/ui/separator';

const PageBreakIndicator: React.FC = () => {
  return (
    <div className="my-4 relative">
      <Separator className="border-dashed border-gray-300" />
      <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white px-2">
        <span className="text-xs text-gray-400 font-medium">Page Break</span>
      </div>
    </div>
  );
};

export default PageBreakIndicator;
