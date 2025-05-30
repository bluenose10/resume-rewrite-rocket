import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, Download, Zap } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartBuilding: () => void;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 px-2">
            Get Your Perfect Resume in 3 Simple Steps
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto px-4">
            Our streamlined process makes it easy to create a professional resume that gets results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-brand-cyan w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-cyan shadow-2xl">
              <FileText className="h-8 w-8 sm:h-10 sm:w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-xs sm:text-sm font-bold px-3 py-1 rounded-full inline-block mb-3 sm:mb-4 shadow-lg">
              STEP 1
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Add Your Information</h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed px-2">
              Fill in your personal details, work experience, education, and skills using our intuitive form
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-cyan shadow-2xl">
              <Wand2 className="h-8 w-8 sm:h-10 sm:w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-xs sm:text-sm font-bold px-3 py-1 rounded-full inline-block mb-3 sm:mb-4 shadow-lg">
              STEP 2
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">AI Optimizes Your Content</h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed px-2">
              Our AI analyzes and enhances your content for ATS compatibility and maximum impact with recruiters
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6 glow-cyan shadow-2xl">
              <Download className="h-8 w-8 sm:h-10 sm:w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-xs sm:text-sm font-bold px-3 py-1 rounded-full inline-block mb-3 sm:mb-4 shadow-lg">
              STEP 3
            </div>
            <h3 className="text-xl sm:text-2xl font-semibold text-white mb-3 sm:mb-4">Download Your Resume</h3>
            <p className="text-sm sm:text-base text-white/80 leading-relaxed px-2">
              Get your professional, ATS-optimized resume as a PDF ready to send to employers
            </p>
          </div>
        </div>

        <div className="text-center mt-8 sm:mt-12 px-4">
          <Button 
            size="lg" 
            onClick={onStartBuilding}
            className="shadow-2xl w-full sm:w-auto"
          >
            <Zap className="h-4 w-4 mr-2" />
            Start Building Your Resume Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
