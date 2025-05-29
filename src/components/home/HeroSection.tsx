
import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';

interface HeroSectionProps {
  onStartBuilding: () => void;
  totalResumes: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartBuilding, totalResumes }) => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-200 rounded-full opacity-20"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-indigo-200 rounded-full opacity-20"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-200 rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h1 className="text-5xl md:text-6xl font-bold text-blue-600 mb-6 leading-tight">
          Create your perfect resume<br />
          <span className="text-gray-900">in minutes - now with AI</span>
        </h1>
        
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
          Join thousands who landed their dream jobs with our ATS-optimized, AI-powered resume builder. 
          Professional results in minutes, not hours.
        </p>
        
        <div className="flex justify-center mb-12">
          <Button 
            size="lg" 
            onClick={onStartBuilding}
            className="text-lg px-8 py-4 h-auto"
          >
            Start Building Now - It's Free
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              <AnimatedCounter targetValue={totalResumes} />+
            </div>
            <div className="text-gray-600">Resumes Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">98%</div>
            <div className="text-gray-600">ATS Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">5 min</div>
            <div className="text-gray-600">Average Build Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
