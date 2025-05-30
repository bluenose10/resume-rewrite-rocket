
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onStartBuilding: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 sm:mb-6 px-2">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-2xl mx-auto px-4">
          Create a professional resume that gets you noticed by recruiters and passes ATS systems
        </p>
        <Button 
          size="lg" 
          variant="default"
          onClick={onStartBuilding}
          className="font-semibold w-full sm:w-auto"
        >
          Create Your Resume Now - Free
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
