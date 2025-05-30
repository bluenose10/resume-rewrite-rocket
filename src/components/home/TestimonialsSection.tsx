
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6">
      <div className="container mx-auto">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 px-2">
            Success Stories
          </h2>
          <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto px-4">
            See how our AI-powered resume builder helped professionals land their dream jobs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto">
          <Card className="border-none shadow-2xl bg-white/20 backdrop-blur-md border border-brand-cyan/30">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-brand-cyan mr-2 glow-cyan" />
                <span className="font-semibold text-white text-sm sm:text-base">Landed at Google</span>
              </div>
              <p className="text-white/80 mb-4 italic text-sm sm:text-base leading-relaxed">
                "The AI optimization feature transformed my generic job descriptions into compelling achievements. Got 3 interviews in the first week!"
              </p>
              <div className="text-xs sm:text-sm text-white/60">- Sarah K., Software Engineer</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-white/20 backdrop-blur-md border border-brand-cyan/30">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-brand-cyan mr-2 glow-cyan" />
                <span className="font-semibold text-white text-sm sm:text-base">50% More Interviews</span>
              </div>
              <p className="text-white/80 mb-4 italic text-sm sm:text-base leading-relaxed">
                "After using this resume builder, my interview rate increased dramatically. The ATS optimization really works!"
              </p>
              <div className="text-xs sm:text-sm text-white/60">- Michael R., Marketing Manager</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-2xl bg-white/20 backdrop-blur-md border border-brand-cyan/30 md:col-span-2 lg:col-span-1">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 text-brand-cyan mr-2 glow-cyan" />
                <span className="font-semibold text-white text-sm sm:text-base">Career Change Success</span>
              </div>
              <p className="text-white/80 mb-4 italic text-sm sm:text-base leading-relaxed">
                "Switching careers seemed impossible until I used this tool. The AI helped highlight my transferable skills perfectly."
              </p>
              <div className="text-xs sm:text-sm text-white/60">- Jennifer L., Data Analyst</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
