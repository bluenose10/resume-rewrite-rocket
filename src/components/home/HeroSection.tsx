import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import WelcomeButton from '@/components/WelcomeButton';
import PWADownloadBanner from '@/components/pwa/PWADownloadBanner';

interface HeroSectionProps {
  onStartBuilding: () => void;
  totalResumes: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartBuilding, totalResumes }) => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      {/* Welcome Button at the top */}
      <div className="container mx-auto">
        <div className="flex justify-center mb-6 sm:mb-8">
          <WelcomeButton />
        </div>
      </div>
      
      <div className="container mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 sm:mb-6 leading-tight px-2">
          Create your perfect resume<br />
          <span className="text-brand-cyan text-glow">in minutes - now with AI</span>
        </h1>
        
        <p className="text-lg sm:text-xl text-white/80 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed px-4">
          Build your dream resume with our ATS-optimized, AI-powered resume builder. 
          Professional results in minutes, not hours.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8 sm:mb-12 px-4">
          <Button 
            size="lg" 
            onClick={onStartBuilding}
            className="font-semibold w-full sm:w-auto"
          >
            Start Building Now - It's Free
          </Button>
          <div className="w-full sm:w-auto">
            <PWADownloadBanner />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 max-w-2xl mx-auto px-4">
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-cyan mb-2 text-glow">
              <AnimatedCounter targetValue={totalResumes} />+
            </div>
            <div className="text-sm sm:text-base text-white/70">Resumes Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-cyan mb-2 text-glow">98%</div>
            <div className="text-sm sm:text-base text-white/70">ATS Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-2xl sm:text-3xl font-bold text-brand-cyan mb-2 text-glow">5 min</div>
            <div className="text-sm sm:text-base text-white/70">Average Build Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
