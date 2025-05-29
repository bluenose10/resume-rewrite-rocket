
import React from 'react';
import { Button } from '@/components/ui/button';

interface CTASectionProps {
  onStartBuilding: () => void;
}

const CTASection: React.FC<CTASectionProps> = ({ onStartBuilding }) => {
  return (
    <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
      <div className="container mx-auto text-center">
        <h2 className="text-4xl font-bold text-white mb-6">
          Ready to Land Your Dream Job?
        </h2>
        <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
          Join thousands of successful job seekers who used our AI-powered resume builder to get hired faster
        </p>
        <Button 
          size="lg" 
          variant="secondary"
          onClick={onStartBuilding}
          className="text-lg px-8 py-4 h-auto bg-white text-blue-600 hover:bg-gray-50"
        >
          Create Your Resume Now - Free
        </Button>
      </div>
    </section>
  );
};

export default CTASection;
