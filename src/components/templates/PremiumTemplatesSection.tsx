
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  category: 'executive' | 'creative' | 'technical' | 'academic';
}

const TEMPLATES_BY_CATEGORY: Record<string, Template[]> = {
  executive: [
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
      id: 'Corporate-Leader',
      name: 'Corporate-Leader',
      displayName: 'Corporate Leader',
      description: 'Premium template for C-suite professionals',
      features: ['Premium Design', 'Executive Summary', 'Board Ready'],
      previewImage: '/lovable-uploads/Executive-Professional.png',
      category: 'executive'
    },
    {
      id: 'Senior-Manager',
      name: 'Senior-Manager',
      displayName: 'Senior Manager',
      description: 'Professional template for management roles',
      features: ['Management Focus', 'Team Leadership', 'Results Driven'],
      previewImage: '/lovable-uploads/Executive-Professional.png',
      category: 'executive'
    },
    {
      id: 'Director-Level',
      name: 'Director-Level',
      displayName: 'Director Level',
      description: 'Executive template for director positions',
      features: ['Strategic Focus', 'Vision Oriented', 'Impact Driven'],
      previewImage: '/lovable-uploads/Executive-Professional.png',
      category: 'executive'
    }
  ],
  creative: [
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
      id: 'Designer-Portfolio',
      name: 'Designer-Portfolio',
      displayName: 'Designer Portfolio',
      description: 'Showcase your creative work effectively',
      features: ['Portfolio Focus', 'Visual Hierarchy', 'Brand Showcase'],
      previewImage: '/lovable-uploads/Modern-Creative.png',
      category: 'creative'
    },
    {
      id: 'Artist-Creative',
      name: 'Artist-Creative',
      displayName: 'Artist Creative',
      description: 'Artistic template for creative professionals',
      features: ['Artistic Layout', 'Creative Expression', 'Visual Impact'],
      previewImage: '/lovable-uploads/Modern-Creative.png',
      category: 'creative'
    },
    {
      id: 'Marketing-Creative',
      name: 'Marketing-Creative',
      displayName: 'Marketing Creative',
      description: 'Dynamic template for marketing roles',
      features: ['Campaign Focus', 'Creative Strategy', 'Brand Driven'],
      previewImage: '/lovable-uploads/Modern-Creative.png',
      category: 'creative'
    }
  ],
  technical: [
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
      id: 'Software-Engineer',
      name: 'Software-Engineer',
      displayName: 'Software Engineer',
      description: 'Technical template for developers',
      features: ['Code Focus', 'Project Showcase', 'Tech Stack'],
      previewImage: '/lovable-uploads/Tech-Minimalist.png',
      category: 'technical'
    },
    {
      id: 'Data-Scientist',
      name: 'Data-Scientist',
      displayName: 'Data Scientist',
      description: 'Analytics-focused template for data roles',
      features: ['Data Driven', 'Analytics Focus', 'Research Oriented'],
      previewImage: '/lovable-uploads/Tech-Minimalist.png',
      category: 'technical'
    },
    {
      id: 'DevOps-Engineer',
      name: 'DevOps-Engineer',
      displayName: 'DevOps Engineer',
      description: 'Infrastructure-focused technical template',
      features: ['Infrastructure', 'Automation', 'Cloud Native'],
      previewImage: '/lovable-uploads/Tech-Minimalist.png',
      category: 'technical'
    }
  ],
  academic: [
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
      id: 'Professor-CV',
      name: 'Professor-CV',
      displayName: 'Professor CV',
      description: 'Comprehensive CV for academic faculty',
      features: ['Teaching Focus', 'Research Portfolio', 'Academic Excellence'],
      previewImage: '/lovable-uploads/Academic-Research.png',
      category: 'academic'
    },
    {
      id: 'PhD-Resume',
      name: 'PhD-Resume',
      displayName: 'PhD Resume',
      description: 'Academic template for doctoral graduates',
      features: ['Research Focus', 'Dissertation', 'Academic Rigor'],
      previewImage: '/lovable-uploads/Academic-Research.png',
      category: 'academic'
    },
    {
      id: 'Researcher-CV',
      name: 'Researcher-CV',
      displayName: 'Researcher CV',
      description: 'Research-focused academic template',
      features: ['Publication List', 'Grant Experience', 'Lab Experience'],
      previewImage: '/lovable-uploads/Academic-Research.png',
      category: 'academic'
    }
  ]
};

