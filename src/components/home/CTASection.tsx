
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onStartBuilding: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="py-20 px-4 hero-gradient relative overflow-hidden">
      {/* Same background decorations as hero section */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/10 rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
          Create a professional resume that gets you noticed by recruiters and passes ATS systems
        </p>
        <Button 
          size="lg" 
          variant="default"
          onClick={onStartBuilding}
          className="text-lg px-8 py-4 h-auto font-semibold"
        >
          Create Your Resume Now - Free
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
