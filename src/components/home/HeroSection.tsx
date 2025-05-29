
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
    <section className="py-20 px-4">
      {/* Welcome Button at the top */}
      <div className="container mx-auto">
        <div className="flex justify-center mb-8">
          <WelcomeButton />
        </div>
      </div>
      
      <div className="container mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Create your perfect resume<br />
          <span className="text-brand-cyan text-glow">in minutes - now with AI</span>
        </h1>
        
        <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
          Build your dream resume with our ATS-optimized, AI-powered resume builder. 
          Professional results in minutes, not hours.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
          <Button 
            size="lg" 
            onClick={onStartBuilding}
            className="text-lg px-8 py-4 h-auto font-semibold"
          >
            Start Building Now - It's Free
          </Button>
          <PWADownloadBanner />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-cyan mb-2 text-glow">
              <AnimatedCounter targetValue={totalResumes} />+
            </div>
            <div className="text-white/70">Resumes Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-cyan mb-2 text-glow">98%</div>
            <div className="text-white/70">ATS Pass Rate</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-brand-cyan mb-2 text-glow">5 min</div>
            <div className="text-white/70">Average Build Time</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
