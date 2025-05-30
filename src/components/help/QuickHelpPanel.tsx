
import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { BookOpen } from 'lucide-react';

interface QuickHelpPanelProps {
  children?: React.ReactNode;
}

const QuickHelpPanel: React.FC<QuickHelpPanelProps> = ({ children }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        {children || (
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Quick Tips
          </Button>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Quick Resume Tips</SheetTitle>
        </SheetHeader>
        <ScrollArea className="h-full mt-6">
          <div className="space-y-6 pr-4">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="font-semibold text-blue-800 mb-2">⏱️ Remember:</p>
              <p className="text-blue-700">Recruiters spend just 5-7 seconds on your resume!</p>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">📏 Length & Structure</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Keep it to 1 page maximum</li>
                <li>• Order: Experience → Education → Projects → Skills</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">✍️ Writing Tips</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Use 3-5 bullet points per section</li>
                <li>• Start with power verbs (built, implemented, developed)</li>
                <li>• Include numbers and impact</li>
              </ul>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">💡 Power Verbs</h4>
              <div className="text-sm text-gray-600 grid grid-cols-2 gap-1">
                <span>• Built</span>
                <span>• Implemented</span>
                <span>• Developed</span>
                <span>• Optimized</span>
                <span>• Designed</span>
                <span>• Created</span>
                <span>• Led</span>
                <span>• Improved</span>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="font-semibold text-green-800 mb-2">✅ Good Example:</p>
              <p className="text-green-700 text-sm">"Built a React dashboard that increased user engagement by 25%"</p>
              
              <p className="font-semibold text-red-800 mb-2 mt-3">❌ Avoid:</p>
              <p className="text-red-700 text-sm">"Made a nice dashboard for users"</p>
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
};

export default QuickHelpPanel;
