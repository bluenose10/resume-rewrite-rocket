
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onStartBuilding: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="py-20 px-4 cta-gradient relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-60 h-60 bg-white/10 rounded-full opacity-20"></div>
        <div className="absolute bottom-0 -left-20 w-80 h-80 bg-brand-dark-navy/30 rounded-full opacity-30"></div>
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
          variant="secondary"
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
