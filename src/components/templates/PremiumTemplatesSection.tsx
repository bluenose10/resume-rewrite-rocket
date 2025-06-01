
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Star, Crown, Check } from 'lucide-react';
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
    description: 'Sophisticated design for senior-level positions',
    features: ['Executive Layout', 'Achievement Focus', 'Leadership Style'],
    previewImage: '/lovable-uploads/Executive-Professional.png',
    category: 'executive'
  },
  {
    id: 'Modern-Creative',
    name: 'Modern-Creative',
    displayName: 'Modern Creative',
    description: 'Eye-catching design for creative professionals',
    features: ['Visual Appeal', 'Portfolio Ready', 'Creative Elements'],
    previewImage: '/lovable-uploads/Modern-Creative.png',
    category: 'creative'
  },
  {
    id: 'Tech-Minimalist',
    name: 'Tech-Minimalist',
    displayName: 'Tech Minimalist',
    description: 'Clean design perfect for software engineers',
    features: ['Clean Design', 'Skills Focused', 'ATS Optimized'],
    previewImage: '/lovable-uploads/Tech-Minimalist.png',
    category: 'technical'
  },
  {
    id: 'Academic-Research',
    name: 'Academic-Research',
    displayName: 'Academic Research',
    description: 'Detailed format for academic positions',
    features: ['Publication Ready', 'Research Focused', 'Academic Standards'],
    previewImage: '/lovable-uploads/Academic-Research.png',
    category: 'academic'
  },
  {
    id: 'Modern-Professional',
    name: 'Modern-Professional',
    displayName: 'Modern Professional',
    description: 'Contemporary design for all industries',
    features: ['Versatile Design', 'Modern Layout', 'Professional Appeal'],
    previewImage: '/lovable-uploads/Modern-Professional.png',
    category: 'modern'
  }
];

const getCategoryColor = (category: Template['category']) => {
  const colors = {
    executive: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
    creative: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    technical: 'bg-green-500/20 text-green-300 border-green-500/30',
    academic: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
    modern: 'bg-orange-500/20 text-orange-300 border-orange-500/30'
  };
  return colors[category];
};

const PremiumTemplatesSection: React.FC = () => {
  const [purchasingTemplate, setPurchasingTemplate] = useState<string | null>(null);
  const { toast } = useToast();

  const handlePurchaseTemplate = async (template: Template) => {
    setPurchasingTemplate(template.id);
    
    try {
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
    <section className="py-16 px-4 sm:px-6 lg:px-8 hero-gradient relative overflow-hidden">
      {/* Background decorations matching the app theme */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-20 -left-20 w-32 h-32 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Crown className="h-8 w-8 text-brand-cyan" />
            <h2 className="text-responsive-2xl font-bold text-white">
              Premium Word Templates
            </h2>
          </div>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
            Professional Microsoft Word resume templates designed by experts. 
            Download instantly and customize in Word.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Star className="h-5 w-5 text-brand-cyan" />
            <span className="text-sm font-medium text-gray-400">
              Used by 10,000+ professionals worldwide
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {PREMIUM_TEMPLATES.map((template) => (
            <Card key={template.id} className="group bg-white/15 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:glow-cyan">
              <CardHeader className="p-0">
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={template.previewImage}
                    alt={`${template.displayName} Resume Template`}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/placeholder.svg';
                    }}
                  />
                  <Badge 
                    className={`absolute top-3 right-3 ${getCategoryColor(template.category)} border`}
                  >
                    {template.category}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="p-5">
                <CardTitle className="text-lg font-bold mb-2 text-white group-hover:text-brand-cyan transition-colors">
                  {template.displayName}
                </CardTitle>
                
                <p className="text-gray-300 mb-4 text-sm">
                  {template.description}
                </p>

                <div className="space-y-3 mb-5">
                  <div className="flex flex-wrap gap-1">
                    {template.features.map((feature, index) => (
                      <div key={index} className="flex items-center gap-1 text-xs text-gray-400">
                        <Check className="h-3 w-3 text-brand-cyan" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-brand-cyan">$2</span>
                    <span className="text-xs text-gray-400">One-time purchase</span>
                  </div>
                  
                  <Button
                    onClick={() => handlePurchaseTemplate(template)}
                    disabled={purchasingTemplate === template.id}
                    className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black font-semibold py-2.5 glow-cyan"
                  >
                    {purchasingTemplate === template.id ? (
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Download className="h-4 w-4" />
                        Download Word Template
                      </div>
                    )}
                  </Button>
                  
                  <p className="text-xs text-gray-400 text-center">
                    Instant download • 3 downloads • Word format
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Benefits section */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-4xl mx-auto border border-white/20">
            <h3 className="text-lg font-semibold mb-4 text-white">Why Choose Our Premium Templates?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-cyan" />
                Microsoft Word format
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-cyan" />
                Instant download
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-cyan" />
                ATS-optimized
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-cyan" />
                Easy to customize
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-cyan" />
                Industry-specific
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-brand-cyan" />
                3 downloads included
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremiumTemplatesSection;
