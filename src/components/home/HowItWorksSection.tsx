
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, Download, Zap } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartBuilding: () => void;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="py-20 px-4 hero-gradient relative overflow-hidden">
      {/* Same background decorations as hero section */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/10 rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Get Your Perfect Resume in 3 Simple Steps
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Our streamlined process makes it easy to create a professional resume that gets results
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="bg-brand-cyan w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan shadow-2xl">
              <FileText className="h-10 w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 shadow-lg">
              STEP 1
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Add Your Information</h3>
            <p className="text-white/80 leading-relaxed">
              Fill in your personal details, work experience, education, and skills using our intuitive form
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan shadow-2xl">
              <Wand2 className="h-10 w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 shadow-lg">
              STEP 2
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">AI Optimizes Your Content</h3>
            <p className="text-white/80 leading-relaxed">
              Our AI analyzes and enhances your content for ATS compatibility and maximum impact with recruiters
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan shadow-2xl">
              <Download className="h-10 w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-sm font-bold px-3 py-1 rounded-full inline-block mb-4 shadow-lg">
              STEP 3
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Download Your Resume</h3>
            <p className="text-white/80 leading-relaxed">
              Get your professional, ATS-optimized resume as a PDF ready to send to employers
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            onClick={onStartBuilding}
            className="text-lg px-8 py-4 h-auto shadow-2xl"
          >
            <Zap className="h-5 w-5 mr-2" />
            Start Building Your Resume Now
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
