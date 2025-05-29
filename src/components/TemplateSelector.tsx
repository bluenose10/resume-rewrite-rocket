
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { Palette, Award, Briefcase, GraduationCap, Code, Building } from 'lucide-react';

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: 'modern' | 'classic' | 'creative' | 'executive' | 'tech' | 'academic';
  features: string[];
}

const TEMPLATES: Template[] = [
  {
    id: 'modern-tech',
    name: 'Modern Tech',
    description: 'Clean, minimalist design perfect for tech professionals',
    icon: <Code className="h-5 w-5" />,
    category: 'modern',
    features: ['ATS-Optimized', 'Skills Highlighted', 'Project Focused']
  },
  {
    id: 'classic-corporate',
    name: 'Classic Corporate',
    description: 'Traditional professional layout for corporate roles',
    icon: <Building className="h-5 w-5" />,
    category: 'classic',
    features: ['Conservative Design', 'Experience Focus', 'Industry Standard']
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Portfolio',
    description: 'Eye-catching design for creative professionals',
    icon: <Palette className="h-5 w-5" />,
    category: 'creative',
    features: ['Visual Appeal', 'Portfolio Ready', 'Brand Focused']
  },
  {
    id: 'executive-leadership',
    name: 'Executive Leadership',
    description: 'Sophisticated layout for senior-level positions',
    icon: <Award className="h-5 w-5" />,
    category: 'executive',
    features: ['Authority Design', 'Achievement Focus', 'Leadership Emphasis']
  },
  {
    id: 'academic-research',
    name: 'Academic Research',
    description: 'Detailed format for academic and research positions',
    icon: <GraduationCap className="h-5 w-5" />,
    category: 'academic',
    features: ['Publication Ready', 'Research Focused', 'Detailed Format']
  },
  {
    id: 'entry-level',
    name: 'Entry Level',
    description: 'Perfect for new graduates and career starters',
    icon: <Briefcase className="h-5 w-5" />,
    category: 'modern',
    features: ['Education Focus', 'Skills Emphasis', 'Growth Oriented']
  }
];

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string) => void;
}

const TemplateSelector: React.FC<TemplateSelectorProps> = ({
  selectedTemplate,
  onTemplateChange
}) => {
  const getCategoryColor = (category: Template['category']) => {
    const colors = {
      modern: 'bg-blue-100 text-blue-800',
      classic: 'bg-gray-100 text-gray-800',
      creative: 'bg-purple-100 text-purple-800',
      executive: 'bg-gold-100 text-gold-800',
      tech: 'bg-green-100 text-green-800',
      academic: 'bg-indigo-100 text-indigo-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Palette className="h-5 w-5" />
          Resume Template
        </CardTitle>
      </CardHeader>
      <CardContent>
        <RadioGroup
          value={selectedTemplate}
          onValueChange={onTemplateChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {TEMPLATES.map((template) => (
            <div key={template.id} className="relative">
              <RadioGroupItem 
                value={template.id} 
                id={template.id}
                className="sr-only"
              />
              <Label
                htmlFor={template.id}
                className={`block p-4 border-2 rounded-lg cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{template.name}</h3>
                      <Badge variant="secondary" className={`text-xs ${getCategoryColor(template.category)}`}>
                        {template.category}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.features.map((feature, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </Label>
            </div>
          ))}
        </RadioGroup>
      </CardContent>
    </Card>
  );
};

export default TemplateSelector;
