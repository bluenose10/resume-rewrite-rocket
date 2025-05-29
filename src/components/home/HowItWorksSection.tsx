
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, Wand2, Download, Zap } from 'lucide-react';

interface HowItWorksSectionProps {
  onStartBuilding: () => void;
}

const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-brand-dark-navy to-brand-medium-blue">
      <div className="container mx-auto">
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
            <div className="bg-brand-cyan w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
              <FileText className="h-10 w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
              STEP 1
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Add Your Information</h3>
            <p className="text-white/70 leading-relaxed">
              Fill in your personal details, work experience, education, and skills using our intuitive form
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
              <Wand2 className="h-10 w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
              STEP 2
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">AI Optimizes Your Content</h3>
            <p className="text-white/70 leading-relaxed">
              Our AI analyzes and enhances your content for ATS compatibility and maximum impact with recruiters
            </p>
          </div>

          <div className="text-center">
            <div className="bg-brand-cyan w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
              <Download className="h-10 w-10 text-brand-dark-navy" />
            </div>
            <div className="bg-brand-cyan text-brand-dark-navy text-sm font-bold px-3 py-1 rounded-full inline-block mb-4">
              STEP 3
            </div>
            <h3 className="text-2xl font-semibold text-white mb-4">Download Your Resume</h3>
            <p className="text-white/70 leading-relaxed">
              Get your professional, ATS-optimized resume as a PDF ready to send to employers
            </p>
          </div>
        </div>

        <div className="text-center mt-12">
          <Button 
            size="lg" 
            onClick={onStartBuilding}
            className="text-lg px-8 py-4 h-auto"
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
