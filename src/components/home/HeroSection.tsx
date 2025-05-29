
import React from 'react';
import { Button } from '@/components/ui/button';
import AnimatedCounter from '@/components/AnimatedCounter';
import Logo from '@/components/Logo';
import PWADownloadBanner from '@/components/pwa/PWADownloadBanner';

interface HeroSectionProps {
  onStartBuilding: () => void;
  totalResumes: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartBuilding, totalResumes }) => {
  return (
    <section className="relative py-20 px-4 overflow-hidden hero-gradient">
      {/* Logo at the top */}
      <div className="container mx-auto relative z-10">
        <div className="flex justify-center mb-8">
          <Logo />
        </div>
      </div>

      {/* Enhanced background decorations with floating particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-cyan/10 rounded-full opacity-20"></div>
      </div>
      
      <div className="container mx-auto text-center relative z-10">
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