const getCategoryColor = (category: Template['category']) => {
  const colors = {
    executive: 'bg-brand-cyan/20 text-brand-cyan border-brand-cyan/30',
    creative: 'bg-pink-500/20 text-pink-300 border-pink-500/30',
    technical: 'bg-green-500/20 text-green-300 border-green-500/30',
    academic: 'bg-blue-500/20 text-blue-300 border-blue-500/30'
  };
  return colors[category];
};

const PremiumTemplatesSection: React.FC = () => {
  const [purchasingTemplate, setPurchasingTemplate] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState('executive');
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
    <section className="py-12 px-4 sm:px-6 lg:px-8 hero-gradient relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-brand-cyan/20 rounded-full opacity-30 floating-particle"></div>
        <div className="absolute top-20 -left-20 w-32 h-32 bg-brand-medium-blue/30 rounded-full opacity-40 floating-particle"></div>
        <div className="absolute bottom-20 right-20 w-24 h-24 bg-brand-cyan/25 rounded-full opacity-35 floating-particle"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Crown className="h-6 w-6 text-brand-cyan" />
            <h2 className="text-responsive-2xl font-bold text-white">
              Premium Word Templates
            </h2>
          </div>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">
            Professional Microsoft Word resume templates designed by experts. 
            Download instantly and customize in Word.
          </p>
          <div className="flex items-center justify-center gap-2">
            <Star className="h-4 w-4 text-brand-cyan" />
            <span className="text-sm text-gray-400">
              Used by 10,000+ professionals worldwide
            </span>
          </div>
        </div>

        {/* Category Tabs */}
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-sm border-white/20 rounded-lg p-1">
            <TabsTrigger 
              value="executive" 
              className="data-[state=active]:bg-brand-cyan data-[state=active]:text-black text-white text-sm py-2"
            >
              Executive
            </TabsTrigger>
            <TabsTrigger 
              value="creative" 
              className="data-[state=active]:bg-brand-cyan data-[state=active]:text-black text-white text-sm py-2"
            >
              Creative
            </TabsTrigger>
            <TabsTrigger 
              value="technical" 
              className="data-[state=active]:bg-brand-cyan data-[state=active]:text-black text-white text-sm py-2"
            >
              Technical
            </TabsTrigger>
            <TabsTrigger 
              value="academic" 
              className="data-[state=active]:bg-brand-cyan data-[state=active]:text-black text-white text-sm py-2"
            >
              Academic
            </TabsTrigger>
          </TabsList>

          {/* Template Grids */}
          {Object.entries(TEMPLATES_BY_CATEGORY).map(([category, templates]) => (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="group bg-white/15 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300 hover:glow-cyan">
                    <CardHeader className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={template.previewImage}
                          alt={`${template.displayName} Resume Template`}
                          className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/placeholder.svg';
                          }}
                        />
                        <Badge 
                          className={`absolute top-2 right-2 text-xs ${getCategoryColor(template.category)} border`}
                        >
                          {template.category}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-3">
                      <CardTitle className="text-sm font-bold mb-2 text-white group-hover:text-brand-cyan transition-colors">
                        {template.displayName}
                      </CardTitle>
                      
                      <p className="text-gray-300 mb-3 text-xs">
                        {template.description}
                      </p>

                      <div className="space-y-2 mb-3">
                        <div className="flex flex-wrap gap-1">
                          {template.features.slice(0, 2).map((feature, index) => (
                            <div key={index} className="flex items-center gap-1 text-xs text-gray-400">
                              <Check className="h-2 w-2 text-brand-cyan" />
                              {feature}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-brand-cyan">$2</span>
                          <span className="text-xs text-gray-400">One-time</span>
                        </div>
                        
                        <Button
                          onClick={() => handlePurchaseTemplate(template)}
                          disabled={purchasingTemplate === template.id}
                          className="w-full bg-brand-cyan hover:bg-brand-cyan/90 text-black font-medium text-xs py-2 glow-cyan"
                          size="sm"
                        >
                          {purchasingTemplate === template.id ? (
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                              Processing...
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              <Download className="h-3 w-3" />
                              Download
                            </div>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        {/* Benefits section */}
        <div className="text-center">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 max-w-4xl mx-auto border border-white/20">
            <h3 className="text-base font-semibold mb-3 text-white">Why Choose Our Premium Templates?</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                Microsoft Word format
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                Instant download
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                ATS-optimized
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                Easy to customize
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
                Industry-specific
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-3 w-3 text-brand-cyan" />
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
