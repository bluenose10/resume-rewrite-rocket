
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Star, Crown } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Template {
  id: string;
  name: string;
  displayName: string;
  description: string;
  features: string[];
  previewImage: string;
  category: 'executive' | 'creative' | 'technical' | 'academic' | 'modern';
}

const PREMIUM_TEMPLATES: Template[] = [
  {
    id: 'Executive-Professional',
    name: 'Executive-Professional',
    displayName: 'Executive Professional',
    description: 'Sophisticated design for senior-level positions and C-suite executives',
    features: ['Executive Layout', 'Achievement Focus', 'Leadership Emphasis', 'Premium Typography'],
    previewImage: '/lovable-uploads/Executive-Professional.png',
    category: 'executive'
  },
  {
    id: 'Modern-Creative',
    name: 'Modern-Creative',
    displayName: 'Modern Creative',
    description: 'Eye-catching design for creative professionals and designers',
    features: ['Visual Appeal', 'Portfolio Ready', 'Brand Focused', 'Creative Elements'],
    previewImage: '/lovable-uploads/Modern-Creative.png',
    category: 'creative'
  },
  {
    id: 'Tech-Minimalist',
    name: 'Tech-Minimalist',
    displayName: 'Tech Minimalist',
    description: 'Clean, code-inspired design perfect for software engineers',
    features: ['Clean Design', 'Skills Highlighted', 'Project Focused', 'ATS Optimized'],
    previewImage: '/lovable-uploads/Tech-Minimalist.png',
    category: 'technical'
  },
  {
    id: 'Academic-Research',
    name: 'Academic-Research',
    displayName: 'Academic Research',
    description: 'Detailed format for academic and research positions',
    features: ['Publication Ready', 'Research Focused', 'Detailed Format', 'Academic Standards'],
    previewImage: '/lovable-uploads/Academic-Research.png',
    category: 'academic'
  },
  {
    id: 'Modern-Professional',
    name: 'Modern-Professional',
    displayName: 'Modern Professional',
    description: 'Contemporary design that works across all industries',
    features: ['Versatile Design', 'Modern Layout', 'Professional Appeal', 'Industry Agnostic'],
    previewImage: '/lovable-uploads/Modern-Professional.png',
    category: 'modern'
  }
];

const getCategoryColor = (category: Template['category']) => {
  const colors = {
    executive: 'bg-purple-100 text-purple-800',
    creative: 'bg-pink-100 text-pink-800',
    technical: 'bg-green-100 text-green-800',
    academic: 'bg-blue-100 text-blue-800',
    modern: 'bg-orange-100 text-orange-800'
  };
  return colors[category];
};

const PremiumTemplatesSection: React.FC = () => {
  const [purchasingTemplate, setPurchasingTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchaseTemplate = async (template: Template) => {
    setPurchasingTemplate(template.id);
    
    try {
      // For demo purposes, we'll use a placeholder email
      // In a real app, this would come from authenticated user
      const userEmail = 'demo@example.com';
      
      const { data, error } = await supabase.functions.invoke('create-template-checkout', {
        body: {
          templateName: template.name,
          userEmail: userEmail
        }
      });

      if (error) {
        throw error;
      }

      // Open Stripe checkout in a new tab
      if (data?.url) {
        window.open(data.url, '_blank');
      }

    } catch (error) {
      console.error('Error creating checkout:', error);
      toast({
        title: "Purchase Failed",
        description: "Failed to create checkout session. Please try again.",
        variant: "destructive"
      });
    } finally {
      setPurchasingTemplate(null);
    }
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 to-blue-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Crown className="h-8 w-8 text-purple-600" />
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Premium Word Templates
            </h2>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional Microsoft Word resume templates designed by experts. 
            Download instantly and customize in Word - perfect for any industry.
          </p>
          <div className="flex items-center justify-center gap-2 mt-4">
            <Star className="h-5 w-5 text-yellow-500 fill-current" />
            <span className="text-sm font-medium text-gray-600">
              Used by 10,000+ professionals worldwide
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PREMIUM_TEMPLATES.map((template) => (
            <Card key={template.id} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-200 bg-white">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={template.previewImage}
                    alt={`${template.displayName} Resume Template Preview`}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <Badge 
                    className={`absolute top-3 right-3 ${getCategoryColor(template.category)}`}
                  >
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-6">
                <CardTitle className="text-xl font-bold mb-2 group-hover:text-purple-600 transition-colors">
                  {template.displayName}
                </CardTitle>
                
                <p className="text-gray-600 mb-4 text-sm leading-relaxed">
                  {template.description}
                </p>

                <div className="space-y-3 mb-6">
                  <h4 className="font-semibold text-sm text-gray-900">Key Features:</h4>
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-purple-600">$2</span>
                    <span className="text-sm text-gray-500">One-time purchase</span>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchaseTemplate(template)}
                    disabled={purchasingTemplate === template.id}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3"
                  >
                    {purchasingTemplate === template.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Word Template
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Instant download • 3 downloads included • Microsoft Word format
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg p-6 shadow-lg max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold mb-3">Why Choose Our Premium Templates?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-600">
              <div>✓ Professional Microsoft Word format</div>
              <div>✓ Instant download after purchase</div>
              <div>✓ ATS-optimized for job applications</div>
              <div>✓ Easy to customize and edit</div>
              <div>✓ Industry-specific designs</div>
              <div>✓ 3 downloads per purchase</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumTemplatesSection;
