
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-gradient-to-br from-brand-medium-blue to-brand-dark relative overflow-hidden">
      {/* Darker background with enhanced visual elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-brand-cyan/8 rounded-full opacity-60 floating-particle"></div>
        <div className="absolute top-40 -left-40 w-96 h-96 bg-brand-dark-navy/40 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-brand-cyan/12 rounded-full opacity-45 floating-particle"></div>
        <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-white/5 rounded-full opacity-40"></div>
        <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-brand-cyan/10 rounded-full opacity-50"></div>
      </div>
      
      <div className="container mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-white mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            See how our AI-powered resume builder helped professionals land their dream jobs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-none shadow-2xl bg-white/20 backdrop-blur-md border border-brand-cyan/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-brand-cyan mr-2 glow-cyan" />
                <span className="font-semibold text-white">Landed at Google</span>
              </div>
              <p className="text-white/80 mb-4 italic">
                "The AI optimization feature transformed my generic job descriptions into compelling achievements. Got 3 interviews in the first week!"
              </p>
              <div className="text-sm text-white/60">- Sarah K., Software Engineer</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-white/20 backdrop-blur-md border border-brand-cyan/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-brand-cyan mr-2 glow-cyan" />
                <span className="font-semibold text-white">50% More Interviews</span>
              </div>
              <p className="text-white/80 mb-4 italic">
                "After using this resume builder, my interview rate increased dramatically. The ATS optimization really works!"
              </p>
              <div className="text-sm text-white/60">- Michael R., Marketing Manager</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-white/20 backdrop-blur-md border border-brand-cyan/30">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-brand-cyan mr-2 glow-cyan" />
                <span className="font-semibold text-white">Career Change Success</span>
              </div>
              <p className="text-white/80 mb-4 italic">
                "Switching careers seemed impossible until I used this tool. The AI helped highlight my transferable skills perfectly."
              </p>
              <div className="text-sm text-white/60">- Jennifer L., Data Analyst</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
