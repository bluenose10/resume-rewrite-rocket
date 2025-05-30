
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { HelpCircle } from 'lucide-react';

interface ResumeHelpModalProps {
  children?: React.ReactNode;
}

const ResumeHelpModal: React.FC<ResumeHelpModalProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            💡 Tips & Guidelines
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Resume Optimization Guidelines</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-full max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Introduction */}
            <div className="space-y-3">
              <p className="text-lg font-medium">You've got the skills.</p>
              <p className="text-lg font-medium">You've built impressive projects.</p>
              <p className="text-lg font-medium">Now it's time to make sure recruiters and engineering managers WANT TO HIRE YOU at first glance.</p>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="font-semibold text-amber-800">
                  💡 Did you know? Recruiters spend just 5-7 seconds on your resume.
                </p>
                <p className="text-amber-700 mt-1">Let's make those seconds count!</p>
              </div>
            </div>

            <Separator />

            {/* Resume Guidelines */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🔥 Resume Optimization Guidelines
              </h3>
              <p className="font-medium">Make it stand out:</p>
              
              <ul className="space-y-3 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Limit it to 1 PAGE.</strong> No exceptions.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Follow this section order:</strong> Work Experience (if you have any) → Education → Projects → Skills</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Use 3-5 bullet points</strong> per experience/project</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Start each point with a power verb</strong> (e.g., built, implemented, developed)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span><strong>Focus on your impact and results, give numbers</strong></span>
                </li>
              </ul>

              <div className="bg-gray-50 border rounded-lg p-4 space-y-3">
                <p className="font-semibold">Example:</p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-red-500">😭</span>
                    <span className="text-red-600"><strong>Bad:</strong> "I made a pretty onboarding for our app."</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-500">💰</span>
                    <span className="text-green-600"><strong>Good:</strong> "Built a new onboarding in Next.js that resulted in 10% higher sign-ups"</span>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* LinkedIn Guidelines */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold flex items-center gap-2">
                🧠 LinkedIn Optimization
              </h3>
              
              <ul className="space-y-3 list-none">
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Copy your optimized resume content</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Add a professional profile picture (good lighting, friendly smile)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Craft a compelling headline: [Role - Interest/Value Proposition]</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Write an engaging "About" section (1-2 short paragraphs)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>Showcase your best work in the "Featured" section</span>
                </li>
              </ul>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResumeHelpModal;
