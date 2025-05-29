
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Wand2, FileText, Clock } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-brand-dark relative overflow-hidden">
      {/* Enhanced background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-cyan/10 rounded-full opacity-50 floating-particle"></div>
        <div className="absolute top-20 -left-20 w-60 h-60 bg-brand-medium-blue/20 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-brand-cyan/15 rounded-full opacity-35 floating-particle"></div>
        <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-brand-dark-navy/30 rounded-full opacity-25"></div>
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-brand-cyan/8 rounded-full opacity-30"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Why Choose Our Resume Builder?
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Built by career experts and powered by AI to give you the best chance of landing interviews
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/15 backdrop-blur-sm border border-brand-cyan/20">
            <CardContent className="p-8 text-center">
              <div className="bg-brand-cyan/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
                <Shield className="h-8 w-8 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">ATS-Friendly</h3>
              <p className="text-white/70">
                Optimized to pass applicant tracking systems used by 98% of Fortune 500 companies
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/15 backdrop-blur-sm border border-brand-cyan/20">
            <CardContent className="p-8 text-center">
              <div className="bg-brand-cyan/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
                <Wand2 className="h-8 w-8 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">AI-Powered</h3>
              <p className="text-white/70">
                Smart content optimization that enhances your experience descriptions for maximum impact
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/15 backdrop-blur-sm border border-brand-cyan/20">
            <CardContent className="p-8 text-center">
              <div className="bg-brand-cyan/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
                <FileText className="h-8 w-8 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Professional Template</h3>
              <p className="text-white/70">
                Clean, ATS-optimized layout designed by hiring managers and career coaches
              </p>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg hover:shadow-xl transition-shadow bg-white/15 backdrop-blur-sm border border-brand-cyan/20">
            <CardContent className="p-8 text-center">
              <div className="bg-brand-cyan/30 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 glow-cyan">
                <Clock className="h-8 w-8 text-brand-cyan" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-4">Quick & Easy</h3>
              <p className="text-white/70">
                Create a professional resume in minutes, not hours. No design skills required
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
