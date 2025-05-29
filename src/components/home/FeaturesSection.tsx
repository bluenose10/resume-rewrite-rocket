
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Shield, Wand2, FileText, Clock } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
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
