
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Star, Users, FileText, Sparkles, Upload } from 'lucide-react';
import AnimatedCounter from '@/components/AnimatedCounter';
import CVUploadModal from '@/components/CVUploadModal';
import UserMenu from '@/components/UserMenu';
import { useAuth } from '@/contexts/AuthContext';

interface HeroSectionProps {
  onStartBuilding: () => void;
  totalResumes: number;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onStartBuilding, totalResumes }) => {
  const { user } = useAuth();

  const handleCVUploadSuccess = (uploadedCvId: string) => {
    console.log('CV uploaded with ID:', uploadedCvId);
  };

  return (
    <section className="relative min-h-screen flex flex-col">
      {/* Header with User Menu */}
      <header className="relative z-20 flex justify-between items-center p-4 sm:p-6">
        <div className="flex items-center space-x-2">
          <FileText className="h-6 w-6 sm:h-8 sm:w-8 text-brand-cyan" />
          <span className="text-lg sm:text-xl font-bold text-white">ResumeAI</span>
        </div>
        <UserMenu />
      </header>

      {/* Main Hero Content */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 pb-8">
        <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-8">
          {/* Badge */}
          <Badge 
            variant="secondary" 
            className="bg-white/10 text-white border-white/20 px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm backdrop-blur-sm mx-auto"
          >
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            AI-Powered Resume Builder
          </Badge>

          {/* Main Heading */}
          <div className="space-y-3 sm:space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Create Your Perfect Resume with{' '}
              <span className="text-brand-cyan text-glow">AI Precision</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed px-2">
              Transform your career with our intelligent resume builder. Get ATS-optimized, 
              professionally designed resumes that land interviews.
            </p>
          </div>

          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-white/80 text-sm sm:text-base">
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 sm:w-5 sm:h-5 text-brand-cyan" />
              <span><AnimatedCounter value={totalResumes} />+ Resumes Created</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 sm:w-5 sm:h-5 text-brand-cyan" />
              <span>4.9/5 User Rating</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center pt-4 px-2">
            <Button 
              onClick={onStartBuilding}
              className="w-full sm:w-auto bg-brand-cyan hover:bg-brand-cyan/90 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg glow-cyan transition-all duration-300 hover:scale-105"
            >
              Start Building Free
              <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            
            {user && (
              <CVUploadModal onUploadSuccess={handleCVUploadSuccess}>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10 px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg backdrop-blur-sm transition-all duration-300"
                >
                  <Upload className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
                  Upload Existing CV
                </Button>
              </CVUploadModal>
            )}
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 pt-8 sm:pt-12 px-2">
            {[
              { icon: Sparkles, title: "AI-Optimized", desc: "Smart content suggestions" },
              { icon: FileText, title: "ATS-Friendly", desc: "Passes applicant tracking systems" },
              { icon: Star, title: "Professional", desc: "Industry-standard templates" }
            ].map((feature, index) => (
              <Card key={index} className="bg-white/10 border-white/20 backdrop-blur-sm hover:bg-white/20 transition-all duration-300">
                <CardContent className="p-4 sm:p-6 text-center">
                  <feature.icon className="w-6 h-6 sm:w-8 sm:h-8 text-brand-cyan mx-auto mb-2 sm:mb-3" />
                  <h3 className="font-semibold text-white text-sm sm:text-base mb-1 sm:mb-2">{feature.title}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm">{feature.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
