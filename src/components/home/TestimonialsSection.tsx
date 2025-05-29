
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-20 px-4 bg-white">
      <div className="container mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            See how our AI-powered resume builder helped professionals land their dream jobs
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <span className="font-semibold text-gray-900">Landed at Google</span>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "The AI optimization feature transformed my generic job descriptions into compelling achievements. Got 3 interviews in the first week!"
              </p>
              <div className="text-sm text-gray-500">- Sarah K., Software Engineer</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <span className="font-semibold text-gray-900">50% More Interviews</span>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "After using this resume builder, my interview rate increased dramatically. The ATS optimization really works!"
              </p>
              <div className="text-sm text-gray-500">- Michael R., Marketing Manager</div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-lg">
            <CardContent className="p-8">
              <div className="flex items-center mb-4">
                <CheckCircle className="h-6 w-6 text-green-500 mr-2" />
                <span className="font-semibold text-gray-900">Career Change Success</span>
              </div>
              <p className="text-gray-600 mb-4 italic">
                "Switching careers seemed impossible until I used this tool. The AI helped highlight my transferable skills perfectly."
              </p>
              <div className="text-sm text-gray-500">- Jennifer L., Data Analyst</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
