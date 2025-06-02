
import React from 'react';
import { useResumeStats } from '@/hooks/useResumeStats';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';

interface HomePageProps {
  onStartBuilding: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartBuilding }) => {
  // Use stats hook with error handling
  let stats = { totalResumes: 0 };
  try {
    const { stats: resumeStats } = useResumeStats();
    stats = resumeStats;
  } catch (error) {
    console.log('Stats loading deferred:', error);
    // Use default stats if hook fails
  }

  return (
    <div className="min-h-screen hero-gradient relative overflow-hidden">
      {/* Mobile-optimized background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 sm:-top-40 -right-20 sm:-right-40 w-40 sm:w-80 h-40 sm:h-80 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-10 sm:top-20 -left-10 sm:-left-20 w-30 sm:w-60 h-30 sm:h-60 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-10 sm:bottom-20 right-10 sm:right-20 w-20 sm:w-40 h-20 sm:h-40 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 sm:w-96 h-48 sm:h-96 bg-brand-cyan/10 rounded-full opacity-20"></div>
        <div className="absolute top-3/4 -left-20 sm:-left-40 w-36 sm:w-72 h-36 sm:h-72 bg-brand-medium-blue/20 rounded-full opacity-25 floating-particle"></div>
        <div className="absolute bottom-1/4 right-1/4 w-28 sm:w-56 h-28 sm:h-56 bg-brand-cyan/15 rounded-full opacity-30 floating-particle"></div>
      </div>
      
      {/* All sections with mobile-first design */}
      <div className="relative z-10">
        <HeroSection 
          onStartBuilding={onStartBuilding}
          totalResumes={stats.totalResumes}
        />
        <FeaturesSection />
        <HowItWorksSection onStartBuilding={onStartBuilding} />
        <TestimonialsSection />
        <CTASection onStartBuilding={onStartBuilding} />
      </div>
    </div>
  );
};

export default HomePage;
