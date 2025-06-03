
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft, Sparkles } from 'lucide-react';

const AuthHeader = () => {
  const navigate = useNavigate();

  return (
    <>
      {/* Header with brand logo and back button */}
      <header className="relative z-20 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-brand-cyan" />
          <span className="text-lg sm:text-xl font-bold text-white">ResumeAI</span>
        </div>
        <Button
          onClick={() => navigate('/')}
          variant="ghost"
          className="text-white hover:bg-white/10 backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </header>

      {/* Welcome badge */}
      <div className="text-center mb-6">
        <div className="inline-flex items-center bg-white/10 text-white border-white/20 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm backdrop-blur-sm rounded-full mb-4">
          <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
          Join thousands of professionals
        </div>
      </div>
    </>
  );
};

export default AuthHeader;
