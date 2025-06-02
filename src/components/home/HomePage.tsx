
import React from 'react';
import { FileText } from 'lucide-react';
import MainNavigation from '@/components/navigation/MainNavigation';
import HeroSection from './HeroSection';
import FeaturesSection from './FeaturesSection';
import HowItWorksSection from './HowItWorksSection';
import TestimonialsSection from './TestimonialsSection';
import CTASection from './CTASection';
import { useResumeStats } from '@/hooks/useResumeStats';

interface HomePageProps {
  onStartBuilding: () => void;
}

const HomePage: React.FC<HomePageProps> = ({ onStartBuilding }) => {
  const { stats } = useResumeStats();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navigation Header */}
      <header className="w-full bg-white/80 backdrop-blur-sm border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FileText className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">ResumeAI</span>
          </div>
          <MainNavigation />
        </div>
      </header>

      {/* Main Content */}
      <main>
        <HeroSection onStartBuilding={onStartBuilding} totalResumes={stats.totalResumes} />
        <FeaturesSection />
        <HowItWorksSection onStartBuilding={onStartBuilding} />
        <TestimonialsSection />
        <CTASection onStartBuilding={onStartBuilding} />
      </main>
    </div>
  );
};

export default HomePage;
